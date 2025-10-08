import { Button} from "@mui/material"
import LabelWrapper from "../components/LabelWrapper"
import { useCv } from "@/hooks/useCv"
import DebouncedTextField from "@/components/debouncedTextfield/DebouncedTextField"
import ClosableTab from "@/components/ClosableTab/ClosableTab";

export default function SkillsEditor(){
    const cv = useCv()
    return(
        <ClosableTab header = {"Ferdigheter"}>
           {
                cv.skills.map(skill => {
                    return (
                        <LabelWrapper key={skill.id} label={"Ferdigheter"}>
                            <DebouncedTextField  
                                onChange={el=>cv.updateSkills( "content", el.target.value, skill.id)} 
                                value={skill.content} 
                                fullWidth
                            />
                        </LabelWrapper>
                    )
                })
                }
            <Button onClick={()=>cv.addSkill()}>AddSkill</Button>
        </ClosableTab>
    )
}