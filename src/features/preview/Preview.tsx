import { Box } from "@mui/material";
import styles from "./PreviewStyles.module.scss"
import { a4Height, a4HeightInCm, a4WidthInCm, a4width } from "@/constants";

export default function Preview(){
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const scale = Math.min(1, Math.min(vw / a4WidthInCm, vh / a4HeightInCm)*0.8);
    return(
        <Box sx={{display:"flex",
            height: a4Height+"cm",
            width: a4width+"cm",
            transform:`scale(${scale})`,
            transformOrigin: "top left"
        }}

        >
            <section className={styles.left}></section>
            <section className={styles.right}></section>
        </Box>
    )
}