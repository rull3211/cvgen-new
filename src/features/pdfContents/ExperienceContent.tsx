import { Typography } from "@mui/material";
import type { Experience } from "@/hooks/useCv";

interface Props{
    element: Experience
}

export default function ExperienceContent({element}: Props){

    return(<div>
                <Typography>{element.tittel}</Typography>
                <Typography>{element.institusjon}</Typography>
                <Typography>{element.fra}</Typography>
                <Typography>{element.til}</Typography>
                <Typography>{element.by}</Typography>
                <Typography>{element.beskrivelse}</Typography>
            </div>)
} 