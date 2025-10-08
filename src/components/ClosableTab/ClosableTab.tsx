import {
  Box,
  IconButton,
  Paper,
  Typography,
  type PaperProps,
} from '@mui/material'
import { useState } from 'react'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import type { ReactNode } from 'react'

interface Props extends PaperProps {
  header?: string | ReactNode
  children: ReactNode
}
export default function ClosableTab({ header, children, ...rest }: Props) {
  const [isOpen, setOpen] = useState<boolean>(true)
  const rotate = isOpen ? 180 : 0
  return (
    <Paper {...rest} sx={{ padding: '1rem', marginBottom: '1rem', ...rest.sx }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
        component={'section'}
      >
        <Typography sx={{ fontWeight: 700, fontSize: '1.5rem' }}>
          {header}
        </Typography>
        <IconButton onClick={() => setOpen(!isOpen)}>
          <ExpandLessIcon
            sx={{
              fontSize: '2rem',
              color: 'black',
              transform: `rotate(${rotate}deg)`,
              transition: 'transform ease 0.3s',
            }}
          />
        </IconButton>
      </Box>

      <Box
        component={'section'}
        sx={{
          maxHeight: isOpen ? '40rem' : '0px',
          overflow: 'auto',
          transition: 'max-height 0.4s ease',
        }}
      >
        {children}
      </Box>
    </Paper>
  )
}
