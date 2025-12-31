import { Snackbar, Alert } from '@mui/material'
import { useSnackbar } from '@/hooks/useSnackbar'

export default function GlobalSnackbar() {
  const { open, message, severity, hideSnackbar } = useSnackbar()

  return (
    <Snackbar
      open={open}
      autoHideDuration={4000}
      onClose={hideSnackbar}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert onClose={hideSnackbar} severity={severity} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  )
}
