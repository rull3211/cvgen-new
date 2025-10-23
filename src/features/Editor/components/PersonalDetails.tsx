import { useCv } from '@/hooks/useCv'
import { useShallow } from 'zustand/shallow'
import PersonalDetailsItem from './PersonalDetailItem'

export default function PersoalDetails() {
  const personalDetailIds = useCv(
    useShallow((state) => {
      return state.personalDetails.map((pd) => pd.id)
    }),
  )
  return personalDetailIds.map((pd) => {
    return <PersonalDetailsItem id={pd} />
  })
}
