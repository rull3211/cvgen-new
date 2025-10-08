import { useEffect, useRef } from 'react'
import styles from '../preview/PreviewStyles.module.scss'
import ExperienceContent from '../pdfContents/ExperienceContent'
import PersonalDetailsContent from '../pdfContents/PersonalDetailsContent'
import SummaryContent from '../pdfContents/SummaryContent'
import SkillContent from '../pdfContents/SkillsContent'
import type { CvState } from '@/hooks/useCv'
import { usePagination } from '@/hooks/usePagination'
import { useCv } from '@/hooks/useCv'
import { a4HeightInCm, a4WidthInCm } from '@/constants'

export default function PDFPagination() {
  const leftRef = useRef<HTMLDivElement | null>(null)
  const rightRef = useRef<HTMLDivElement | null>(null)
  const cv = useCv()
  const { setLeftPages, setRightPages, pageNumber, setPageNumber } =
    usePagination()

  function paginate(container: HTMLDivElement, side: keyof CvState['order']) {
    const vw = window.innerWidth
    const vh = window.innerHeight
    const scale = Math.min(
      1,
      Math.min(vw / a4WidthInCm, vh / a4HeightInCm) * 0.9,
    )
    const maxHeight = 1122 * 0.8 * scale
    const children = Array.from(container.children) as Array<HTMLDivElement>
    const pagesOrder: Record<string, Record<number, Array<number>>> = {}
    let currentPageNumber = 0
    let currentHeight = 0
    container.getBoundingClientRect()
    cv.order[side].forEach((sectionName, sectionIndex) => {
      const section = children[sectionIndex]
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (!section) return

      const items = Array.from(section.children) as Array<HTMLDivElement>
      const heights = items.map((el) => {
        const h = el.getBoundingClientRect().height || el.offsetHeight || 0
        return Math.round(h)
      })

      const tempPages: Record<number, Array<number>> = {}
      let currentPage: Array<number> = []
      heights.forEach((itemHeight, idx) => {
        if (currentHeight + itemHeight > maxHeight) {
          console.log(itemHeight)
          if (currentPage.length > 0) tempPages[currentPageNumber] = currentPage
          currentPageNumber++
          currentPage = [idx]
          currentHeight = itemHeight
        } else {
          console.log(itemHeight)
          currentPage.push(idx)
          currentHeight += itemHeight
        }
      })

      if (currentPage.length > 0) tempPages[currentPageNumber] = currentPage
      pagesOrder[sectionName] = tempPages
    })
    if (currentPageNumber > pageNumber) setPageNumber(currentPageNumber)

    return pagesOrder
  }
  const measurePages = () => {
    if (rightRef.current) setRightPages(paginate(rightRef.current, 'right'))
    if (leftRef.current) setLeftPages(paginate(leftRef.current, 'left'))
  }

  // Observe column changes and re-paginate
  useEffect(() => {
    const observer = new ResizeObserver(() => measurePages())
    if (leftRef.current) observer.observe(leftRef.current)
    if (rightRef.current) observer.observe(rightRef.current)

    return () => observer.disconnect()
  }, [cv.education, cv.workExperience])

  return (
    <div>
      {/* Hidden measurement containers (always mounted) */}
      <div
        style={{
          position: 'absolute',
          visibility: 'hidden',
          left: 0,
          top: 0,
          width: '100%',
          pointerEvents: 'none',
          zIndex: -1,
          display: 'flex',
        }}
        aria-hidden
      >
        <div ref={leftRef} className={`${styles.left} ${styles.calc}`}>
          {cv.order.left.map((orderElement) => {
            return (
              <section key={orderElement + 'paginate'}>
                {cv[orderElement].map((elementToRender) => {
                  if (elementToRender.type === 'personalDetails')
                    return <PersonalDetailsContent element={elementToRender} />
                  return <SkillContent skill={elementToRender} />
                })}
              </section>
            )
          })}
        </div>
        <div ref={rightRef} className={`${styles.right} ${styles.calc}`}>
          {cv.order.right.map((field) => {
            return (
              <section key={field + 'paginate'}>
                {cv[field].map((el) => {
                  if (el.type === 'summary')
                    return <SummaryContent text={el.content} />
                  return <ExperienceContent key={el.id} element={el} />
                })}
              </section>
            )
          })}
        </div>
      </div>
    </div>
  )
}
