import { Box, Button, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import PDFPagination from "../paginatedTest/PaginatedApp";
import Export from "../exportContainer/Export";
import ExperienceContent from "../pdfContents/ExperienceContent";
import PersonalDetailsContent from "../pdfContents/PersonalDetailsContent";
import SummaryContent from "../pdfContents/SummaryContent";
import SkillContent from "../pdfContents/SkillsContent";
import ExportCv from "../exportContainer/ExportCv";
import styles from "./PreviewStyles.module.scss"
import { a4Height, a4HeightInCm, a4WidthInCm, a4width } from "@/constants";
import {  useCv } from "@/hooks/useCv";
import { exportPDF } from "@/hooks/exportPdf";
import { usePagination } from "@/hooks/usePagination";




export default function Preview(){
   const { leftPages, rightPages, pageNumber} = usePagination();
   const numberOfPages = pageNumber+1
  const [page, setPage] = useState(0)
  const [startExport, setExport] = useState(false)
  function handlePageAction(num:number){
    setPage((page + num + numberOfPages) % numberOfPages);
  }
     const exportPreview = () => {
        if (!previewRef.current) return;
        const node = previewRef.current;
        const html = node.outerHTML;
        const cssText = Array.from(document.styleSheets)
        .map((sheet) => {
            try {
            return Array.from(sheet.cssRules)
                .map((rule) => rule.cssText)
                .join("\n");
            } catch (e) {
            return "";
            }
        })
        .join("\n");

        exportPDF(html, cssText).finally(()=>setExport(false));
    };
    useEffect(()=>{
      if(startExport)exportPreview()
    },[startExport])
    const previewRef = useRef<HTMLDivElement>(null);
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const scale = Math.min(1, Math.min(vw / a4WidthInCm, vh / a4HeightInCm)*0.9);
    const cv = useCv()
    const right = cv.order.right.map((el) => {
        const pages = rightPages[el][page];
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (!pages) return null;
        
        return pages.map((index) => {
          const render = cv[el][index];
          if (render.type === "summary") {
            return <SummaryContent key={render.id} text={render.content} />;
          } else {
            if(index === 0){
              const text = render.type ==="workExperience"? "Arbeidserfaring" : "Utdanning"
              return<>
                <Typography sx={{fontSize: "1.5rem", fontWeight: 700 }} variant="h2">{text}</Typography>
                <ExperienceContent key={render.id} element={render} />
              </>
              }
            return <ExperienceContent key={render.id} element={render} />;
          }
        });
      });
      const left = cv.order.left.map((el) => {
        const pages = leftPages[el][page];
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (!pages) return null;

        return <section className={styles[el]} >{
          pages.map((index) => {
          const render = cv[el][index];

          if (render.type === "personalDetails") {
            return <PersonalDetailsContent key={render.id} element={render} />;
          } else {
            if( index === 0){
                        return <>
                            <Typography variant="h2">Ferdigheter</Typography>
                            <SkillContent skill={render} />
                        </>
                    }
            return <SkillContent key={render.id} skill={render} />;
          }
        })
          }</section> 
      });
    return(
        <>
        <ExportCv></ExportCv>
        <Button onClick={()=>{setExport(true)}}>Eksporter</Button>
         {startExport&&<Export ref={previewRef}></Export>}
        <div style={{transform: `scale(${scale})`,transformOrigin: "top left"}}>
          
            <Box  sx={{display:"flex",
            height: a4Height+"cm",
            width: a4width+"cm",
           
                
            }}

            >
            <PDFPagination >
            </PDFPagination>
              
            <div className={styles.preview}>
              <div className={styles.left}>
                <section>
                  {left}
                </section>
                
              </div>        
              <div className={styles.right}>
                <section>
                  {right}
                </section>
                
              </div>
            </div>
            
                     
            </Box>
            <section style={{display: "flex"}}>
               <Button disabled={numberOfPages ===1} onClick={()=>handlePageAction(-1)}>Prev</Button>
              <Typography>{page+1}/{numberOfPages}</Typography>
              <Button disabled={numberOfPages ===1} onClick={()=>handlePageAction(+1)}>Next</Button>
            </section>
           
        </div>
        
        </>
        
    )
}