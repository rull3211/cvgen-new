import { Typography } from "@mui/material";
import style from "../preview/PreviewStyles.module.scss"
import type { PersonalDetails } from "@/hooks/useCv";

interface Props{
    element: PersonalDetails
}


export default function PersonalDetailsContent({element}: Props){
    const {adresse, by, land, telefon, email} =  element
    const hasDetails = adresse || by || land || telefon || email
    return(<section>
            <section className={ style.tittel }>
               <Typography variant="h2">{element.fornavn} {element.etternavn}</Typography>
               <span/>
                <Typography>{element.jobbtittel}</Typography> 
            </section>
            <section className={style.details}>
              {hasDetails && <Typography variant="h2">Details</Typography>}
                <Typography>{adresse}</Typography>
                <Typography>{by}</Typography>
                <Typography>{land}</Typography>
                <Typography>{telefon}</Typography>
                <Typography>{email}</Typography>  
            </section>
        </section>
       
           
            
       
    )
}