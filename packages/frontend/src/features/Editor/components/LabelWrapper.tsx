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
  id: string
}

export default function LabelWrapper({
  label,
  children,
  className,
  id,
  ...rest
}: LabelWrapperProps) {
  return (
    <FormControl
      sx={{ marginTop: '0.7rem' }}
      {...rest}
      className={className}
      fullWidth
    >
      <InputLabel htmlFor={id} shrink>
        {label}
      </InputLabel>
      <Box mt={1}>{children}</Box>
    </FormControl>
  )
}
