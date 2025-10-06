
import {create} from "zustand"
import { combine } from 'zustand/middleware'
import {produce} from "immer";

export type RightOrder = keyof Pick<CvState,"education"|"workExperience"|"summary">
export type LeftOrder = keyof Pick<CvState, "skills" | "personalDetails">
export interface CvState {
    summary:Array<Summary>,
    workExperience: Array<Experience>
    education: Array<Experience>
    personalDetails: Array<PersonalDetails>
    order:{left: Array<LeftOrder>, right:Array<RightOrder>}
    skills: Array<Skill>
}

export interface Summary{
  id: string
  type: "summary",
  content: string
}

export interface Skill{
  id: string
  type: "skill",
  content: string
  level: string
}
export interface Experience {
    type: ExperienceKey
    id:string
    tittel: string | undefined,
    institusjon:string | undefined,
    by: string | undefined,
    fra: string | undefined,
    til: string | undefined,
    beskrivelse: string | undefined
}

export interface PersonalDetails{
    id:string,
    type:"personalDetails"
    jobbtittel: string,
    fornavn: string,
    etternavn: string,
    email: string,
    telefon: string,
    adresse:string,
    by: string,
    land: string
}

function createEmptyExperience(type: ExperienceKey):Experience{
    return {
        type,
        id: crypto.randomUUID(),
        tittel:"",
        institusjon: "",
        by: "",
        fra:undefined,
        til: undefined,
        beskrivelse:""}
}
function createEmptyPersonalDetails():PersonalDetails{
    return{
        type:"personalDetails",
        id: crypto.randomUUID(),
        jobbtittel: "",
        fornavn: "",
        etternavn: "",
        email: "",
        telefon: "",
        adresse:"",
        by: "",
        land: ""
    }
}

export type ExperienceKey = "workExperience" | "education";

export const useCv = create(
  combine(
    {
      summary:[{type:"summary", content:"", id: crypto.randomUUID()}],
      workExperience: [createEmptyExperience("workExperience")],
      education: [createEmptyExperience("education")],
      personalDetails: [createEmptyPersonalDetails()],
      order:{left:["personalDetails", "skills"], right:["summary","workExperience","education"]},
      skills:[{type:"skill", content:"", id: crypto.randomUUID(), level:"1"}]
    } as CvState,
    (set) => ({
      setState: (newState: CvState) => set(() => newState),
      addWorkExperience: (experience: ExperienceKey) =>
        set((state) => ({
          [experience]: [...state[experience], createEmptyExperience("workExperience")],
        })),
      addSkill: () =>
        set((state) => ({
          skills: [...state.skills, {type:"skill", content:"", id: crypto.randomUUID(), level:"1"}],
        })),
      updateSummary: (
        field: Exclude<keyof Summary, "type">,
        value: string,
        id: string
      ) =>
        set(produce((state: CvState) => {
          const index = state.summary.findIndex(el => el.id === id)
          if (index !== -1) {
            state.summary[index][field] = value
          }
        })),
      updateWorkExperience: (
        experience: ExperienceKey,
        field: Exclude<keyof Experience, "type">,
        value: string,
        id: string
      ) =>
        set(produce((state: CvState) => {
          const index = state[experience].findIndex(el => el.id === id)
          if (index !== -1) {
            state[experience][index][field] = value
          }
        })),
        updateSkills: (
        field: Exclude<keyof Skill, "type">,
        value: string,
        id: string
      ) =>
        set(produce((state: CvState) => {
          const index = state.skills.findIndex(el => el.id === id)
          if (index !== -1) {
            state.skills[index][field] = value
          }
        })),

      updatePersonalDetails: (
        field: Exclude<keyof PersonalDetails, "type">,
        value: string,
        id: string
      ) =>
        set(produce((state: CvState) => {
          const index = state.personalDetails.findIndex(el => el.id === id)
          if (index !== -1) {
            state.personalDetails[index][field] = value
          }
        })),
    })
  )
)