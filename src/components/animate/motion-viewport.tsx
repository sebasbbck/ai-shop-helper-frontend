import Box from '@mui/material/Box'
import useMediaQuery from '@mui/material/useMediaQuery'
import { m } from 'framer-motion'

import { varContainer } from './variants'

// ----------------------------------------------------------------------

interface MotionViewportProps {
  children: React.ReactNode
  viewport?: { once?: boolean; amount?: number; [key: string]: any }
  disableAnimate?: boolean
  [key: string]: any
}

export function MotionViewport({
  children,
  viewport,
  disableAnimate = true,
  ...other
}: MotionViewportProps) {
  const smDown = useMediaQuery((theme) => theme.breakpoints.down('sm'))

  const disabled = smDown && disableAnimate

  const baseProps = disabled
    ? {}
    : {
        component: m.div,
        initial: 'initial',
        whileInView: 'animate',
        variants: varContainer(),
        viewport: { once: true, amount: 0.3, ...viewport },
      }

  return (
    <Box {...baseProps} {...other}>
      {children}
    </Box>
  )
}
