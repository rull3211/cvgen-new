import { Button, styled } from "@mui/material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import styles from "../editor.module.scss"
import LabelWrapper from "./LabelWrapper";
import { useCv } from "@/hooks/useCv";
import DebouncedTextField from "@/components/debouncedTextfield/DebouncedTextField";

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});
export default function PersoalDetails(){
    const cv = useCv()
    return(
        cv.personalDetails.map(pd => {
            return(
                <section key={pd.id} className={styles.experience}>
                    <section className={styles.row} >
                        <LabelWrapper label={"Jobb tittel"} >
                            <DebouncedTextField onChange={el=>cv.updatePersonalDetails("jobbtittel", el.target.value, pd.id)} value={pd.jobbtittel} fullWidth/> 
                        </LabelWrapper>
                        <LabelWrapper label={"Last opp bilde"} > 
                            <Button component="label" 
                                role={undefined} 
                                variant="contained" 
                                tabIndex={-1} 
                                startIcon={<CloudUploadIcon />}>
                                    Upload files 
                                    <VisuallyHiddenInput 
                                        type="file"
                                        multiple/>
                            </Button> 
                        </LabelWrapper>
                    </section>
                    <section className={styles.row} ><LabelWrapper label={"Fornavn"} ><DebouncedTextField fullWidth onChange={(el)=>cv.updatePersonalDetails("fornavn", el.target.value, pd.id)} value={pd.fornavn} /> </LabelWrapper><LabelWrapper  label={"Etternavn"} > <DebouncedTextField onChange={(el)=>cv.updatePersonalDetails("etternavn", el.target.value, pd.id)} value={pd.etternavn} fullWidth /> </LabelWrapper> </section>
                    <section className={styles.row} ><LabelWrapper label={"Email"} ><DebouncedTextField fullWidth onChange={(el)=>cv.updatePersonalDetails("email", el.target.value, pd.id)} value={pd.email}  /> </LabelWrapper><LabelWrapper label={"Telefon"} ><DebouncedTextField onChange={(el)=>cv.updatePersonalDetails("telefon", el.target.value, pd.id)} value={pd.telefon} fullWidth /> </LabelWrapper></section>
                    <section className={styles.row} ><LabelWrapper label={"Adresse"} ><DebouncedTextField onChange={(el)=>cv.updatePersonalDetails("adresse", el.target.value, pd.id)} value={pd.adresse} fullWidth /> </LabelWrapper></section>
                    <section className={styles.row} ><LabelWrapper label={"By"} ><DebouncedTextField  onChange={(el)=>cv.updatePersonalDetails("by", el.target.value, pd.id)} value={pd.by} fullWidth /> </LabelWrapper><LabelWrapper label={"Land"} ><DebouncedTextField onChange={(el)=>cv.updatePersonalDetails("land", el.target.value, pd.id)} value={pd.land} fullWidth /> </LabelWrapper></section>
            
                </section>
        
            )
        })
       
    )
}