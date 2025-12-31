import React, { useEffect, useState } from 'react'
import TextField from '@mui/material/TextField'
import type { TextFieldProps, TextFieldVariants } from '@mui/material/TextField'

type DebouncedTextFieldProps<
  TVariant extends TextFieldVariants = TextFieldVariants,
> = TextFieldProps<TVariant> & { delay?: number }

const DebouncedTextField: React.FC<DebouncedTextFieldProps> = ({
  delay = 300,
  onChange,
  value: controlledValue,
  ...rest
}) => {
  const [localValue, setLocalValue] = useState(controlledValue ?? '')
  const isFirstRender = React.useRef(true)
  const isUpdatingFromProps = React.useRef(false)

  // Keep localValue in sync with controlled value
  useEffect(() => {
    isUpdatingFromProps.current = true
    setLocalValue(controlledValue ?? '')
    // Reset the flag after state update
    setTimeout(() => {
      isUpdatingFromProps.current = false
    }, 0)
  }, [controlledValue])

  useEffect(() => {
    // Skip the effect on first render to prevent calling onChange with initial value
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    // Skip if we're updating from props (external state change, not user input)
    if (isUpdatingFromProps.current) {
      return
    }

    if (!onChange) return

    const handler = setTimeout(() => {
      // Create a synthetic event object compatible with onChange
      onChange({
        target: { value: localValue },
      } as React.ChangeEvent<HTMLInputElement>)
    }, delay)

    return () => clearTimeout(handler)
  }, [localValue, onChange, delay])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalValue(e.target.value) // immediate update for typing
  }

  return <TextField {...rest} value={localValue} onChange={handleChange} />
}

export default DebouncedTextField
