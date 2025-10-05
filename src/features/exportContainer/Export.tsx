import { Box, Typography } from "@mui/material";
import styles from "../preview/PreviewStyles.module.scss"
import ExperienceContent from "../pdfContents/ExperienceContent";
import PersonalDetailsContent from "../pdfContents/PersonalDetailsContent";
import SummaryContent from "../pdfContents/SummaryContent";
import SkillContent from "../pdfContents/SkillsContent";
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
                const right = cv.order.right.map((el) => {
                        const pages = rightPages[el][pageIndex];
                        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                        if (!pages) return null;
                        
                        return pages.map((index) => {
                          const render = cv[el][index];
                          console.log(render)
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
        const pages = leftPages[el][pageIndex];
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
                            <Typography variant="h2">Skills</Typography>
                            <SkillContent skill={render} />
                        </>
                    }
            return <SkillContent key={render.id} skill={render} />;
          }
        })
          }</section> 
      });
                return (
                    <div className={styles.preview}>
                        <div style={{height:a4Height+"cm"}} className={styles.left}>
                            <section>
                                {left}
                            </section>
                          
                        </div>
                        <div style={{height:a4Height+"cm"}} className={styles.right}>
                            <section>
                                {right}
                            </section>
                            
                        </div>
                    </div>
                  
                )})}        
            </Box>
        </div>
        
        </>
        
    )
}