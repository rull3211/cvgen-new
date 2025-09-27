
import { Button } from "@mui/material"
import Experience from "./components/Experience"
import styles from "./editor.module.scss"
import { useCv } from "@/hooks/useCv"

export default function Editor(){
    const cvState = useCv()

    return <section className={styles.editor}>
        <Button onClick={cvState.addWorkExperience}>Add experience</Button>
        {cvState.workExperience.map(el=>
            <Experience type="workExperience" id={el.id} key={el.id}  label1="Jobbtittel" label2="Ansetter" label3="Fra - til" label4="By" label5="Beskrivelse"></Experience>
        )}
    </section>
}