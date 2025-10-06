import { Typography } from "@mui/material";
import type { Experience } from "@/hooks/useCv";

interface Props{
    element: Experience
}

export default function ExperienceContent({element}: Props){
    const firstLine = [element.tittel, element.institusjon, element.by]

    return(<section>
                <Typography sx={{fontWeight:700, fontSize:"0.9rem"}} >{firstLine.filter(el=>el).join(", ")}</Typography>
                <Typography sx={{fontSize: "0.7rem", opacity:"60%"}}>{element.fra} { element.fra && " - "} {!element.til && element.fra ? "Dags dato": element.til}</Typography>
                <Typography sx={{fontSize:"0.9rem"}}>{element.beskrivelse}</Typography>
            </section>)
} 