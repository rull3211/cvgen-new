import { Box, Typography } from "@mui/material";
import styles from "../preview/PreviewStyles.module.scss"
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
   const { leftPages, rightPages} = usePagination();
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
            Array.from({ length: Math.max(leftPages.length, rightPages.length) }).map((_, pageIndex) => (
                    <div className={styles.preview}>
                        <div style={{height:a4Height+"cm"}} className={styles.left}>
                            {leftPages[pageIndex]?.map((rowIndex) =>{ 
                                
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
                        <div style={{height:a4Height+"cm"}} className={styles.right}>
                            {rightPages[pageIndex]?.map((rowIndex) => {
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
                  
                ))}        
            </Box>
        </div>
        
        </>
        
    )
}