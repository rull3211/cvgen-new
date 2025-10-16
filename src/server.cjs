const express = require('express')
const bodyParser = require('body-parser')
const puppeteer = require('puppeteer')
const cors = require('cors')
const path = require('path')
const zlib = require('zlib')

const app = express()

// Middleware
app.use(bodyParser.json({ limit: '500kb' })) // smaller limit now that we compress
app.use(cors())

// Serve the built Vite frontend
const distPath = path.join(__dirname, 'dist')
app.use(express.static(distPath))

// Health check
app.get('/ping', (req, res) => res.send('pong'))

// PDF generation helper
async function generatePDF(html, css) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })
  const page = await browser.newPage()

  const fullHtml = `
    <html>
      <head><style>${css || ''}</style></head>
      <body>${html}</body>
    </html>
  `

  await page.setContent(fullHtml, { waitUntil: 'networkidle0' })
  const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true })
  await browser.close()
  return pdfBuffer
}

// PDF endpoint with decompression
app.post('/generate-pdf', async (req, res) => {
  try {
    // Expect { data: "<base64 string of deflated JSON>" }
    if (!req.body?.data) return res.status(400).send('Missing compressed data')

    const compressed = Buffer.from(req.body.data, 'base64')
    const decompressed = zlib.gunzipSync(compressed).toString()
    const { html, css } = JSON.parse(decompressed)

    if (!html) return res.status(400).send('Missing HTML')

    const pdf = await generatePDF(html, css)
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=document.pdf',
      'Content-Length': pdf.length,
    })
    res.send(pdf)
  } catch (err) {
    console.error('PDF generation failed:', err)
    res.status(500).send('PDF generation failed')
  }
})

// Fallback for SPA routing
app.get('*path', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'))
})
// Start server
const PORT = process.env.PORT || 3001
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`),
)
