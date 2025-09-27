const express = require("express");
const bodyParser = require("body-parser");
const puppeteer = require("puppeteer");
const cors = require("cors"); // <-- legg til
const app = express();
app.use(bodyParser.json({ limit: "10mb" }));
app.use(cors());
app.get("/", (req, res) => res.send("Server running"));

async function generatePDF(html, css) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  const fullHtml = `
    <html>
      <head>
        <style>${css}</style>
      </head>
      <body>${html}</body>
    </html>
  `;

  await page.setContent(fullHtml, { waitUntil: "networkidle0" });
  const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });
  await browser.close();
  return pdfBuffer;
}

app.post("/generate-pdf", async (req, res) => {
  try {
    const { html, css } = req.body;
    if (!html) return res.status(400).send("Missing HTML");

    const pdf = await generatePDF(html, css || "");
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=resume.pdf",
      "Content-Length": pdf.length
    });
    res.send(pdf);
  } catch (err) {
    console.error(err);
    res.status(500).send("PDF generation failed");
  }
});
app.get("/ping", async (req, res) => {
    res.send("pong");
 
})


app.listen(3001, () => console.log("Server running on http://localhost:3001"));