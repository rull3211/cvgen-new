import styles from '../editor.module.scss'
import LabelWrapper from './LabelWrapper'
import { useCv } from '@/hooks/useCv'
import DebouncedTextField from '@/components/debouncedTextfield/DebouncedTextField'
import AvatarUpload from './avatarUpload/AvatarUpload'

export default function PersoalDetails() {
  const cv = useCv()
  return cv.personalDetails.map((pd) => {
    return (
      <section key={pd.id} className={styles.experience}>
        <section className={styles.row}>
          <LabelWrapper id={pd.id + 'jobbtittel'} label={'Jobb tittel'}>
            <DebouncedTextField
              id={pd.id + 'jobbtittel'}
              onChange={(el) =>
                cv.updatePersonalDetails('jobbtittel', el.target.value, pd.id)
              }
              value={pd.jobbtittel}
              fullWidth
            />
          </LabelWrapper>
          <AvatarUpload
            onChange={(e) => {
              cv.updatePersonalDetails('image', e, pd.id)
            }}
            src={pd.image}
          ></AvatarUpload>
        </section>
        <section className={styles.row}>
          <LabelWrapper id={pd.id + 'fornavn'} label={'Fornavn'}>
            <DebouncedTextField
              id={pd.id + 'fornavn'}
              fullWidth
              onChange={(el) =>
                cv.updatePersonalDetails('fornavn', el.target.value, pd.id)
              }
              value={pd.fornavn}
            />{' '}
          </LabelWrapper>
          <LabelWrapper id={pd.id + 'etternavn'} label={'Etternavn'}>
            {' '}
            <DebouncedTextField
              id={pd.id + 'etternavn'}
              onChange={(el) =>
                cv.updatePersonalDetails('etternavn', el.target.value, pd.id)
              }
              value={pd.etternavn}
              fullWidth
            />{' '}
          </LabelWrapper>{' '}
        </section>
        <section className={styles.row}>
          <LabelWrapper id={pd.id + 'email'} label={'Email'}>
            <DebouncedTextField
              id={pd.id + 'email'}
              fullWidth
              onChange={(el) =>
                cv.updatePersonalDetails('email', el.target.value, pd.id)
              }
              value={pd.email}
            />{' '}
          </LabelWrapper>
          <LabelWrapper id={pd.id + 'telefon'} label={'Telefon'}>
            <DebouncedTextField
              id={pd.id + 'telefon'}
              onChange={(el) =>
                cv.updatePersonalDetails('telefon', el.target.value, pd.id)
              }
              value={pd.telefon}
              fullWidth
            />{' '}
          </LabelWrapper>
        </section>
        <section className={styles.row}>
          <LabelWrapper id={pd.id + 'adresse'} label={'Adresse'}>
            <DebouncedTextField
              id={pd.id + 'adresse'}
              onChange={(el) =>
                cv.updatePersonalDetails('adresse', el.target.value, pd.id)
              }
              value={pd.adresse}
              fullWidth
            />{' '}
          </LabelWrapper>
        </section>
        <section className={styles.row}>
          <LabelWrapper id={pd.id + 'by'} label={'By'}>
            <DebouncedTextField
              id={pd.id + 'by'}
              onChange={(el) =>
                cv.updatePersonalDetails('by', el.target.value, pd.id)
              }
              value={pd.by}
              fullWidth
            />{' '}
          </LabelWrapper>
          <LabelWrapper id={pd.id + 'land'} label={'Land'}>
            <DebouncedTextField
              id={pd.id + 'land'}
              onChange={(el) =>
                cv.updatePersonalDetails('land', el.target.value, pd.id)
              }
              value={pd.land}
              fullWidth
            />{' '}
          </LabelWrapper>
        </section>
      </section>
    )
  })
}
