import Box from '@mui/material/Box'
import { mergeClasses } from 'minimal-shared/utils'

import { layoutClasses } from '../core'
import { Breakpoint, SxProps, Theme } from '@mui/material'

// ----------------------------------------------------------------------

interface SimpleCompactContentProps {
  sx?: SxProps<Theme>
  children: React.ReactNode
  className?: string
  layoutQuery?: Breakpoint
  [key: string]: any
}

export function SimpleCompactContent({
  sx,
  children,
  className,
  layoutQuery = 'md',
  ...other
}: SimpleCompactContentProps) {
  return (
    <Box
      className={mergeClasses([layoutClasses.content, className])}
      sx={[
        (theme) => ({
          width: 1,
          mx: 'auto',
          display: 'flex',
          flex: '1 1 auto',
          textAlign: 'center',
          flexDirection: 'column',
          p: theme.spacing(3, 2, 10, 2),
          maxWidth: 'var(--layout-simple-content-compact-width)',
          [theme.breakpoints.up(layoutQuery)]: {
            justifyContent: 'center',
            p: theme.spacing(10, 0, 10, 0),
          },
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      {children}
    </Box>
  )
}
