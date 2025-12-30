import useIsSmallWidth from '@/hooks/useIsSmallWidth'
import Editor from '../Editor/Editor'
import Preview from '../preview/Preview'
import { Box, Toolbar } from '@mui/material'
import { useState } from 'react'
import { motion } from 'motion/react'
import { useNavigate } from '@tanstack/react-router'

export default function CvAppLayout() {
  const isSmall = useIsSmallWidth(1400)
  const [mode, setMode] = useState<'Edit' | 'Preview'>('Edit')
  const navigate = useNavigate()

  return (
    <main
      style={{
        display: 'flex',
        justifyContent: 'space-around',
        flexDirection: 'column',
        alignItems: isSmall ? 'center' : 'start',
        gap: '1rem',
      }}
    >
      {/* Back to CV List button - always visible */}
      <div
        style={{
          padding: '1rem',
          width: '100%',
        }}
      >
        <button
          onClick={() => navigate({ to: '/cvs' })}
          style={{
            background: 'white',
            border: '1px solid #ddd',
            borderRadius: '0.5rem',
            padding: '0.5rem 1rem',
            cursor: 'pointer',
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          ← Back to CV List
        </button>
      </div>

      {isSmall && (
        <Toolbar
          sx={{
            background: 'rgb(239, 242, 249)',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              position: 'relative',
              display: 'flex',
              background: 'white',
              borderRadius: '9999px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
              overflow: 'hidden',
            }}
          >
            {/* Sliding background */}
            <motion.div
              layout
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: mode === 'Edit' ? 0 : '50%',
                width: '50%',
                background: '#1976d2',
                borderRadius: '9999px',
              }}
            />

            {/* Buttons */}
            <button
              onClick={() => setMode(mode === 'Edit' ? 'Preview' : 'Edit')}
              style={{
                position: 'relative',
                zIndex: 1,
                flex: 1,
                border: 'none',
                background: 'transparent',
                color: mode === 'Edit' ? 'white' : '#555',
                fontWeight: 600,
                padding: '0.6rem 1.5rem',
                cursor: 'pointer',
              }}
            >
              Edit
            </button>

            <button
              onClick={() => setMode(mode === 'Edit' ? 'Preview' : 'Edit')}
              style={{
                position: 'relative',
                zIndex: 1,
                flex: 1,
                border: 'none',
                background: 'transparent',
                color: mode === 'Preview' ? 'white' : '#555',
                fontWeight: 600,
                padding: '0.6rem 1.5rem',
                cursor: 'pointer',
              }}
            >
              Preview
            </button>
          </div>
        </Toolbar>
      )}
      <Box
        sx={{
          display: 'flex',
          flex: 1,
          flexDirection: 'row',
          minHeight: 0,
          width: '100%',
        }}
      >
        {(!isSmall || mode === 'Edit') && <Editor isSmallWidth={isSmall} />}
        {(!isSmall || mode === 'Preview') && <Preview />}
      </Box>
    </main>
  )
}
