import {
  Box,
  FormControl,
  InputLabel,
  type FormControlProps,
} from '@mui/material'

interface LabelWrapperProps extends FormControlProps {
  label: string
  children: React.ReactNode
  className?: string
}

export default function LabelWrapper({
  label,
  children,
  className,
  ...rest
}: LabelWrapperProps) {
  return (
    <FormControl
      sx={{ marginTop: '0.7rem' }}
      {...rest}
      className={className}
      fullWidth
    >
      <InputLabel shrink>{label}</InputLabel>
      <Box mt={1}>{children}</Box>
    </FormControl>
  )
}
