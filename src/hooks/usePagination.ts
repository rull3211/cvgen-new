import { create } from "zustand";
import type { LeftOrder, RightOrder } from "./useCv";

type PaginationState = {
  pageNumber: number
  leftPages: Record<LeftOrder,Record<number,Array<number>>>;
  rightPages: Record<RightOrder,Record<number,Array<number>>>;
  setLeftPages: (pages: Record<string,Record<number,Array<number>>>) => void;
  setRightPages: (pages: Record<string,Record<number,Array<number>>>) => void;
  resetPages: () => void;
  setPageNumber: (number:number) => void;
};

export const usePagination = create<PaginationState>((set) => ({
  pageNumber: 0,
  leftPages: {personalDetails:{0:[]}}as Record<LeftOrder,Record<number,Array<number>>>,
  rightPages: {education:{0:[]},workExperience:{0:[]},} as Record<RightOrder,Record<number,Array<number>>>,
  setLeftPages: (pages) => set({ leftPages: pages }),
  setRightPages: (pages) => set({ rightPages: pages }),
  resetPages: () => set({ leftPages: {} as Record<LeftOrder,Record<number,Array<number>>>, rightPages: {} as Record<RightOrder,Record<number,Array<number>>>}),
  setPageNumber: (number) => set({ pageNumber: number }),
}));