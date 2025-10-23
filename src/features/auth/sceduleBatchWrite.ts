import { getAuth } from 'firebase/auth'
import { doc, writeBatch } from 'firebase/firestore'
import { db } from './firebase'

type PendingWrite = {
  path: string
  data: any
}

// Store pending writes keyed by Firestore field path
let pendingWrites: Map<string, any> = new Map()
let batchTimeout: number | null = null

export function scheduleBatchWrite({ path, data }: PendingWrite) {
  console.log(path, data)
  // Always keep only the latest write for each path
  pendingWrites.set(path, data)

  if (batchTimeout) clearTimeout(batchTimeout)
  batchTimeout = window.setTimeout(async () => {
    if (pendingWrites.size === 0) return

    const auth = getAuth()
    const user = auth.currentUser
    if (!user) throw new Error('Not authenticated')

    const batch = writeBatch(db)
    const cvRef = doc(db, `users/${user.uid}/cvs/main`)

    // Combine all pending paths into one merged object per document
    let mergedData: Record<string, any> = {}
    pendingWrites.forEach((data, path) => {
      mergedData[path] = data
    })

    batch.set(cvRef, mergedData, { merge: true })

    try {
      await batch.commit()
      console.log('✅ Batched write committed:', [...pendingWrites.entries()])
    } catch (err) {
      console.error('❌ Batch write failed:', err)
    }

    pendingWrites.clear()
  }, 1500) // ⏱ Debounce window
}
