import { Box, Button, TextField, Typography } from '@mui/material'
import Experience from './components/Experience'
import styles from './editor.module.scss'
import PersoalDetails from './components/PersonalDetails'
import SummaryEditor from './summary/Summary'
import SkillsEditor from './SkillsEditor/SkillsEditor'
import { useCv } from '@/hooks/useCv'
import ClosableTab from '@/components/ClosableTab/ClosableTab'

export default function Editor({ isSmallWidth }: { isSmallWidth: boolean }) {
  const cvState = useCv()
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
            value={cvState.formHeaders['workExperience']}
            onChange={(el) => {
              cvState.updateFormHeaders('workExperience', el.target.value)
            }}
          />
        }
      >
        {cvState.workExperience.map((el) => {
          const header = (
            <Box component={'section'}>
              <Typography>{el.tittel + '  hos ' + el.institusjon}</Typography>
              <Typography>{el.fra + ' - ' + el.til}</Typography>
            </Box>
          )
          return (
            <ClosableTab
              key={el.id + '-editor'}
              sx={{ border: '1px solid  rgba(172, 172, 172, 1)' }}
              header={header}
            >
              <Experience
                type="workExperience"
                id={el.id}
                key={el.id}
                label1="Jobbtittel"
                label2="Ansetter"
                label3="Fra - til"
                label4="By"
                label5="Beskrivelse"
              ></Experience>
            </ClosableTab>
          )
        })}
        <Button onClick={() => cvState.addWorkExperience('workExperience')}>
          Add experience
        </Button>
      </ClosableTab>

      <ClosableTab
        header={
          <TextField
            value={cvState.formHeaders['education']}
            onChange={(el) => {
              cvState.updateFormHeaders('education', el.target.value)
            }}
          />
        }
      >
        {cvState.education.map((el) => {
          const header = (
            <Box component={'section'}>
              <Typography>{el.tittel + '  på ' + el.institusjon}</Typography>
              <Typography>{el.fra + ' - ' + el.til}</Typography>
            </Box>
          )
          return (
            <ClosableTab
              key={el.id + '-Editor'}
              sx={{ border: '1px solid  rgba(172, 172, 172, 1)' }}
              header={header}
            >
              <Experience
                type="education"
                id={el.id}
                key={el.id}
                label1="Studie"
                label2="Institusjon"
                label3="Fra - til"
                label4="By"
                label5="Beskrivelse"
              ></Experience>
            </ClosableTab>
          )
        })}
        <Button onClick={() => cvState.addWorkExperience('education')}>
          Add education
        </Button>
      </ClosableTab>
      <SkillsEditor />
    </Box>
  )
}
