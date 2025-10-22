import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import styles from '../editor.module.scss'
import LabelWrapper from './LabelWrapper'
import type { CvState, ExperienceKey } from '@/hooks/useCv'
import { useCv } from '@/hooks/useCv'
import DebouncedTextField from '@/components/debouncedTextfield/DebouncedTextField'
import { StringDatePicker } from '@/components/datePicker/StringDatepicker'
import useIsSmallWidth from '@/hooks/useIsSmallWidth'

interface Props {
  label1: string
  label2: string
  label3: string
  label4: string
  label5: string
  type: keyof Pick<CvState, ExperienceKey>
  id: string
}

export default function Experience(props: Props) {
  const isSmall = useIsSmallWidth(680)
  const cv = useCv()
  const workExperience = cv[props.type].find((el) => el.id === props.id)
  const rowClassName = `${styles.row} ${isSmall && styles.small}`
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <section className={styles.experience}>
        <section className={rowClassName}>
          <LabelWrapper id={props.id + props.label1} label={props.label1}>
            <DebouncedTextField
              id={props.id + props.label1}
              onChange={(el) => {
                cv.updateWorkExperience(
                  props.type,
                  'tittel',
                  el.target.value,
                  props.id,
                )
              }}
              value={workExperience?.tittel}
              fullWidth
            />
          </LabelWrapper>
          <LabelWrapper id={props.id + props.label2} label={props.label2}>
            <DebouncedTextField
              id={props.id + props.label2}
              onChange={(el) =>
                cv.updateWorkExperience(
                  props.type,
                  'institusjon',
                  el.target.value,
                  props.id,
                )
              }
              value={workExperience?.institusjon}
              fullWidth
            />
          </LabelWrapper>
        </section>

        <section className={rowClassName}>
          <LabelWrapper id={props.id + props.label3} label={props.label3}>
            <section
              id={props.id + props.label3}
              className={`${styles.date} ${styles.small}`}
            >
              <StringDatePicker
                id={props.id + props.label3}
                slots={{ openPickerIcon: () => null }}
                format="MMM YYYY"
                views={['month', 'year']}
                value={workExperience?.fra || ''}
                onChange={(el) => {
                  cv.updateWorkExperience(props.type, 'fra', el || '', props.id)
                }}
              />
              <StringDatePicker
                id={props.id + props.label3}
                slots={{ openPickerIcon: () => null }}
                format="MMM YYYY"
                views={['month', 'year']}
                value={workExperience?.til || ''}
                onChange={(el) => {
                  cv.updateWorkExperience(props.type, 'til', el || '', props.id)
                }}
              />
            </section>
          </LabelWrapper>
          <LabelWrapper id={props.id + props.label4} label={props.label4}>
            <DebouncedTextField
              id={props.id + props.label4}
              onChange={(el) =>
                cv.updateWorkExperience(
                  props.type,
                  'by',
                  el.target.value,
                  props.id,
                )
              }
              value={workExperience?.by}
              fullWidth
            />
          </LabelWrapper>
        </section>
        <section className={rowClassName}>
          <LabelWrapper id={props.id + props.label5} label={props.label5}>
            <DebouncedTextField
              id={props.id + props.label5}
              onChange={(el) =>
                cv.updateWorkExperience(
                  props.type,
                  'beskrivelse',
                  el.target.value,
                  props.id,
                )
              }
              value={workExperience?.beskrivelse}
              fullWidth
              rows={7}
              multiline
            />
          </LabelWrapper>
        </section>
      </section>
    </LocalizationProvider>
  )
}
