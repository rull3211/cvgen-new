import { Box, Button, Input } from '@mui/material'
import { useCv } from '@/hooks/useCv'
import { useShallow } from 'zustand/shallow'

const ExportCv = () => {
  const {
    summary,
    workExperience,
    education,
    personalDetails,
    order,
    skills,
    formHeaders,
    setState,
  } = useCv(
    useShallow((state) => ({
      summary: state.summary,
      workExperience: state.workExperience,
      education: state.education,
      personalDetails: state.personalDetails,
      order: state.order,
      skills: state.skills,
      formHeaders: state.formHeaders,
      setState: state.setState,
    })),
  )
  const handleDownload = () => {
    // 1. Your JSON object
    const dataToDownload = {
      summary,
      workExperience,
      education,
      personalDetails,
      order,
      skills,
      formHeaders,
    }
    // 2. Convert JSON object to a string
    const jsonString = JSON.stringify(dataToDownload, null, 2)

    // 3. Create a Blob from the JSON string
    const blob = new Blob([jsonString], { type: 'application/json' })

    // 4. Create a temporary URL for the Blob
    const url = URL.createObjectURL(blob)

    // 5. Create a temporary link element
    const link = document.createElement('a')
    link.href = url
    link.download = 'cvContent.json' // File name

    // 6. Trigger the download
    link.click()
    // 7. Clean up the URL object
    URL.revokeObjectURL(url)
  }
  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result
      if (!result || typeof result !== 'string') {
        alert('File is empty or invalid!')
        return
      }

      try {
        const newState = JSON.parse(result)
        setState(newState)
      } catch (err) {
        console.error(err)
      }
    }
    reader.readAsText(file)
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Button
        sx={{ fontSize: '0.7rem' }}
        variant="contained"
        onClick={handleDownload}
      >
        Export as Json
      </Button>

      <Input
        type="file"
        inputProps={{ accept: 'application/json' }}
        onChange={handleUpload}
      />
    </Box>
  )
}

export default ExportCv
