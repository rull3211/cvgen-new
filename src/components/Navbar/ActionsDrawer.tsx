import {
  Drawer,
  Box,
  IconButton,
  Typography,
  Divider,
  List,
  ListItem,
  Button,
  Input,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import FileDownloadIcon from '@mui/icons-material/FileDownload'
import FileUploadIcon from '@mui/icons-material/FileUpload'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useCv } from '@/hooks/useCv'
import { useShallow } from 'zustand/shallow'
import { useSnackbar } from '@/hooks/useSnackbar'
import { useExportTrigger } from '@/hooks/useExportTrigger'

interface ActionsDrawerProps {
  open: boolean
  onClose: () => void
}

export default function ActionsDrawer({ open, onClose }: ActionsDrawerProps) {
  const navigate = useNavigate()
  const showSnackbar = useSnackbar((state) => state.showSnackbar)
  const deleteFromFirestore = useCv((state) => state.deleteFromFirestore)
  const { triggerExport } = useExportTrigger()
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

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

  const handleDeleteCV = async () => {
    setShowDeleteDialog(false)
    setIsDeleting(true)
    try {
      await deleteFromFirestore()
      showSnackbar('CV slettet!', 'success')
      onClose()
      navigate({ to: '/cvs' })
    } catch (error) {
      console.error('Failed to delete CV:', error)
      showSnackbar('Kunne ikke slette CV. Prøv igjen.', 'error')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleExportJson = () => {
    const dataToDownload = {
      summary,
      workExperience,
      education,
      personalDetails,
      order,
      skills,
      formHeaders,
    }
    const jsonString = JSON.stringify(dataToDownload, null, 2)
    const blob = new Blob([jsonString], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'cvContent.json'
    link.click()
    URL.revokeObjectURL(url)
    showSnackbar('CV eksportert som JSON', 'success')
  }

  const handleExportPdf = () => {
    triggerExport()
    showSnackbar('Eksporterer PDF...', 'info')
    onClose()
  }

  const handleImportJson = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result
      if (!result || typeof result !== 'string') {
        showSnackbar('Ugyldig fil', 'error')
        return
      }

      try {
        const newState = JSON.parse(result)
        setState(newState)
        showSnackbar('CV importert!', 'success')
        onClose()
      } catch (err) {
        console.error(err)
        showSnackbar('Kunne ikke lese filen', 'error')
      }
    }
    reader.readAsText(file)
    // Reset input
    event.target.value = ''
  }

  return (
    <>
      <Drawer anchor="right" open={open} onClose={onClose}>
        <Box sx={{ width: 320 }} role="presentation">
          {/* Header */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              p: 2,
            }}
          >
            <Typography variant="h6" component="div">
              CV Handlinger
            </Typography>
            <IconButton onClick={onClose} edge="end">
              <CloseIcon />
            </IconButton>
          </Box>
          <Divider />

          {/* Actions List */}
          <List sx={{ p: 2 }}>
            <ListItem sx={{ px: 0, pb: 2 }}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<PictureAsPdfIcon />}
                onClick={handleExportPdf}
                sx={{
                  justifyContent: 'flex-start',
                  textTransform: 'none',
                  py: 1.5,
                }}
              >
                Eksporter som PDF
              </Button>
            </ListItem>

            <Divider sx={{ my: 1 }} />

            <ListItem sx={{ px: 0, pb: 2 }}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<FileDownloadIcon />}
                onClick={handleExportJson}
                sx={{
                  justifyContent: 'flex-start',
                  textTransform: 'none',
                  py: 1.5,
                }}
              >
                Eksporter som JSON
              </Button>
            </ListItem>

            <ListItem sx={{ px: 0, pb: 2 }}>
              <Button
                fullWidth
                variant="outlined"
                component="label"
                startIcon={<FileUploadIcon />}
                sx={{
                  justifyContent: 'flex-start',
                  textTransform: 'none',
                  py: 1.5,
                }}
              >
                Importer fra JSON
                <Input
                  type="file"
                  inputProps={{ accept: 'application/json' }}
                  onChange={handleImportJson}
                  sx={{ display: 'none' }}
                />
              </Button>
            </ListItem>

            <Divider sx={{ my: 2 }} />

            <ListItem sx={{ px: 0 }}>
              <Button
                fullWidth
                variant="outlined"
                color="error"
                startIcon={<DeleteOutlineIcon />}
                onClick={() => setShowDeleteDialog(true)}
                disabled={isDeleting}
                sx={{
                  justifyContent: 'flex-start',
                  textTransform: 'none',
                  py: 1.5,
                }}
              >
                {isDeleting ? 'Sletter...' : 'Slett CV'}
              </Button>
            </ListItem>
          </List>
        </Box>
      </Drawer>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
      >
        <DialogTitle>Slett CV</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Er du sikker på at du vil slette hele CV-en? Dette kan ikke angres.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteDialog(false)}>Avbryt</Button>
          <Button onClick={handleDeleteCV} color="error" autoFocus>
            Slett
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
