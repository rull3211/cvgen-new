import LabelWrapper from '../components/LabelWrapper'
import { useCv } from '@/hooks/useCv'
import DebouncedTextField from '@/components/debouncedTextfield/DebouncedTextField'
import { useShallow } from 'zustand/shallow'

export default function SummaryEditor() {
  const { summary, updateSummary } = useCv(
    useShallow((state) => ({
      summary: state.summary,
      updateSummary: state.updateSummary,
    })),
  )
  return (
    <section>
      {summary.map((summaryItem) => {
        return (
          <LabelWrapper
            id={summaryItem.id + 'oppsummering'}
            key={summaryItem.id}
            label={'Oppsummering'}
          >
            <DebouncedTextField
              id={summaryItem.id + 'oppsummering'}
              onChange={(el) =>
                updateSummary('content', el.target.value, summaryItem.id)
              }
              value={summaryItem.content}
              fullWidth
              rows={7}
              multiline
            />
          </LabelWrapper>
        )
      })}
    </section>
  )
}
