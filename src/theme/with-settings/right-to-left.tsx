import createCache from '@emotion/cache'
import { CacheProvider } from '@emotion/react'
import rtlPlugin from '@mui/stylis-plugin-rtl'
import { ReactNode, useEffect } from 'react'

// ----------------------------------------------------------------------

interface RtlProps {
  children: ReactNode
  direction: string
}

const cacheRtl = createCache({
  key: 'rtl',
  stylisPlugins: [rtlPlugin],
})

export function Rtl({ children, direction }: RtlProps) {
  useEffect(() => {
    document.dir = direction
  }, [direction])

  if (direction === 'rtl') {
    return <CacheProvider value={cacheRtl}>{children}</CacheProvider>
  }

  return <>{children}</>
}
