export async function exportPDF(html: string, css:string) {
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

  } catch (err) {
    console.error("Error exporting PDF:", err);
  }
}
