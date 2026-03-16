import { domMax, LazyMotion } from 'framer-motion'

// ----------------------------------------------------------------------

export function MotionLazy({ children }: { children: React.ReactNode }) {
  return <LazyMotion features={domMax}>{children}</LazyMotion>
}
