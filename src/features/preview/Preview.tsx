import { Box, Button, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import PDFPagination from "../paginatedTest/PaginatedApp";
import Export from "../exportContainer/Export";
import styles from "./PreviewStyles.module.scss"
import { a4Height, a4HeightInCm, a4WidthInCm, a4width } from "@/constants";
import { useCv } from "@/hooks/useCv";
import { exportPDF } from "@/hooks/exportPdf";
import { usePagination } from "@/hooks/usePagination";




export default function Preview(){
   const { leftPages, rightPages} = usePagination();
  const [page, setPage] = useState(0)
  const [startExport, setExport] = useState(false)
  function handlePageAction(num:number){
    const length = Math.max(leftPages.length, rightPages.length)
    setPage((page + num + length) % length);
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

    return(
        <>
       
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
                {leftPages[page]?.map((rowIndex) =>{ 
                
                const el = cv.education[rowIndex]
                return(
                  <div key={rowIndex}>
                    <Typography>{el.tittel}</Typography>
                    <Typography>{el.institusjon}</Typography>
                    <Typography>{el.fra}</Typography>
                    <Typography>{el.til}</Typography>
                    <Typography>{el.by}</Typography>
                    <Typography>{el.beskrivelse}</Typography>
                  </div>
                )})}
              </div>        
              <div className={styles.right}>
                {rightPages[page]?.map((rowIndex) => {
                    const el = cv.workExperience[rowIndex]
                    return(
                  <div key={rowIndex}>
                    <Typography>{el.tittel}</Typography>
                    <Typography>{el.institusjon}</Typography>
                    <Typography>{el.fra}</Typography>
                    <Typography>{el.til}</Typography>
                    <Typography>{el.by}</Typography>
                    <Typography>{el.beskrivelse}</Typography>
                    </div>
                )})}
              </div>
            </div>
            
                     
            </Box>
            <section style={{display: "flex"}}>
               <Button disabled={Math.max(leftPages.length, rightPages.length) ===1} onClick={()=>handlePageAction(-1)}>Prev</Button>
              <Typography>{page+1}/{Math.max(leftPages.length, rightPages.length)}</Typography>
              <Button disabled={Math.max(leftPages.length, rightPages.length) ===1} onClick={()=>handlePageAction(+1)}>Next</Button>
            </section>
           
        </div>
        
        </>
        
    )
}