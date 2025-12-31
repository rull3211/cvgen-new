import { getAuth } from 'firebase/auth'
import { doc, writeBatch } from 'firebase/firestore'
import { db } from './firebase'

type PendingWrite = {
  path: string
  data: any
  cvId: string
}

// Store pending writes keyed by cvId and path
let pendingWrites: Map<string, Map<string, any>> = new Map()
let batchTimeout: number | null = null

// Export function to clear pending writes (used during load from Firestore)
export function clearPendingWrites() {
  pendingWrites.clear()
  if (batchTimeout) {
    clearTimeout(batchTimeout)
    batchTimeout = null
  }
}

export function scheduleBatchWrite({ path, data, cvId }: PendingWrite) {
  // Get or create the map for this CV
  if (!pendingWrites.has(cvId)) {
    pendingWrites.set(cvId, new Map())
  }
  const cvWrites = pendingWrites.get(cvId)!

  // Always keep only the latest write for each path within this CV
  cvWrites.set(path, data)

  if (batchTimeout) clearTimeout(batchTimeout)
  batchTimeout = window.setTimeout(async () => {
    if (pendingWrites.size === 0) return

    const auth = getAuth()
    const user = auth.currentUser
    if (!user) throw new Error('Not authenticated')

    const batch = writeBatch(db)

    // Process each CV's pending writes
    pendingWrites.forEach((cvWrites, cvId) => {
      const cvRef = doc(db, `users/${user.uid}/cvs/${cvId}`)

      // Combine all pending paths into one merged object per document
      let mergedData: Record<string, any> = {}
      cvWrites.forEach((data, path) => {
        mergedData[path] = data
      })

      // Update metadata timestamp - use merge to preserve existing metadata fields
      mergedData['metadata.updatedAt'] = new Date().toISOString()

      batch.set(cvRef, mergedData, { merge: true })
    })

    try {
      await batch.commit()
      console.log('✅ Batched write committed:', [...pendingWrites.entries()])
    } catch (err) {
      console.error('❌ Batch write failed:', err)
    }

    pendingWrites.clear()
  }, 1500) // ⏱ Debounce window
}
