import * as React from 'react'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'
import { FormControl } from '@mui/material'

interface StringDatePickerProps {
  /** The value as a string (e.g. "10/2025") */
  value: string | null
  /** Called with a string when the user changes the date */
  onChange: (value: string | null) => void
  /** The display/parse format */
  format?: string
  /** Any other props for MUI X DatePicker */
  [key: string]: any
}

export const StringDatePicker: React.FC<StringDatePickerProps> = ({
  value,
  onChange,
  format = 'MMM YYYY',
  ...props
}) => {
  // Convert string -> Dayjs
  const parsedValue = value ? dayjs(value, format) : null

  return (
    <FormControl>
      <DatePicker
        {...props}
        value={parsedValue}
        format={format}
        onChange={(newValue: Dayjs | null) => {
          const formatted = newValue ? newValue.format(format) : null
          onChange(formatted)
        }}
      />
    </FormControl>
  )
}
