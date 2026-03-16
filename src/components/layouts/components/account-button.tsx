import Avatar from '@mui/material/Avatar'
import IconButton from '@mui/material/IconButton'
import { m } from 'framer-motion'

import {
  AnimateBorder,
  transitionTap,
  varHover,
  varTap,
} from '../../../components/animate'
import { SxProps, Theme } from '@mui/material'

// ----------------------------------------------------------------------

interface AccountButtonProps {
  photoURL?: string | undefined
  displayName?: string | undefined
  sx?: SxProps<Theme>
  [key: string]: any
}

export function AccountButton({
  photoURL,
  displayName,
  sx,
  ...other
}: AccountButtonProps) {
  return (
    <IconButton
      component={m.button}
      whileTap={varTap(0.96)}
      whileHover={varHover(1.04)}
      transition={transitionTap()}
      aria-label="Account button"
      sx={[{ p: 0 }, ...(Array.isArray(sx) ? sx : [sx])]}
      {...other}
    >
      <AnimateBorder
        sx={{
          p: '3px',
          borderRadius: '50%',
          width: 40,
          height: 40,
          color: 'primary.main',
        }}
        slotProps={{
          primaryBorder: {
            size: 60,
            width: '1px',
            sx: { color: 'primary.main' },
          },
          secondaryBorder: { sx: { color: 'warning.main' } },
        }}
      >
        <Avatar src={photoURL} alt={displayName} sx={{ width: 1, height: 1 }}>
          {displayName?.charAt(0).toUpperCase()}
        </Avatar>
      </AnimateBorder>
    </IconButton>
  )
}
