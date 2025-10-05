import { Box, Typography } from "@mui/material";
import styles from "../preview/PreviewStyles.module.scss"
import ExperienceContent from "../pdfContents/ExperienceContent";
import PersonalDetailsContent from "../pdfContents/PersonalDetailsContent";
import { a4Height, a4HeightInCm, a4WidthInCm, a4width } from "@/constants";
import { useCv } from "@/hooks/useCv";
import { usePagination } from "@/hooks/usePagination";


type PageProps = {
  children: React.ReactNode;
};

const Page = ({ children }: PageProps) => <div className={styles.page}>{children}</div>;
interface Props{
    ref:React.RefObject<HTMLDivElement | null>
}
export default function Export(
    props:Props
){
   const { leftPages, rightPages, pageNumber} = usePagination();
    const cv = useCv()

    return(
        <>
        <div 
        style={{transformOrigin: "top left",  position: "absolute",
          visibility: "hidden",
          left: 0,
          overflow:"hidden",
          top: 0,
          width: "100%",
          pointerEvents: "none",
          zIndex: -1,
          }}>
            <Box ref={props.ref} sx={{display:"flex",flexDirection:"column"}}>
            {
            Array.from({ length: pageNumber+1 }).map((_, pageIndex) => {
                const right = cv.order.right.map(el => {
                    const pages = rightPages[el][pageIndex]
                    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                    if(pages === undefined) return null
                    return pages.map(index => {
                        const render = cv[el][index]
                        return <ExperienceContent key={render.id} element={render} />
                    })
                    
                })
                return (
                    <div className={styles.preview}>
                        <div style={{height:a4Height+"cm"}} className={styles.left}>
                          <PersonalDetailsContent element={cv.personalDetails} />
                        </div>
                        <div style={{height:a4Height+"cm"}} className={styles.right}>
                            {right}
                        </div>
                    </div>
                  
                )})}        
            </Box>
        </div>
        
        </>
        
    )
}