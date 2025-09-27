import { Box, Button, Typography } from "@mui/material";
import { useRef } from "react";
import styles from "./PreviewStyles.module.scss"
import { a4Height, a4HeightInCm, a4WidthInCm, a4width } from "@/constants";
import { useCv } from "@/hooks/useCv";

async function exportPDF(html: string, css:string) {
  try {
    const response = await fetch("http://localhost:3001/generate-pdf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ html, css }),
    });

    if (!response.ok) {
      throw new Error("PDF generation failed");
    }

    // Hent PDF som blob
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    // Lag en midlertidig <a> for å laste ned
    const a = document.createElement("a");
    a.href = url;
    a.download = "resume.pdf";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    console.log("PDF downloaded successfully!");
  } catch (err) {
    console.error("Error exporting PDF:", err);
  }
}

export default function Preview(){
     const exportPreview = () => {
        if (!previewRef.current) return;

        const node = previewRef.current;

        // --- Extract HTML ---
        const html = node.outerHTML;

        // --- Extract CSS (from all loaded stylesheets) ---
        const cssText = Array.from(document.styleSheets)
        .map((sheet) => {
            try {
            return Array.from(sheet.cssRules)
                .map((rule) => rule.cssText)
                .join("\n");
            } catch (e) {
            // Ignore CORS-protected stylesheets
            return "";
            }
        })
        .join("\n");

        console.log("=== HTML ===");
        console.log(html);
        console.log("=== CSS ===");
        console.log(cssText);
        exportPDF(html, cssText);
    };
    const previewRef = useRef<HTMLDivElement>(null);
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const scale = Math.min(1, Math.min(vw / a4WidthInCm, vh / a4HeightInCm)*0.9);
    const cv = useCv()

    return(
        <>
        <Button onClick={exportPreview}>Eksporter</Button>
        <div style={{transform: `scale(${scale})`,transformOrigin: "top left"}}>
            <Box ref={previewRef} sx={{display:"flex",
            height: a4Height+"cm",
            width: a4width+"cm",
           
                
            }}

            >
                <section className={styles.left}>
                    
                </section>
                <section className={styles.right}>
                    {cv.workExperience.map(el => {
                        return <section key={el.id}>
                            <Typography>{el.tittel}</Typography>
                            <Typography>{el.institusjon}</Typography>
                            <Typography>{el.fra}</Typography>
                            <Typography>{el.til}</Typography>
                            <Typography>{el.by}</Typography>
                            <Typography>{el.beskrivelse}</Typography>

                        </section>
                    })}
                </section>
            </Box>
        </div>
        
        </>
        
    )
}