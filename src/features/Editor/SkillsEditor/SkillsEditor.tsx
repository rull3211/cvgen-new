import { Box, Button, TextField } from '@mui/material'
import LabelWrapper from '../components/LabelWrapper'
import { useCv } from '@/hooks/useCv'
import DebouncedTextField from '@/components/debouncedTextfield/DebouncedTextField'
import ClosableTab from '@/components/ClosableTab/ClosableTab'
import { useShallow } from 'zustand/shallow'

export default function SkillsEditor() {
  const { skills, addSkill, updateSkills, formHeaders, updateFormHeaders } =
    useCv(
      useShallow((state) => {
        return {
          skills: state.skills,
          addSkill: state.addSkill,
          updateSkills: state.updateSkills,
          formHeaders: state.formHeaders,
          updateFormHeaders: state.updateFormHeaders,
        }
      }),
    )

  return (
    <ClosableTab
      header={
        <TextField
          value={formHeaders['skills']}
          onChange={(el) => {
            updateFormHeaders('skills', el.target.value)
          }}
        />
      }
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          padding: '2rem',
        }}
      >
        {skills.map((skill) => {
          return (
            <LabelWrapper id={skill.id} key={skill.id} label={'Ferdigheter'}>
              <DebouncedTextField
                id={skill.id}
                onChange={(el) =>
                  updateSkills('content', el.target.value, skill.id)
                }
                value={skill.content}
                fullWidth
              />
            </LabelWrapper>
          )
        })}
      </Box>

      <Button onClick={() => addSkill()}>AddSkill</Button>
    </ClosableTab>
  )
}
