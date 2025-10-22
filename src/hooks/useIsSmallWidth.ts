import { useEffect, useState } from 'react'

export default function useIsSmallWidth(threshold = 768) {
  const [isSmall, setIsSmall] = useState(() => window.innerWidth < threshold)

  useEffect(() => {
    const handleResize = () => {
      setIsSmall(window.innerWidth < threshold)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [threshold])

  return isSmall
}
