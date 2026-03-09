import Box from '@mui/material/Box'
import { m } from 'framer-motion'

import { varContainer } from './variants'
import { SxProps, Theme } from '@mui/material'

// ----------------------------------------------------------------------

interface MotionContainerProps {
  sx?: SxProps<Theme>
  animate?: boolean
  action?: boolean
  children: React.ReactNode
  [key: string]: any
}

export function MotionContainer({
  sx,
  animate,
  children,
  action = false,
  ...other
}: MotionContainerProps) {
  return (
    <Box
      component={m.div}
      variants={varContainer()}
      initial={action ? false : 'initial'}
      animate={action ? (animate ? 'animate' : 'exit') : 'animate'}
      exit={action ? undefined : 'exit'}
      sx={sx}
      {...other}
    >
      {children}
    </Box>
  )
}
