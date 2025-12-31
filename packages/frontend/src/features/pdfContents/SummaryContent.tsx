import { Typography } from '@mui/material'
import styles from '../preview/PreviewStyles.module.scss'

export default function SummaryContent({
  text,
  header,
}: {
  text: string
  header?: string
}) {
  return (
    <section className={styles.summary}>
      {text && (
        <Typography
          sx={{ fontSize: '1.5rem', fontWeight: 700 }}
          className={styles.rightTitle}
          variant="h2"
        >
          {header || 'Oppsummering'}
        </Typography>
      )}
      <Typography sx={{ fontSize: '0.9rem', whiteSpace: 'pre-wrap' }}>
        {text}
      </Typography>
    </section>
  )
}
