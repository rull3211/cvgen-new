import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { deleteDoc, doc, getDoc } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { db } from '@/features/auth/firebase'
import { usePagination } from './usePagination'
import {
  scheduleBatchWrite,
  clearPendingWrites,
} from '@/features/auth/sceduleBatchWrite'

export type RightOrder = keyof Pick<
  CvState,
  'education' | 'workExperience' | 'summary'
>
export type LeftOrder = keyof Pick<CvState, 'skills' | 'personalDetails'>

export type CvState = {
  summary: Array<Summary>
  workExperience: Array<Experience>
  education: Array<Experience>
  personalDetails: Array<PersonalDetails>
  order: { left: Array<LeftOrder>; right: Array<RightOrder> }
  skills: Array<Skill>
  formHeaders: Record<string, string>
  _isLoading: boolean // Internal flag to prevent writes during load
  _cvId: string | null // Current CV ID being edited
}
type CvActions = {
  setState: (newState: CvState) => void
  addWorkExperience: (experience: ExperienceKey) => void
  addSkill: () => void
  updateSummary: (
    field: keyof Omit<Summary, 'type'>,
    value: string,
    id: string,
  ) => void
  updateWorkExperience: (
    experience: ExperienceKey,
    field: keyof Omit<Experience, 'type'>,
    value: string,
    id: string,
  ) => void
  updateSkills: (
    field: keyof Omit<Skill, 'type'>,
    value: string,
    id: string,
  ) => void
  updatePersonalDetails: (
    field: keyof Omit<PersonalDetails, 'type'>,
    value: string,
    id: string,
  ) => void
  updateFormHeaders: (header: string, value: string) => void
  loadFromFirestore: (cvId: string) => Promise<void>
  deleteFromFirestore: () => Promise<void>
  setCvId: (cvId: string) => void
}
export interface Summary {
  id: string
  type: 'summary'
  content: string
}

export interface Skill {
  id: string
  type: 'skill'
  content: string
  level: string
}
export interface Experience {
  type: ExperienceKey
  id: string
  tittel: string
  institusjon: string
  by: string
  fra: string
  til: string
  beskrivelse: string
}

export interface PersonalDetails {
  id: string
  type: 'personalDetails'
  jobbtittel: string
  fornavn: string
  etternavn: string
  email: string
  telefon: string
  adresse: string
  by: string
  land: string
  image: string
}

function createEmptyExperience(type: ExperienceKey): Experience {
  return {
    type,
    id: crypto.randomUUID(),
    tittel: '',
    institusjon: '',
    by: '',
    fra: '',
    til: '',
    beskrivelse: '',
  }
}
function createEmptyPersonalDetails(): PersonalDetails {
  return {
    type: 'personalDetails',
    id: crypto.randomUUID(),
    jobbtittel: '',
    fornavn: '',
    etternavn: '',
    email: '',
    telefon: '',
    adresse: '',
    by: '',
    land: '',
    image: '',
  }
}

// Module-level flag to prevent writes during load operations
let isLoadingFromFirestore = false

export type ExperienceKey = 'workExperience' | 'education'

// Function to create fresh initial state (generates new UUIDs each time)
const createInitialState = (): CvState => ({
  summary: [{ type: 'summary', content: '', id: crypto.randomUUID() }],
  workExperience: [createEmptyExperience('workExperience')],
  education: [createEmptyExperience('education')],
  personalDetails: [createEmptyPersonalDetails()],
  order: {
    left: ['personalDetails', 'skills'],
    right: ['summary', 'workExperience', 'education'],
  },
  formHeaders: {
    skills: 'Ferdigheter',
    education: 'Utdanning',
    workExperience: 'Arbeidserfaring',
    summary: 'Oppsummering',
  },
  skills: [{ type: 'skill', content: '', id: crypto.randomUUID(), level: '1' }],
  _isLoading: false,
  _cvId: null,
})

const initialState: CvState = createInitialState()

export const useCv = create(
  immer<CvState & CvActions>((set) => ({
    // -------------------------------
    // Initial State
    // -------------------------------
    ...initialState,

    // -------------------------------
    // State actions
    // -------------------------------
    setCvId: (cvId) => {
      set((state) => {
        state._cvId = cvId
      })
    },

    setState: (newState) => {
      set((state) => {
        Object.assign(state, newState)
      })

      const cvId = useCv.getState()._cvId
      if (!isLoadingFromFirestore && cvId) {
        if (newState.summary)
          scheduleBatchWrite({ path: 'summary', data: newState.summary, cvId })
        if (newState.workExperience)
          scheduleBatchWrite({
            path: 'workExperience',
            data: newState.workExperience,
            cvId,
          })
        if (newState.education)
          scheduleBatchWrite({
            path: 'education',
            data: newState.education,
            cvId,
          })
        if (newState.personalDetails)
          scheduleBatchWrite({
            path: 'personalDetails',
            data: newState.personalDetails,
            cvId,
          })
        if (newState.skills)
          scheduleBatchWrite({ path: 'skills', data: newState.skills, cvId })
        if (newState.formHeaders)
          scheduleBatchWrite({
            path: 'formHeaders',
            data: newState.formHeaders,
            cvId,
          })
        if (newState.order)
          scheduleBatchWrite({ path: 'order', data: newState.order, cvId })
      }
    },

    addWorkExperience: (experience) => {
      set((state) => {
        const newExp = createEmptyExperience('workExperience')
        state[experience].push(newExp)
        const cvId = state._cvId
        if (!state._isLoading && !isLoadingFromFirestore && cvId) {
          scheduleBatchWrite({
            path: experience,
            data: state[experience].map((e) => ({ ...e })),
            cvId,
          })
        }
      })
    },

    addSkill: () => {
      set((state) => {
        const newSkill: Skill = {
          type: 'skill',
          content: '',
          id: crypto.randomUUID(),
          level: '1',
        }
        state.skills.push(newSkill)
        const cvId = state._cvId
        if (!state._isLoading && !isLoadingFromFirestore && cvId) {
          scheduleBatchWrite({
            path: 'skills',
            data: state.skills.map((s) => ({ ...s })),
            cvId,
          })
        }
      })
    },

    updateSummary: (field, value, id) => {
      set((state) => {
        const item = state.summary.find((el) => el.id === id)
        if (item) {
          item[field] = value
          const cvId = state._cvId
          if (!state._isLoading && !isLoadingFromFirestore && cvId) {
            scheduleBatchWrite({
              path: 'summary',
              data: state.summary.map((s) => ({ ...s })),
              cvId,
            })
          }
        }
      })
    },

    updateWorkExperience: (experience, field, value, id) => {
      set((state) => {
        const item = state[experience].find((el) => el.id === id)
        if (item) {
          item[field] = value
          const cvId = state._cvId
          if (!state._isLoading && !isLoadingFromFirestore && cvId) {
            scheduleBatchWrite({
              path: experience,
              data: state[experience].map((e) => ({ ...e })),
              cvId,
            })
          }
        }
      })
    },

    updateSkills: (field, value, id) => {
      set((state) => {
        const item = state.skills.find((el) => el.id === id)
        if (item) {
          item[field] = value
          const cvId = state._cvId
          if (!state._isLoading && !isLoadingFromFirestore && cvId) {
            scheduleBatchWrite({
              path: 'skills',
              data: state.skills.map((s) => ({ ...s })),
              cvId,
            })
          }
        }
      })
    },

    updatePersonalDetails: (field, value, id) => {
      set((state) => {
        const item = state.personalDetails.find((el) => el.id === id)
        if (item) {
          item[field] = value
          const cvId = state._cvId
          if (!state._isLoading && !isLoadingFromFirestore && cvId) {
            scheduleBatchWrite({
              path: 'personalDetails',
              data: state.personalDetails.map((p) => ({ ...p })),
              cvId,
            })
          }
        }
      })
    },

    updateFormHeaders: (header, value) => {
      set((state) => {
        state.formHeaders[header] = value
        const cvId = state._cvId
        if (!state._isLoading && !isLoadingFromFirestore && cvId) {
          scheduleBatchWrite({
            path: 'formHeaders',
            data: { ...state.formHeaders },
            cvId,
          })
        }
      })
    },

    // -------------------------------
    // Firestore helpers
    // -------------------------------
    loadFromFirestore: async (cvId: string) => {
      const auth = getAuth()
      const user = auth.currentUser
      if (!user) throw new Error('Not authenticated')

      const ref = doc(db, `users/${user.uid}/cvs/${cvId}`)
      const snap = await getDoc(ref)
      if (snap.exists()) {
        // Set module flag to prevent any writes
        isLoadingFromFirestore = true

        // Clear any pending writes before loading
        clearPendingWrites()

        const data = snap.data() as CvState

        // Check if this is a new CV (only has metadata, no content)
        const isNewCv = !data.summary && !data.workExperience && !data.education

        // Use immer-style mutation to update only data fields
        set((state) => {
          if (isNewCv) {
            // For new CVs, reset to fresh initial state
            const freshState = createInitialState()
            state.summary = freshState.summary
            state.workExperience = freshState.workExperience
            state.education = freshState.education
            state.personalDetails = freshState.personalDetails
            state.order = freshState.order
            state.skills = freshState.skills
            state.formHeaders = freshState.formHeaders
          } else {
            // For existing CVs, load the saved data
            state.summary = data.summary || state.summary
            state.workExperience = data.workExperience || state.workExperience
            state.education = data.education || state.education
            state.personalDetails =
              data.personalDetails || state.personalDetails
            state.order = data.order || state.order
            state.skills = data.skills || state.skills
            state.formHeaders = data.formHeaders || state.formHeaders
          }
          state._isLoading = false
          state._cvId = cvId
        })

        // Clear again after loading and reset flag
        clearPendingWrites()
        isLoadingFromFirestore = false
      }
    },

    deleteFromFirestore: async () => {
      const auth = getAuth()
      const user = auth.currentUser
      if (!user) throw new Error('Not authenticated')

      const cvId = useCv.getState()._cvId
      if (!cvId) throw new Error('No CV loaded')

      const ref = doc(db, `users/${user.uid}/cvs/${cvId}`)
      await deleteDoc(ref).then(() => {
        // Set module flag to prevent writes
        isLoadingFromFirestore = true

        // Clear any pending writes before resetting
        clearPendingWrites()

        set((state) => {
          state._isLoading = true
          Object.assign(state, initialState)
          state._isLoading = false
        })
        usePagination.getState().resetPages()

        // Clear again after reset and reset flag
        clearPendingWrites()
        isLoadingFromFirestore = false
      })
    },
  })),
)
