import { create } from 'zustand'
import { combine } from 'zustand/middleware'
import { produce } from 'immer'
import { deleteDoc, doc, getDoc, setDoc } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { db } from '@/features/auth/firebase'

export type RightOrder = keyof Pick<
  CvState,
  'education' | 'workExperience' | 'summary'
>
export type LeftOrder = keyof Pick<CvState, 'skills' | 'personalDetails'>

export interface CvState {
  summary: Array<Summary>
  workExperience: Array<Experience>
  education: Array<Experience>
  personalDetails: Array<PersonalDetails>
  order: { left: Array<LeftOrder>; right: Array<RightOrder> }
  skills: Array<Skill>
  formHeaders: Record<string, string>
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
  tittel: string | undefined
  institusjon: string | undefined
  by: string | undefined
  fra: string | undefined
  til: string | undefined
  beskrivelse: string | undefined
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
    fra: undefined,
    til: undefined,
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

export interface CvStore extends CvState {
  // ---- General actions ----
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
  deleteFromFirestore: () => Promise<void>
  // ---- Firestore actions ----
  saveToFirestore: () => Promise<void>
  loadFromFirestore: () => Promise<void>
  autoSave: () => void
}
export const useCv = create<CvStore>((set, get) => ({
  // -------------------------------
  // Initial State
  // -------------------------------
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

  // -------------------------------
  // State actions
  // -------------------------------
  setState: (newState) => set(() => newState),

  addWorkExperience: (experience) =>
    set((state) => ({
      [experience]: [
        ...state[experience],
        createEmptyExperience('workExperience'),
      ],
    })),

  addSkill: () =>
    set((state) => ({
      skills: [
        ...state.skills,
        { type: 'skill', content: '', id: crypto.randomUUID(), level: '1' },
      ],
    })),

  updateSummary: (field, value, id) =>
    set(
      produce((state: CvState) => {
        const item = state.summary.find((el) => el.id === id)
        if (item) item[field] = value
      }),
    ),

  updateWorkExperience: (experience, field, value, id) =>
    set(
      produce((state: CvState) => {
        const item = state[experience].find((el) => el.id === id)
        if (item) item[field] = value
      }),
    ),

  updateSkills: (field, value, id) =>
    set(
      produce((state: CvState) => {
        const item = state.skills.find((el) => el.id === id)
        if (item) item[field] = value
      }),
    ),

  updatePersonalDetails: (field, value, id) =>
    set(
      produce((state: CvState) => {
        const item = state.personalDetails.find((el) => el.id === id)
        if (item) item[field] = value
      }),
    ),

  updateFormHeaders: (header, value) =>
    set(
      produce((state: CvState) => {
        state.formHeaders[header] = value
      }),
    ),

  // -------------------------------
  // Firestore helpers
  // -------------------------------
  async saveToFirestore() {
    const auth = getAuth()
    const user = auth.currentUser
    console.log('hei')
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

  async loadFromFirestore() {
    const auth = getAuth()
    const user = auth.currentUser
    if (!user) throw new Error('Not authenticated')
    const ref = doc(db, `users/${user.uid}/cvs/main`)
    const snap = await getDoc(ref)
    if (snap.exists()) this.setState(snap.data() as CvState)
  },
  async deleteFromFirestore() {
    const auth = getAuth()
    const user = auth.currentUser
    if (!user) throw new Error('Not authenticated')

    const ref = doc(db, `users/${user.uid}/cvs/main`)
    await deleteDoc(ref).then(() => {
      get().setState({
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
        skills: [
          { type: 'skill', content: '', id: crypto.randomUUID(), level: '1' },
        ],
      })
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
}))
