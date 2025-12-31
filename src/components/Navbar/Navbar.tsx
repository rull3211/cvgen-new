import { AppBar, Toolbar, Button, Box, IconButton } from '@mui/material'
import { useNavigate } from '@tanstack/react-router'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { useState } from 'react'
import ActionsDrawer from './ActionsDrawer'

export default function Navbar() {
  const navigate = useNavigate()
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <>
      <AppBar
        position="static"
        elevation={1}
        sx={{
          backgroundColor: 'white',
          color: 'text.primary',
        }}
      >
        <Toolbar>
          <Box sx={{ flexGrow: 1 }}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate({ to: '/cvs' })}
              sx={{
                textTransform: 'none',
                color: 'text.primary',
              }}
            >
              Back to CV List
            </Button>
          </Box>
          <IconButton
            edge="end"
            color="inherit"
            onClick={() => setDrawerOpen(true)}
            sx={{
              color: 'text.primary',
            }}
          >
            <MoreVertIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <ActionsDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  )
}
