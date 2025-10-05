import { Typography } from "@mui/material";
import type { PersonalDetails } from "@/hooks/useCv";

interface Props{
    element: PersonalDetails
}


export default function PersonalDetailsContent({element}: Props){
    return(
       <section>
            <Typography>{element.fornavn} {element.etternavn}</Typography>
            <Typography>{element.jobbtittel}</Typography>
            <Typography>Details</Typography>
            <Typography>{element.adresse}</Typography>
            <Typography>{element.by}</Typography>
            <Typography>{element.land}</Typography>
            <Typography>{element.telefon}</Typography>
            <Typography>{element.email}</Typography>
         </section> 
    )
}