import { useEffect, useState } from 'react'
import { useParams, useNavigate } from '@tanstack/react-router'
import { useCv } from '@/hooks/useCv'
import CvAppLayout from './CvAppLayout'

export default function CvEditor() {
  const params = useParams({ from: '/cvs/$cvId' })
  const navigate = useNavigate()
  const { loadFromFirestore, setCvId } = useCv()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadCv = async () => {
      const cvId = params.cvId
      if (!cvId) {
        navigate({ to: '/cvs' })
        return
      }

      try {
        setLoading(true)
        setError(null)
        setCvId(cvId)
        await loadFromFirestore(cvId)
      } catch (err) {
        console.error('Error loading CV:', err)
        setError('Failed to load CV. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    loadCv()
  }, [params.cvId, loadFromFirestore, setCvId, navigate])

  if (loading) {
    return (
      <div style={{ textAlign: 'center', marginTop: '4rem' }}>
        <p>Loading CV...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', marginTop: '4rem' }}>
        <p style={{ color: 'red' }}>{error}</p>
        <button onClick={() => navigate({ to: '/cvs' })}>
          Back to CV List
        </button>
      </div>
    )
  }

  return <CvAppLayout />
}
