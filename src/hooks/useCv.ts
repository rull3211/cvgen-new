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
  loadFromFirestore: () => Promise<void>
  deleteFromFirestore: () => Promise<void>
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
const initialState: CvState = {
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
  },
  skills: [{ type: 'skill', content: '', id: crypto.randomUUID(), level: '1' }],
  _isLoading: false,
}

export const useCv = create(
  immer<CvState & CvActions>((set) => ({
    // -------------------------------
    // Initial State
    // -------------------------------
    ...initialState,

    // -------------------------------
    // State actions
    // -------------------------------
    setState: (newState) => set(() => newState),

    addWorkExperience: (experience) => {
      set((state) => {
        const newExp = createEmptyExperience('workExperience')
        state[experience].push(newExp)
        if (!state._isLoading && !isLoadingFromFirestore) {
          scheduleBatchWrite({
            path: experience,
            data: state[experience].map((e) => ({ ...e })),
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
        if (!state._isLoading && !isLoadingFromFirestore) {
          scheduleBatchWrite({
            path: 'skills',
            data: state.skills.map((s) => ({ ...s })),
          })
        }
      })
    },

    updateSummary: (field, value, id) => {
      set((state) => {
        const item = state.summary.find((el) => el.id === id)
        if (item) {
          item[field] = value
          if (!state._isLoading && !isLoadingFromFirestore) {
            scheduleBatchWrite({
              path: 'summary',
              data: state.summary.map((s) => ({ ...s })),
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
          if (!state._isLoading && !isLoadingFromFirestore) {
            scheduleBatchWrite({
              path: experience,
              data: state[experience].map((e) => ({ ...e })),
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
          if (!state._isLoading && !isLoadingFromFirestore) {
            scheduleBatchWrite({
              path: 'skills',
              data: state.skills.map((s) => ({ ...s })),
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
          if (!state._isLoading && !isLoadingFromFirestore) {
            scheduleBatchWrite({
              path: 'personalDetails',
              data: state.personalDetails.map((p) => ({ ...p })),
            })
          }
        }
      })
    },

    updateFormHeaders: (header, value) => {
      set((state) => {
        state.formHeaders[header] = value
        if (!state._isLoading && !isLoadingFromFirestore) {
          scheduleBatchWrite({
            path: 'formHeaders',
            data: { ...state.formHeaders },
          })
        }
      })
    },

    // -------------------------------
    // Firestore helpers
    // -------------------------------
    loadFromFirestore: async () => {
      const auth = getAuth()
      const user = auth.currentUser
      if (!user) throw new Error('Not authenticated')

      const ref = doc(db, `users/${user.uid}/cvs/main`)
      const snap = await getDoc(ref)
      if (snap.exists()) {
        // Set module flag to prevent any writes
        isLoadingFromFirestore = true

        // Clear any pending writes before loading
        clearPendingWrites()

        const data = snap.data() as CvState

        // Use immer-style mutation to update only data fields
        set((state) => {
          // Update each field individually
          state.summary = data.summary || state.summary
          state.workExperience = data.workExperience || state.workExperience
          state.education = data.education || state.education
          state.personalDetails = data.personalDetails || state.personalDetails
          state.order = data.order || state.order
          state.skills = data.skills || state.skills
          state.formHeaders = data.formHeaders || state.formHeaders
          state._isLoading = false
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

      const ref = doc(db, `users/${user.uid}/cvs/main`)
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
