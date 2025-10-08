import { create } from 'zustand'
import type { LeftOrder, RightOrder } from './useCv'
import { produce } from 'immer'

interface PageNumber {
  right: number
  left: number
}

type PaginationState = {
  pageNumber: PageNumber
  leftPages: Record<LeftOrder, Record<number, Array<number>>>
  rightPages: Record<RightOrder, Record<number, Array<number>>>
  setLeftPages: (pages: Record<string, Record<number, Array<number>>>) => void
  setRightPages: (pages: Record<string, Record<number, Array<number>>>) => void
  resetPages: () => void
  setPageNumber: (side: keyof PageNumber, number: number) => void
}

export const usePagination = create<PaginationState>((set) => ({
  pageNumber: { right: 0, left: 0 },
  leftPages: { personalDetails: { 0: [] }, skills: { 0: [] } } as Record<
    LeftOrder,
    Record<number, Array<number>>
  >,
  rightPages: {
    summary: { 0: [] },
    education: { 0: [] },
    workExperience: { 0: [] },
  } as Record<RightOrder, Record<number, Array<number>>>,
  setLeftPages: (pages) => set({ leftPages: pages }),
  setRightPages: (pages) => set({ rightPages: pages }),
  resetPages: () =>
    set({
      leftPages: {} as Record<LeftOrder, Record<number, Array<number>>>,
      rightPages: {} as Record<RightOrder, Record<number, Array<number>>>,
    }),
  setPageNumber: (side, number) =>
    set(
      produce((state: PaginationState) => {
        state.pageNumber = { ...state.pageNumber, [side]: number }
      }),
    ),
}))
