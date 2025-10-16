import pako from 'pako'

export async function exportPDF(html: string, css: string) {
  const payload = { html, css }

  // Compress + base64 encode
  const compressed = pako.gzip(JSON.stringify(payload))
  const base64 = btoa(String.fromCharCode(...compressed))

  try {
    const response = await fetch('http://localhost:3001/generate-pdf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: base64 }),
    })

    if (!response.ok) throw new Error('PDF generation failed')

    // Download the PDF
    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'resume.pdf'
    a.click()
    window.URL.revokeObjectURL(url)
  } catch (err) {
    console.error('Error exporting PDF:', err)
  }
}
