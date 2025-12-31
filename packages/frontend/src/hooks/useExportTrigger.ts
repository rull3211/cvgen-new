import { create } from 'zustand'

interface ExportTriggerState {
  shouldExport: boolean
  triggerExport: () => void
  resetExport: () => void
}

export const useExportTrigger = create<ExportTriggerState>((set) => ({
  shouldExport: false,
  triggerExport: () => set({ shouldExport: true }),
  resetExport: () => set({ shouldExport: false }),
}))
