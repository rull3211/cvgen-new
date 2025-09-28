import { create } from "zustand";

type PaginationState = {
  leftPages: Array<Array<number>>;
  rightPages: Array<Array<number>>;
  setLeftPages: (pages: Array<Array<number>>) => void;
  setRightPages: (pages: Array<Array<number>>) => void;
  resetPages: () => void;
};

export const usePagination = create<PaginationState>((set) => ({
  leftPages: [],
  rightPages: [],
  setLeftPages: (pages) => set({ leftPages: pages }),
  setRightPages: (pages) => set({ rightPages: pages }),
  resetPages: () => set({ leftPages: [], rightPages: [] }),
}));