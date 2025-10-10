import { Typography } from '@mui/material'
import style from '../preview/PreviewStyles.module.scss'
import type { PersonalDetails } from '@/hooks/useCv'
import AvatarImage from '../Editor/components/avatarUpload/conponents/AvatarImage'

interface Props {
  element: PersonalDetails
}

export default function PersonalDetailsContent({ element }: Props) {
  const { adresse, by, land, telefon, email, image } = element
  const hasDetails = adresse || by || land || telefon || email
  const renderSpan =
    (!!element.fornavn || !!element.etternavn) &&
    (hasDetails || !!element.jobbtittel)
  return (
    <section>
      <div className=" pb-4 relative flex flex-col items-center">
        <AvatarImage src={image} renderNoImage={false} />
      </div>

      <section className={style.tittel}>
        <Typography variant="h2">
          {element.fornavn} {element.etternavn}
        </Typography>
        {renderSpan && <span />}
        <Typography>{element.jobbtittel}</Typography>
      </section>
      <section className={style.details}>
        {hasDetails && <Typography variant="h2">Detaljer</Typography>}
        <Typography>{adresse}</Typography>
        <Typography>{by}</Typography>
        <Typography>{land}</Typography>
        <Typography>{telefon}</Typography>
        <Typography>{email}</Typography>
      </section>
    </section>
  )
}
