
import {create} from "zustand"
import { combine } from 'zustand/middleware'
import {produce} from "immer";

export interface CvState {
    workExperience: Array<Experience>
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

export const useCv = create(
  combine(
    { workExperience: [createEmptyWorkExperience()]} as CvState,
    (set) => ({
        addWorkExperience: () =>
            set((state) => ({
            workExperience: [...state.workExperience, createEmptyWorkExperience()],
            })),
        updateWorkExperience: (
        experience: keyof CvState, 
        field: keyof Experience, 
        value: string, 
        id: string
        ) =>
        set(produce((state: CvState) => {
            const index = state.workExperience.findIndex(el => el.id === id)
            if (index !== -1) {
            (state[experience])[index][field] = value
            }
        })),
        
    })
  )
)
