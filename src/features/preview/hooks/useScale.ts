import { a4HeightInCm, a4WidthInCm } from '@/constants'
import { useEffect, useState } from 'react'

export function useScaleOnResize(modifier = 0.9) {
  const [scale, setScale] = useState(() => {
    const vw = window.innerWidth
    const vh = window.innerHeight
    return Math.min(1, Math.min(vw / a4WidthInCm, vh / a4HeightInCm) * modifier)
  })

  useEffect(() => {
    function handleResize() {
      const vw = window.innerWidth
      const vh = window.innerHeight
      const newScale = Math.min(
        1,
        Math.min(vw / a4WidthInCm, vh / a4HeightInCm) * modifier,
      )
      console.log(newScale)
      setScale(newScale)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [a4WidthInCm, a4HeightInCm])

  return scale
}
