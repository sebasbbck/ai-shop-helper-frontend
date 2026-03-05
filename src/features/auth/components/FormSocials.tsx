import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'

import { Iconify } from '../../../components/iconify'
import { SxProps, Theme } from '@mui/material'

// ----------------------------------------------------------------------

interface FormSocialsProps {
  sx?: SxProps<Theme>
  signInWithGoogle?: () => any
  signInWithFacebook?: () => any
  signInWithTwitter?: () => any
  [key: string]: any
}

export function FormSocials({
  sx,
  signInWithGoogle,
  signInWithFacebook,
  signInWithTwitter,
  ...other
}: FormSocialsProps) {
  return (
    <Box
      sx={[
        {
          gap: 1.5,
          display: 'flex',
          justifyContent: 'center',
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <IconButton color="inherit" onClick={signInWithGoogle}>
        <Iconify width={24} icon="socials:google" />
      </IconButton>
      <IconButton color="inherit" onClick={signInWithFacebook}>
        <Iconify width={24} icon="socials:facebook" />
      </IconButton>
    </Box>
  )
}
