import { Button, TextField, styled } from "@mui/material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import styles from "../editor.module.scss"
import LabelWrapper from "./LabelWrapper";
import { useCv } from "@/hooks/useCv";

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
        <section className={styles.experience}>
            <section className={styles.row} >
                <LabelWrapper label={"Jobb tittel"} >
                    <TextField onChange={(el)=>cv.updatePersonalDetails("jobbtittel", el.target.value)} value={cv.personalDetails.jobbtittel} fullWidth/> 
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
                                onChange={(event) => console.log(event.target.files)}
                                multiple/>
                    </Button> 
                </LabelWrapper>
            </section>
            <section className={styles.row} ><LabelWrapper label={"Fornavn"} ><TextField fullWidth onChange={(el)=>cv.updatePersonalDetails("fornavn", el.target.value)} value={cv.personalDetails.fornavn} /> </LabelWrapper><LabelWrapper  label={"Etternavn"} > <TextField onChange={(el)=>cv.updatePersonalDetails("etternavn", el.target.value)} value={cv.personalDetails.etternavn} fullWidth /> </LabelWrapper> </section>
            <section className={styles.row} ><LabelWrapper label={"Email"} ><TextField fullWidth onChange={(el)=>cv.updatePersonalDetails("email", el.target.value)} value={cv.personalDetails.email}  /> </LabelWrapper><LabelWrapper label={"Telefon"} ><TextField onChange={(el)=>cv.updatePersonalDetails("telefon", el.target.value)} value={cv.personalDetails.telefon} fullWidth /> </LabelWrapper></section>
            <section className={styles.row} ><LabelWrapper label={"Adresse"} ><TextField onChange={(el)=>cv.updatePersonalDetails("adresse", el.target.value)} value={cv.personalDetails.adresse} fullWidth /> </LabelWrapper></section>
            <section className={styles.row} ><LabelWrapper label={"By"} ><TextField  onChange={(el)=>cv.updatePersonalDetails("by", el.target.value)} value={cv.personalDetails.by} fullWidth /> </LabelWrapper><LabelWrapper label={"Land"} ><TextField onChange={(el)=>cv.updatePersonalDetails("land", el.target.value)} value={cv.personalDetails.land} fullWidth /> </LabelWrapper></section>
    
        </section>
        
    )
}