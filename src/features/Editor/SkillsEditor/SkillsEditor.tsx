import { Box, Button, TextField } from '@mui/material'
import LabelWrapper from '../components/LabelWrapper'
import { useCv } from '@/hooks/useCv'
import DebouncedTextField from '@/components/debouncedTextfield/DebouncedTextField'
import ClosableTab from '@/components/ClosableTab/ClosableTab'

export default function SkillsEditor() {
  const cv = useCv()
  return (
    <ClosableTab
      header={
        <TextField
          value={cv.formHeaders['skills']}
          onChange={(el) => {
            cv.updateFormHeaders('skills', el.target.value)
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
        {cv.skills.map((skill) => {
          return (
            <LabelWrapper id={skill.id} key={skill.id} label={'Ferdigheter'}>
              <DebouncedTextField
                id={skill.id}
                onChange={(el) =>
                  cv.updateSkills('content', el.target.value, skill.id)
                }
                value={skill.content}
                fullWidth
              />
            </LabelWrapper>
          )
        })}
      </Box>

      <Button onClick={() => cv.addSkill()}>AddSkill</Button>
    </ClosableTab>
  )
}
