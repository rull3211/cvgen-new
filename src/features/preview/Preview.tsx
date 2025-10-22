import { Box, Button, Paper, Typography } from '@mui/material'
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

export default function Preview() {
  const { user } = useAuth()
  const { leftPages, rightPages, pageNumber } = usePagination()
  const numberOfPages = Math.max(pageNumber.left, pageNumber.right) + 1
  const [page, setPage] = useState(0)
  const [startExport, setExport] = useState(false)
  function handlePageAction(num: number) {
    setPage((page + num + numberOfPages) % numberOfPages)
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
  const cv = useCv()
  const right = cv.order.right.map((el) => {
    const pages = rightPages[el][page]
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!pages) return null

    return pages.map((index) => {
      const render = cv[el][index]
      if (render.type === 'summary') {
        return <SummaryContent key={render.id} text={render.content} />
      } else {
        const { by, tittel, institusjon, fra, til, beskrivelse } = render
        const renderHasContent =
          !!by || !!tittel || !!institusjon || !!fra || !!til || !!beskrivelse
        if (
          (index === 0 && renderHasContent) ||
          (index === 0 && cv[el].length > 1)
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
    })
  })
  const left = cv.order.left.map((el) => {
    const pages = leftPages[el][page]
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!pages) return null

    return (
      <section key={el} className={styles[el]}>
        {pages.map((index) => {
          const render = cv[el][index]

          if (render.type === 'personalDetails') {
            return <PersonalDetailsContent key={render.id} element={render} />
          } else {
            if (
              (index === 0 && render.content) ||
              (index === 0 && cv[el].length > 1)
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
      <div>
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
              height: a4Height + 'cm',
              width: a4width + 'cm',
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
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
        </Paper>
      </div>
    </>
  )
}
