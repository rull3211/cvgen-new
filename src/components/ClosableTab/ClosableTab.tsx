import { Box, IconButton, Paper, Typography } from "@mui/material"
import {   useState } from "react"
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import type {ReactNode} from "react";

export default function ClosableTab({header, children}:{header?:string | ReactNode, children: ReactNode}){
    const [isOpen, setOpen] = useState<boolean>(true)
    const rotate = isOpen ? 180 : 0
    return(
        <Paper>
            <Box component={"section"}><Typography>{header}</Typography><IconButton onClick={()=>setOpen(!isOpen)}><ExpandLessIcon sx={{transform: `rotate(${rotate}deg)`, transition:"transform ease 0.3s"}}/></IconButton></Box>
          
            <Box component={"section"} sx={{
                maxHeight: isOpen ? "40rem" : "0px",
                overflow: "auto",
                transition: "max-height 0.4s ease",
            }}>{
                children
                }</Box>
           
            
        
            
        </Paper>
    )
}