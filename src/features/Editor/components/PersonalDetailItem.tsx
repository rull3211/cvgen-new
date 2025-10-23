import DebouncedTextField from '@/components/debouncedTextfield/DebouncedTextField'
import LabelWrapper from './LabelWrapper'
import styles from '../editor.module.scss'
import { useCv } from '@/hooks/useCv'
import { useShallow } from 'zustand/shallow'
import AvatarUpload from '../avatarUpload/AvatarUpload'
export default function PersonalDetailsItem({ id }: { id: string }) {
  const personalDetail = useCv(
    useShallow((state) => {
      return state.personalDetails.find((el) => el.id === id)
    }),
  )
  const updatePersonalDetails = useCv(
    useShallow((state) => {
      return state.updatePersonalDetails
    }),
  )
  if (!personalDetail) return
  return (
    <section key={id} className={styles.experience}>
      <section className={styles.row}>
        <LabelWrapper id={id + 'jobbtittel'} label={'Jobb tittel'}>
          <DebouncedTextField
            id={id + 'jobbtittel'}
            onChange={(el) =>
              updatePersonalDetails('jobbtittel', el.target.value, id)
            }
            value={personalDetail.jobbtittel}
            fullWidth
          />
        </LabelWrapper>
        <AvatarUpload
          onChange={(e) => {
            updatePersonalDetails('image', e, id)
          }}
          src={personalDetail.image}
        ></AvatarUpload>
      </section>
      <section className={styles.row}>
        <LabelWrapper id={id + 'fornavn'} label={'Fornavn'}>
          <DebouncedTextField
            id={id + 'fornavn'}
            fullWidth
            onChange={(el) =>
              updatePersonalDetails('fornavn', el.target.value, id)
            }
            value={personalDetail.fornavn}
          />{' '}
        </LabelWrapper>
        <LabelWrapper id={id + 'etternavn'} label={'Etternavn'}>
          {' '}
          <DebouncedTextField
            id={id + 'etternavn'}
            onChange={(el) =>
              updatePersonalDetails('etternavn', el.target.value, id)
            }
            value={personalDetail.etternavn}
            fullWidth
          />{' '}
        </LabelWrapper>{' '}
      </section>
      <section className={styles.row}>
        <LabelWrapper id={id + 'email'} label={'Email'}>
          <DebouncedTextField
            id={id + 'email'}
            fullWidth
            onChange={(el) =>
              updatePersonalDetails('email', el.target.value, id)
            }
            value={personalDetail.email}
          />{' '}
        </LabelWrapper>
        <LabelWrapper id={id + 'telefon'} label={'Telefon'}>
          <DebouncedTextField
            id={id + 'telefon'}
            onChange={(el) =>
              updatePersonalDetails('telefon', el.target.value, id)
            }
            value={personalDetail.telefon}
            fullWidth
          />{' '}
        </LabelWrapper>
      </section>
      <section className={styles.row}>
        <LabelWrapper id={id + 'adresse'} label={'Adresse'}>
          <DebouncedTextField
            id={id + 'adresse'}
            onChange={(el) =>
              updatePersonalDetails('adresse', el.target.value, id)
            }
            value={personalDetail.adresse}
            fullWidth
          />{' '}
        </LabelWrapper>
      </section>
      <section className={styles.row}>
        <LabelWrapper id={id + 'by'} label={'By'}>
          <DebouncedTextField
            id={id + 'by'}
            onChange={(el) => updatePersonalDetails('by', el.target.value, id)}
            value={personalDetail.by}
            fullWidth
          />{' '}
        </LabelWrapper>
        <LabelWrapper id={id + 'land'} label={'Land'}>
          <DebouncedTextField
            id={id + 'land'}
            onChange={(el) =>
              updatePersonalDetails('land', el.target.value, id)
            }
            value={personalDetail.land}
            fullWidth
          />{' '}
        </LabelWrapper>
      </section>
    </section>
  )
}
