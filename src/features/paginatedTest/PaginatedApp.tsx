import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Typography } from "@mui/material";
import styles from "../preview/PreviewStyles.module.scss";
import { usePagination } from "@/hooks/usePagination";
import { useCv } from "@/hooks/useCv";


export default function PDFPagination() {
  const leftRef = useRef<HTMLDivElement | null>(null);
  const rightRef = useRef<HTMLDivElement | null>(null);
   const cv = useCv()
  const { setLeftPages, setRightPages } = usePagination();

  const paginate = (container: HTMLDivElement): Array<Array<number>> => {
    const maxHeight = 1129;
    const children = Array.from(container.children) as Array<HTMLDivElement>;

    const tempPages: Array<Array<number>> = [];
    let currentPage: Array<number> = [];
    let currentHeight = 0;

    children.forEach((child) => {
      const itemHeight = child.getBoundingClientRect().height;
      const idx = Number(child.dataset.index);
        console.log(currentHeight + itemHeight)
      if (currentHeight + itemHeight > maxHeight) {
        tempPages.push(currentPage);
        currentPage = [idx];
        currentHeight = itemHeight;
      } else {
        currentPage.push(idx);
        currentHeight += itemHeight;
      }
    });

    if (currentPage.length > 0) tempPages.push(currentPage);

    return tempPages;
  };

  const measurePages = () => {
    if (leftRef.current) setLeftPages(paginate(leftRef.current));
    if (rightRef.current) setRightPages(paginate(rightRef.current));
  };

  // Observe column changes and re-paginate
  useEffect(() => {
    measurePages();

    const observer = new ResizeObserver(() => measurePages());
    if (leftRef.current) observer.observe(leftRef.current);
    if (rightRef.current) observer.observe(rightRef.current);

    return () => observer.disconnect();
  }, [cv.education, cv.workExperience]);

  return (
    <div>
      {/* Hidden measurement containers (always mounted) */}
      <div
        style={{
          position: "absolute",
          visibility: "hidden",
          left: 0,
          top: 0,
          width: "100%",
          pointerEvents: "none",
          zIndex: -1,
          display: "flex",
        }}
        aria-hidden
      >
        <div ref={leftRef} className={styles.left}>
          
        </div>
        <div ref={rightRef} className={styles.right}>
          { cv.workExperience.map((el, i) => (
            <div key={el.id} data-index={i}>
                <Typography>{el.tittel}</Typography>
                <Typography>{el.institusjon}</Typography>
                <Typography>{el.fra}</Typography>
                <Typography>{el.til}</Typography>
                <Typography>{el.by}</Typography>
                <Typography>{el.beskrivelse}</Typography>

            </div>
          ))}
          {cv.education.map((el, i) => (
            <div key={i} data-index={i}>
                <Typography>{el.tittel}</Typography>
                <Typography>{el.institusjon}</Typography>
                <Typography>{el.fra}</Typography>
                <Typography>{el.til}</Typography>
                <Typography>{el.by}</Typography>
                <Typography>{el.beskrivelse}</Typography>
            </div>
          ))}
        </div>
      </div>
      
    </div>
  );
}