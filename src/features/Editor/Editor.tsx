import { Box, Button, TextField } from '@mui/material'
import styles from './editor.module.scss'
import PersoalDetails from './personalDetails/PersonalDetailsEditor'
import SummaryEditor from './summary/Summary'
import SkillsEditor from './SkillsEditor/SkillsEditor'
import { useCv } from '@/hooks/useCv'
import ClosableTab from '@/components/ClosableTab/ClosableTab'
import { useShallow } from 'zustand/shallow'
import ExperienceCard from './experience/ExperienceEditorCard'
import { useMemo } from 'react'

export default function Editor({ isSmallWidth }: { isSmallWidth: boolean }) {
  const {
    formHeaders,
    updateFormHeaders,
    addWorkExperience,
    workExperience,
    education,
  } = useCv(
    useShallow((state) => ({
      formHeaders: state.formHeaders,
      updateFormHeaders: state.updateFormHeaders,
      addWorkExperience: state.addWorkExperience,
      workExperience: state.workExperience,
      education: state.education,
    })),
  )

  const workExperienceIds = useMemo(
    () =>
      workExperience.map((el) => ({
        id: el.id,
        type: el.type,
      })),
    [workExperience],
  )

  const educationIds = useMemo(
    () =>
      education.map((el) => ({
        id: el.id,
        type: el.type,
      })),
    [education],
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
          return <ExperienceCard key={el.id} identifier={el} />
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
          <ExperienceCard key={el.id} identifier={el}></ExperienceCard>
        ))}
        <Button onClick={() => addWorkExperience('education')}>
          Add education
        </Button>
      </ClosableTab>
      <SkillsEditor />
    </Box>
  )
}
