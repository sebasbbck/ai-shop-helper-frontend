import { useScroll } from 'framer-motion'
import { useMemo, useRef } from 'react'

// ----------------------------------------------------------------------

export function useScrollProgress(target = 'document') {
  const elementRef = useRef(null)

  const options = { container: elementRef }

  const { scrollYProgress, scrollXProgress } = useScroll(
    target === 'container' ? options : undefined,
  )

  const memoizedValue = useMemo(
    () => ({ elementRef, scrollXProgress, scrollYProgress }),
    [scrollXProgress, scrollYProgress],
  )

  return memoizedValue
}
