import { useCv } from '@/hooks/useCv'
import { useShallow } from 'zustand/shallow'
import PersonalDetailEditorItem from './PersonalDetailEditorItem'

export default function PersoalDetailsEditor() {
  const personalDetailIds = useCv(
    useShallow((state) => {
      return state.personalDetails.map((pd) => pd.id)
    }),
  )
  return personalDetailIds.map((pd) => {
    return <PersonalDetailEditorItem id={pd} />
  })
}
