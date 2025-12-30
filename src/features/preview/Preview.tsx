import {
  Box,
  Button,
  Paper,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  Alert,
} from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import PDFPagination from '../paginatedTest/PaginatedApp'
import Export from '../exportContainer/Export'
import ExperienceContent from '../pdfContents/ExperienceContent'
import PersonalDetailsContent from '../pdfContents/PersonalDetailsContent'
import SummaryContent from '../pdfContents/SummaryContent'
import SkillContent from '../pdfContents/SkillsContent'
import ExportCv from '../exportContainer/ExportCv'
import styles from './PreviewStyles.module.scss'
import { a4Height, a4width } from '@/constants'
import { useCv } from '@/hooks/useCv'
import { exportPDF } from '@/hooks/exportPdf'
import { usePagination } from '@/hooks/usePagination'
import { useAuth } from '@/hooks/useAuth'
import { useScaleOnResize } from './hooks/useScale'
import { useShallow } from 'zustand/shallow'

export default function Preview() {
  const { user } = useAuth()
  const deleteFromFirestore = useCv((state) => state.deleteFromFirestore)
  const { leftPages, rightPages, pageNumber } = usePagination(
    useShallow((state) => ({
      leftPages: state.leftPages,
      rightPages: state.rightPages,
      pageNumber: state.pageNumber,
    })),
  )
  const numberOfPages = Math.max(pageNumber.left, pageNumber.right) + 1
  const [page, setPage] = useState(0)
  const [startExport, setExport] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [snackbar, setSnackbar] = useState<{
    open: boolean
    message: string
    severity: 'success' | 'error'
  }>({
    open: false,
    message: '',
    severity: 'success',
  })

  function handlePageAction(num: number) {
    setPage((page + num + numberOfPages) % numberOfPages)
  }

  const handleDeleteCV = async () => {
    setShowDeleteDialog(false)
    setIsDeleting(true)
    try {
      await deleteFromFirestore()
      setSnackbar({ open: true, message: 'CV slettet!', severity: 'success' })
    } catch (error) {
      console.error('Failed to delete CV:', error)
      setSnackbar({
        open: true,
        message: 'Kunne ikke slette CV. Prøv igjen.',
        severity: 'error',
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const exportPreview = async () => {
    if (!previewRef.current) return

    const node = previewRef.current
    const html = node.outerHTML
    const token = await user?.getIdToken()

    // ✨ Editable list of tag selectors to exclude
    const excludedTagSelectors = ['html', 'body']

    const cssText = Array.from(document.styleSheets)
      .map((sheet) => {
        try {
          return Array.from(sheet.cssRules)
            .filter((rule) => {
              // Include all non-style rules (like @media, @font-face)
              if (!(rule instanceof CSSStyleRule)) return true

              const selector = rule.selectorText || ''

              // Check if selector is a pure tag (or list of tags)
              const hasTagSelector = excludedTagSelectors.some((tag) =>
                new RegExp(`\\b${tag}\\b(?![.#])`, 'i').test(selector),
              )

              return !hasTagSelector
            })
            .map((rule) => rule.cssText)
            .join('\n')
        } catch (e) {
          // Skip cross-origin stylesheets gracefully
          return ''
        }
      })
      .join('\n')

    if (token) {
      exportPDF(html, cssText, token).finally(() => setExport(false))
    }
  }

  useEffect(() => {
    if (startExport) exportPreview()
  }, [startExport])

  const previewRef = useRef<HTMLDivElement>(null)
  const scale = useScaleOnResize()
  const cvState = useCv(
    useShallow((state) => ({
      order: state.order,
      summary: state.summary,
      workExperience: state.workExperience,
      education: state.education,
      skills: state.skills,
      personalDetails: state.personalDetails,
    })),
  )
  const right = cvState.order.right.flatMap((el) => {
    const pages = rightPages[el][page]
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!pages) return []

    return pages.flatMap((index) => {
      const render = cvState[el][index]
      // Guard against undefined render
      if (!render) return []

      try {
        if (render.type === 'summary') {
          return <SummaryContent key={render.id} text={render.content} />
        } else {
          const { by, tittel, institusjon, fra, til, beskrivelse } = render
          const renderHasContent =
            !!by || !!tittel || !!institusjon || !!fra || !!til || !!beskrivelse
          if (
            (index === 0 && renderHasContent) ||
            (index === 0 && cvState[el].length > 1)
          ) {
            const text =
              render.type === 'workExperience' ? 'Arbeidserfaring' : 'Utdanning'
            return [
              <Typography
                key={render.type}
                sx={{ fontSize: '1.5rem', fontWeight: 700 }}
                variant="h2"
              >
                {text}
              </Typography>,
              <ExperienceContent key={render.id} element={render} />,
            ]
          }
          return <ExperienceContent key={render.id} element={render} />
        }
      } catch (er) {
        console.log(render, er)
        console.log(cvState)
        console.log(index)
        console.log(el)
        return []
      }
    })
  })
  const left = cvState.order.left.map((el) => {
    const pages = leftPages[el][page]
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!pages) return null

    return (
      <section key={el} className={styles[el]}>
        {pages.flatMap((index) => {
          const render = cvState[el][index]
          // Guard against undefined render
          if (!render) return []

          if (render.type === 'personalDetails') {
            return <PersonalDetailsContent key={render.id} element={render} />
          } else {
            if (
              (index === 0 && render.content) ||
              (index === 0 && cvState[el].length > 1)
            ) {
              return [
                <Typography key={'ferdigheter'} variant="h2">
                  Ferdigheter
                </Typography>,
                <SkillContent key={render.id} skill={render} />,
              ]
            }
            return <SkillContent key={render.id} skill={render} />
          }
        })}
      </section>
    )
  })
  return (
    <>
      <div
        style={{
          position: 'absolute',
          top: '-100%',
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            height: a4Height + 'cm',
            width: a4width + 'cm',
          }}
        >
          <PDFPagination></PDFPagination>
        </Box>
      </div>
      {startExport && <Export ref={previewRef}></Export>}
      <div
        style={{
          display: 'flex',

          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
        }}
      >
        <div
          style={{
            height: a4Height * scale + 'cm',
            width: a4width * scale + 'cm',
            transformOrigin: 'top left',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div
            className={styles.preview}
            style={{
              transformOrigin: 'top left',
              transform: `scale(${scale})`,
              minHeight: a4Height + 'cm',
              minWidth: a4width + 'cm',
            }}
          >
            <div className={styles.left}>
              <section>{left}</section>
            </div>
            <div className={styles.right}>
              <section>{right}</section>
            </div>
          </div>
        </div>
        <Paper
          component={'section'}
          sx={{
            padding: '0.5rem',
            display: 'flex',
            justifyContent: 'center',
            margin: '0 3% 0% 3%',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Button
              disabled={numberOfPages === 1}
              onClick={() => handlePageAction(-1)}
            >
              Prev
            </Button>
            <Typography>
              {page + 1}/{numberOfPages}
            </Typography>
            <Button
              disabled={numberOfPages === 1}
              onClick={() => handlePageAction(+1)}
            >
              Next
            </Button>
          </Box>

          <ExportCv></ExportCv>

          <Button
            onClick={() => {
              setExport(true)
            }}
          >
            Eksporter
          </Button>

          <Button
            onClick={() => setShowDeleteDialog(true)}
            disabled={isDeleting}
            color="error"
            variant="outlined"
            sx={{ marginLeft: '1rem' }}
          >
            {isDeleting ? 'Sletter...' : 'Slett CV'}
          </Button>
        </Paper>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={showDeleteDialog}
          onClose={() => setShowDeleteDialog(false)}
        >
          <DialogTitle>Slett CV</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Er du sikker på at du vil slette hele CV-en? Dette kan ikke
              angres.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowDeleteDialog(false)}>Avbryt</Button>
            <Button onClick={handleDeleteCV} color="error" autoFocus>
              Slett
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for feedback */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </div>
    </>
  )
}
