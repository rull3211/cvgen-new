import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { deleteDoc, doc, getDoc, setDoc } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { db } from '@/features/auth/firebase'
import { usePagination } from './usePagination'
import { scheduleBatchWrite } from '@/features/auth/sceduleBatchWrite'

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
}

export const useCv = create(
  immer<CvState & CvActions>((set, get) => ({
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
        scheduleBatchWrite({
          path: experience,
          data: state[experience].map((e) => ({ ...e })),
        })
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
      })
    },

    updateSummary: (field, value, id) => {
      set((state) => {
        const item = state.summary.find((el) => el.id === id)
        if (item) item[field] = value
      })
    },

    updateWorkExperience: (experience, field, value, id) => {
      set((state) => {
        const item = state[experience].find((el) => el.id === id)
        if (item) item[field] = value
      })
    },

    updateSkills: (field, value, id) => {
      set((state) => {
        const item = state.skills.find((el) => el.id === id)
        if (item) item[field] = value
      })
    },

    updatePersonalDetails: (field, value, id) => {
      set((state) => {
        const item = state.personalDetails.find((el) => el.id === id)
        if (item) item[field] = value
      })
    },

    updateFormHeaders: (header, value) => {
      set((state) => {
        state.formHeaders[header] = value
      })
    },

    // -------------------------------
    // Firestore helpers
    // -------------------------------
  })),
)

/**
 *  saveToFirestore: async () => {
      const auth = getAuth()
      const user = auth.currentUser
      if (!user) throw new Error('Not authenticated')

      const {
        summary,
        workExperience,
        education,
        personalDetails,
        order,
        skills,
        formHeaders,
      } = get()
      const data: CvState = {
        summary,
        workExperience,
        education,
        personalDetails,
        order,
        skills,
        formHeaders,
      }

      const ref = doc(db, `users/${user.uid}/cvs/main`)
      await setDoc(ref, data, { merge: true })
    },

    loadFromFirestore: async () => {
      const auth = getAuth()
      const user = auth.currentUser
      if (!user) throw new Error('Not authenticated')

      const ref = doc(db, `users/${user.uid}/cvs/main`)
      const snap = await getDoc(ref)
      if (snap.exists()) set(() => snap.data() as CvState)
    },

    deleteFromFirestore: async () => {
      const auth = getAuth()
      const user = auth.currentUser
      if (!user) throw new Error('Not authenticated')

      const ref = doc(db, `users/${user.uid}/cvs/main`)
      await deleteDoc(ref).then(() => {
        set(() => initialState)
        usePagination.getState().resetPages()
      })
    },

    autoSave: (() => {
      let timeout: number | null = null
      return () => {
        if (timeout) clearTimeout(timeout)
        timeout = window.setTimeout(() => {
          get().saveToFirestore().catch(console.error)
        }, 2000)
      }
    })(),
 */
