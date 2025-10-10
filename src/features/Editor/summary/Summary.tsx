import LabelWrapper from '../components/LabelWrapper'
import { useCv } from '@/hooks/useCv'
import DebouncedTextField from '@/components/debouncedTextfield/DebouncedTextField'

export default function SummaryEditor() {
  const cv = useCv()
  return (
    <section>
      {cv.summary.map((summary) => {
        return (
          <LabelWrapper
            id={summary.id + 'oppsummering'}
            key={summary.id}
            label={'Oppsummering'}
          >
            <DebouncedTextField
              id={summary.id + 'oppsummering'}
              onChange={(el) =>
                cv.updateSummary('content', el.target.value, summary.id)
              }
              value={summary.content}
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
