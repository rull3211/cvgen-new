import { useState, useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useCvList } from '@/hooks/useCvList'
import type { CvMetadata } from '@/types/cvMetadata'
import './cvList.module.scss'

export default function CvListPage() {
  const navigate = useNavigate()
  const { cvs, loading, createCv, deleteCv, loadCvList } = useCvList()
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [newCvName, setNewCvName] = useState('')
  const [creating, setCreating] = useState(false)

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
      alert('Failed to create CV. Please try again.')
    } finally {
      setCreating(false)
    }
  }

  const handleSelectCv = (cvId: string) => {
    navigate({ to: `/cvs/${cvId}` })
  }

  const handleDeleteCv = async (cv: CvMetadata, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!confirm(`Are you sure you want to delete "${cv.name}"?`)) return

    try {
      await deleteCv(cv.id)
    } catch (error) {
      console.error('Error deleting CV:', error)
      alert('Failed to delete CV. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="cv-list-page loading">
        <div className="loading-spinner">Loading your CVs...</div>
      </div>
    )
  }

  return (
    <div className="cv-list-page">
      <div className="cv-list-container">
        <header className="cv-list-header">
          <h1>My CVs</h1>
          <button
            className="create-cv-button"
            onClick={() => setShowCreateDialog(true)}
          >
            + Create New CV
          </button>
        </header>

        {cvs.length === 0 ? (
          <div className="empty-state">
            <p>You don't have any CVs yet.</p>
            <button
              className="create-cv-button-large"
              onClick={() => setShowCreateDialog(true)}
            >
              Create Your First CV
            </button>
          </div>
        ) : (
          <div className="cv-list">
            {cvs.map((cv) => (
              <div
                key={cv.id}
                className="cv-card"
                onClick={() => handleSelectCv(cv.id)}
              >
                <div className="cv-card-content">
                  <h2 className="cv-name">{cv.name}</h2>
                  <div className="cv-metadata">
                    <span>
                      Created: {new Date(cv.createdAt).toLocaleDateString()}
                    </span>
                    <span>
                      Updated: {new Date(cv.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <button
                  className="delete-button"
                  onClick={(e) => handleDeleteCv(cv, e)}
                  title="Delete CV"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {showCreateDialog && (
        <div
          className="dialog-overlay"
          onClick={() => setShowCreateDialog(false)}
        >
          <div className="dialog" onClick={(e) => e.stopPropagation()}>
            <h2>Create New CV</h2>
            <form onSubmit={handleCreateCv}>
              <label>
                CV Name:
                <input
                  type="text"
                  value={newCvName}
                  onChange={(e) => setNewCvName(e.target.value)}
                  placeholder="e.g., Software Engineer CV"
                  autoFocus
                  required
                />
              </label>
              <div className="dialog-actions">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateDialog(false)
                    setNewCvName('')
                  }}
                  disabled={creating}
                >
                  Cancel
                </button>
                <button type="submit" disabled={creating || !newCvName.trim()}>
                  {creating ? 'Creating...' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
