import { useState, useEffect, useCallback } from 'react'
import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  query,
  orderBy,
} from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { db } from '@/features/auth/firebase'
import type { CvMetadata } from '@/types/cvMetadata'

export function useCvList() {
  const [cvs, setCvs] = useState<CvMetadata[]>([])
  const [loading, setLoading] = useState(true)

  const loadCvList = useCallback(async () => {
    const auth = getAuth()
    const user = auth.currentUser
    if (!user) {
      setCvs([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const cvsRef = collection(db, `users/${user.uid}/cvs`)
      const q = query(cvsRef, orderBy('metadata.updatedAt', 'desc'))
      const snapshot = await getDocs(q)

      const cvList: CvMetadata[] = []
      snapshot.forEach((doc) => {
        const data = doc.data()
        if (data.metadata) {
          cvList.push(data.metadata as CvMetadata)
        }
      })

      setCvs(cvList)
    } catch (error) {
      console.error('Error loading CV list:', error)
      setCvs([])
    } finally {
      setLoading(false)
    }
  }, [])

  const createCv = async (name: string): Promise<string> => {
    const auth = getAuth()
    const user = auth.currentUser
    if (!user) throw new Error('Not authenticated')

    const cvId = crypto.randomUUID()
    const now = new Date().toISOString()

    const metadata: CvMetadata = {
      id: cvId,
      name,
      createdAt: now,
      updatedAt: now,
    }

    const cvRef = doc(db, `users/${user.uid}/cvs/${cvId}`)
    await setDoc(cvRef, { metadata }, { merge: true })

    await loadCvList()
    return cvId
  }

  const deleteCv = async (cvId: string): Promise<void> => {
    const auth = getAuth()
    const user = auth.currentUser
    if (!user) throw new Error('Not authenticated')

    const cvRef = doc(db, `users/${user.uid}/cvs/${cvId}`)
    await deleteDoc(cvRef)

    await loadCvList()
  }

  const updateCvMetadata = async (
    cvId: string,
    updates: Partial<Omit<CvMetadata, 'id' | 'createdAt'>>,
  ): Promise<void> => {
    const auth = getAuth()
    const user = auth.currentUser
    if (!user) throw new Error('Not authenticated')

    const cvRef = doc(db, `users/${user.uid}/cvs/${cvId}`)
    const now = new Date().toISOString()

    await setDoc(
      cvRef,
      {
        metadata: {
          ...updates,
          updatedAt: now,
        },
      },
      { merge: true },
    )

    await loadCvList()
  }

  useEffect(() => {
    loadCvList()
  }, [])

  return {
    cvs,
    loading,
    loadCvList,
    createCv,
    deleteCv,
    updateCvMetadata,
  }
}
