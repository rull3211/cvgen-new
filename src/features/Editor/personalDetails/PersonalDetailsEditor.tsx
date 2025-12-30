import { useCv } from '@/hooks/useCv'
import { useShallow } from 'zustand/shallow'
import PersonalDetailEditorItem from './PersonalDetailEditorItem'
import { useMemo } from 'react'

export default function PersoalDetailsEditor() {
  const personalDetails = useCv(
    useShallow((state) => state.personalDetails),
  )
  
  const personalDetailIds = useMemo(
    () => personalDetails.map((pd) => pd.id),
    [personalDetails],
  )
  
  return personalDetailIds.map((pd) => {
    return <PersonalDetailEditorItem key={pd} id={pd} />
  })
}
