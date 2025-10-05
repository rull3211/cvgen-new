import { Typography } from "@mui/material";
import type {Skill} from "@/hooks/useCv";

export default function SkillContent({skill}:{skill: Skill}){
    return <Typography>
        {skill.content}
    </Typography>
}