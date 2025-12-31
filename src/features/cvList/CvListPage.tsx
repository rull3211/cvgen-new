import { useState, useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  TextField,
  CircularProgress,
} from '@mui/material'
import { useCvList } from '@/hooks/useCvList'
import { useSnackbar } from '@/hooks/useSnackbar'
import type { CvMetadata } from '@/types/cvMetadata'
import styles from './cvList.module.scss'

export default function CvListPage() {
  const navigate = useNavigate()
  const { cvs, loading, createCv, deleteCv, loadCvList } = useCvList()
  const showSnackbar = useSnackbar((state) => state.showSnackbar)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [cvToDelete, setCvToDelete] = useState<CvMetadata | null>(null)
  const [newCvName, setNewCvName] = useState('')
  const [creating, setCreating] = useState(false)
  const [deleting, setDeleting] = useState(false)

  // Reload CV list when component mounts (e.g., when returning from editor)
  useEffect(() => {
    loadCvList()
  }, [loadCvList])

  const handleCreateCv = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCvName.trim()) return

    setCreating(true)
    try {
      const cvId = await createCv(newCvName.trim())
      setShowCreateDialog(false)
      setNewCvName('')
      navigate({ to: `/cvs/${cvId}` })
    } catch (error) {
      console.error('Error creating CV:', error)
      showSnackbar('Kunne ikke opprette CV. Prøv igjen.', 'error')
    } finally {
      setCreating(false)
    }
  }

  const handleSelectCv = (cvId: string) => {
    navigate({ to: `/cvs/${cvId}` })
  }

  const handleDeleteClick = (cv: CvMetadata, e: React.MouseEvent) => {
    e.stopPropagation()
    setCvToDelete(cv)
    setShowDeleteDialog(true)
  }

  const handleConfirmDelete = async () => {
    if (!cvToDelete) return

    setDeleting(true)
    try {
      await deleteCv(cvToDelete.id)
      showSnackbar('CV slettet!', 'success')
      setShowDeleteDialog(false)
      setCvToDelete(null)
    } catch (error) {
      console.error('Error deleting CV:', error)
      showSnackbar('Kunne ikke slette CV. Prøv igjen.', 'error')
    } finally {
      setDeleting(false)
    }
  }

  const handleCancelDelete = () => {
    setShowDeleteDialog(false)
    setCvToDelete(null)
  }

  if (loading) {
    return (
      <div className={`${styles['cv-list-page']} ${styles.loading}`}>
        <div className={styles['loading-spinner']}>Loading your CVs...</div>
      </div>
    )
  }

  return (
    <div className={styles['cv-list-page']}>
      <div className={styles['cv-list-container']}>
        <header className={styles['cv-list-header']}>
          <h1>My CVs</h1>
          <button
            className={styles['create-cv-button']}
            onClick={() => setShowCreateDialog(true)}
          >
            + Create New CV
          </button>
        </header>

        {cvs.length === 0 ? (
          <div className={styles['empty-state']}>
            <p>You don't have any CVs yet.</p>
            <button
              className={styles['create-cv-button-large']}
              onClick={() => setShowCreateDialog(true)}
            >
              Create Your First CV
            </button>
          </div>
        ) : (
          <div className={styles['cv-list']}>
            {cvs.map((cv) => (
              <div
                key={cv.id}
                className={styles['cv-card']}
                onClick={() => handleSelectCv(cv.id)}
              >
                <div className={styles['cv-card-content']}>
                  <h2 className={styles['cv-name']}>{cv.name}</h2>
                  <div className={styles['cv-metadata']}>
                    <span>
                      Created: {new Date(cv.createdAt).toLocaleDateString()}
                    </span>
                    <span>
                      Updated: {new Date(cv.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <button
                  className={styles['delete-button']}
                  onClick={(e) => handleDeleteClick(cv, e)}
                  title="Slett CV"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create CV Dialog */}
      <Dialog
        open={showCreateDialog}
        onClose={() => {
          setShowCreateDialog(false)
          setNewCvName('')
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Opprett ny CV</DialogTitle>
        <form onSubmit={handleCreateCv}>
          <DialogContent>
            <TextField
              autoFocus
              required
              margin="dense"
              label="CV-navn"
              type="text"
              fullWidth
              variant="outlined"
              value={newCvName}
              onChange={(e) => setNewCvName(e.target.value)}
              placeholder="f.eks. Programvareutvikler CV"
              disabled={creating}
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setShowCreateDialog(false)
                setNewCvName('')
              }}
              disabled={creating}
            >
              Avbryt
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={creating || !newCvName.trim()}
              startIcon={creating ? <CircularProgress size={20} /> : null}
            >
              {creating ? 'Oppretter...' : 'Opprett'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete CV Dialog */}
      <Dialog
        open={showDeleteDialog}
        onClose={handleCancelDelete}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Slett CV</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Er du sikker på at du vil slette{' '}
            <strong>"{cvToDelete?.name}"</strong>?
            <br />
            Dette kan ikke angres.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} disabled={deleting}>
            Avbryt
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
            disabled={deleting}
            startIcon={deleting ? <CircularProgress size={20} /> : null}
          >
            {deleting ? 'Sletter...' : 'Slett'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
