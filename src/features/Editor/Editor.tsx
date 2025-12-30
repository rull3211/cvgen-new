import { Box, Button, TextField, Typography } from '@mui/material'
import styles from './editor.module.scss'
import PersoalDetails from './personalDetails/PersonalDetailsEditor'
import SummaryEditor from './summary/Summary'
import SkillsEditor from './SkillsEditor/SkillsEditor'
import { useCv } from '@/hooks/useCv'
import ClosableTab from '@/components/ClosableTab/ClosableTab'
import { useShallow } from 'zustand/shallow'
import ExperienceCard from './experience/ExperienceEditorCard'

export default function Editor({ isSmallWidth }: { isSmallWidth: boolean }) {
  const {
    formHeaders,
    updateFormHeaders,
    addWorkExperience,
    workExperienceIds,
    educationIds,
  } = useCv(
    useShallow((state) => {
      return {
        formHeaders: state.formHeaders,
        updateFormHeaders: state.updateFormHeaders,
        addWorkExperience: state.addWorkExperience,
        workExperienceIds: state.workExperience.map((el) => {
          return {
            id: el.id,
            type: el.type,
          }
        }),
        educationIds: state.education.map((el) => {
          return {
            id: el.id,
            type: el.type,
          }
        }),
      }
    }),
  )
  return (
    <Box
      sx={{
        maxWidth: isSmallWidth ? '100%' : '50%',
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column',
        flex: '1',
        padding: '1rem',
      }}
      component={'section'}
      className={styles.editor}
    >
      <ClosableTab header={'Personalia'}>
        <PersoalDetails />
      </ClosableTab>
      <ClosableTab header={'Oppsummering'}>
        <SummaryEditor />
      </ClosableTab>
      <ClosableTab
        sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
        header={
          <TextField
            value={formHeaders['workExperience']}
            onChange={(el) => {
              updateFormHeaders('workExperience', el.target.value)
            }}
          />
        }
      >
        {workExperienceIds.map((el) => {
          return <ExperienceCard identifier={el} />
        })}
        <Button onClick={() => addWorkExperience('workExperience')}>
          Add experience
        </Button>
      </ClosableTab>

      <ClosableTab
        header={
          <TextField
            value={formHeaders['education']}
            onChange={(el) => {
              updateFormHeaders('education', el.target.value)
            }}
          />
        }
      >
        {educationIds.map((el) => (
          <ExperienceCard identifier={el}></ExperienceCard>
        ))}
        <Button onClick={() => addWorkExperience('education')}>
          Add education
        </Button>
      </ClosableTab>
      <SkillsEditor />
    </Box>
  )
}
