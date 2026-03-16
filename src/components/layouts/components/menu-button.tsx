import { SxProps, Theme } from '@mui/material'
import IconButton from '@mui/material/IconButton'

import { Iconify } from '../../../components/iconify'

// ----------------------------------------------------------------------

interface MenuButtonProps {
  sx?: SxProps<Theme>
  [key: string]: any
}

export function MenuButton({ sx, ...other }: MenuButtonProps) {
  return (
    <IconButton sx={sx} {...other}>
      <Iconify icon="custom:menu-duotone" width={24} />
    </IconButton>
  )
}
