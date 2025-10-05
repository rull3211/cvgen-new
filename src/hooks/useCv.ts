
import {create} from "zustand"
import { combine } from 'zustand/middleware'
import {produce} from "immer";

export type RightOrder = keyof Pick<CvState,"education"|"workExperience">
export type LeftOrder = keyof Pick<CvState,"personalDetails">
export interface CvState {
    workExperience: Array<Experience>
    education: Array<Experience>
    personalDetails: PersonalDetails
    order:{left: Array<LeftOrder>, right:Array<RightOrder>}
}

export interface Experience {
    id:string
    tittel: string | undefined,
    institusjon:string | undefined,
    by: string | undefined,
    fra: string | undefined,
    til: string | undefined,
    beskrivelse: string | undefined
}

export interface PersonalDetails{
    jobbtittel: string,
    fornavn: string,
    etternavn: string,
    email: string,
    telefon: string,
    adresse:string,
    by: string,
    land: string
}

function createEmptyWorkExperience():Experience{
    return {
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
      workExperience: [createEmptyWorkExperience()],
      education: [createEmptyWorkExperience()],
      personalDetails: createEmptyPersonalDetails(),
      order:{left:["personalDetails", ], right:["workExperience","education"]}
    } as CvState,
    (set) => ({
      addWorkExperience: (experience: ExperienceKey) =>
        set((state) => ({
          [experience]: [...state[experience], createEmptyWorkExperience()],
        })),

      updateWorkExperience: (
        experience: ExperienceKey,
        field: keyof Experience,
        value: string,
        id: string
      ) =>
        set(produce((state: CvState) => {
          const index = state[experience].findIndex(el => el.id === id)
          if (index !== -1) {
            state[experience][index][field] = value
          }
        })),

      updatePersonalDetails: (
        field: keyof PersonalDetails,
        value: string,
      ) =>
        set(produce((state: CvState) => {
          state.personalDetails[field] = value
        })),
    })
  )
)