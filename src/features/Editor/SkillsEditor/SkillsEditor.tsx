import LabelWrapper from "../components/LabelWrapper"
import { useCv } from "@/hooks/useCv"
import DebouncedTextField from "@/components/debouncedTextfield/DebouncedTextField"

export default function SkillsEditor(){
    const cv = useCv()
    return(
        <section>
            {cv.skills.map(skill => {
                return (
                    <LabelWrapper key={skill.id} label={"Ferdigheter"}>
                        <DebouncedTextField  
                            onChange={el=>cv.updateSkills( "content", el.target.value, skill.id)} 
                            value={skill.content} 
                            fullWidth
                        />
                    </LabelWrapper>
                )
            })}
        </section>
    )
}