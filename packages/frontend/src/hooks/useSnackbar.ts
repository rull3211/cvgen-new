import { create } from 'zustand'

type SnackbarSeverity = 'success' | 'error' | 'warning' | 'info'

interface SnackbarState {
  open: boolean
  message: string
  severity: SnackbarSeverity
}

interface SnackbarActions {
  showSnackbar: (message: string, severity?: SnackbarSeverity) => void
  hideSnackbar: () => void
}

export const useSnackbar = create<SnackbarState & SnackbarActions>((set) => ({
  open: false,
  message: '',
  severity: 'success',
  showSnackbar: (message, severity = 'success') =>
    set({ open: true, message, severity }),
  hideSnackbar: () => set({ open: false }),
}))
