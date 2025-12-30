import ClosableTab from '@/components/ClosableTab/ClosableTab'
import { useCv, type Experience as ExperienceType } from '@/hooks/useCv'
import { Box, Typography } from '@mui/material'
import { useShallow } from 'zustand/shallow'
import ExperienceEditorItem from './components/ExperienceEditorItem'

interface Identifier extends Pick<ExperienceType, 'type' | 'id'> {}
export default function ExperienceEditorCard({
  identifier,
}: {
  identifier: Identifier
}) {
  const experience = useCv(
    useShallow((state) => {
      return state[identifier.type].find((el) => (el.id = identifier.id))
    }),
  )
  if (!experience) return
  const header = (
    <Box component={'section'}>
      <Typography>
        {experience.tittel + '  hos ' + experience.institusjon}
      </Typography>
      <Typography>{experience.fra + ' - ' + experience.til}</Typography>
    </Box>
  )
  return (
    <ClosableTab
      key={experience.id + '-editor'}
      sx={{ border: '1px solid  rgba(172, 172, 172, 1)' }}
      header={header}
    >
      <ExperienceEditorItem
        type="workExperience"
        id={experience.id}
        key={experience.id}
        label1="Jobbtittel"
        label2="Ansetter"
        label3="Fra - til"
        label4="By"
        label5="Beskrivelse"
      ></ExperienceEditorItem>
    </ClosableTab>
  )
}
