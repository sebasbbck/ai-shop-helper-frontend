import { usePopover } from 'minimal-shared/hooks'

import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import MenuList from '@mui/material/MenuList'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'

import { Label } from '../../../components/label'
import { Iconify } from '../../../components/iconify'
import { CustomPopover } from '../../../components/custom-popover'
import { SxProps, Theme } from '@mui/material'

// ----------------------------------------------------------------------

interface PaymentCardItemProps {
  card: {
    id: string | number
    cardType: string
    cardNumber: string
    // cardHolder: string
    // expiryDate: string
    primary: boolean
  }
  sx?: SxProps<Theme>
  [key: string]: any
}

export function PaymentCardItem({ card, sx, ...other }: PaymentCardItemProps) {
  const menuActions = usePopover()

  const renderMenuActions = () => (
    <CustomPopover
      open={menuActions.open}
      anchorEl={menuActions.anchorEl}
      onClose={menuActions.onClose}
    >
      <MenuList>
        <MenuItem onClick={menuActions.onClose}>
          <Iconify icon="eva:star-fill" />
          Set as primary
        </MenuItem>

        <MenuItem onClick={menuActions.onClose}>
          <Iconify icon="solar:pen-bold" />
          Edit
        </MenuItem>

        <MenuItem onClick={menuActions.onClose} sx={{ color: 'error.main' }}>
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem>
      </MenuList>
    </CustomPopover>
  )

  return (
    <>
      <Paper
        variant="outlined"
        sx={[
          { p: 2.5, width: 1, position: 'relative' },
          ...(Array.isArray(sx) ? sx : [sx]),
        ]}
        {...other}
      >
        <Box
          sx={{
            mb: 1,
            gap: 1,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {card.cardType === 'visa' && (
            <Iconify icon="payments:visa" width={40} height="auto" />
          )}
          {card.cardType === 'mastercard' && (
            <Iconify icon="payments:mastercard" width={40} height="auto" />
          )}
          {card.primary && <Label color="info">Default</Label>}
        </Box>

        <Typography variant="subtitle2">{card.cardNumber}</Typography>

        <IconButton
          onClick={menuActions.onOpen}
          sx={{ top: 8, right: 8, position: 'absolute' }}
        >
          <Iconify icon="eva:more-vertical-fill" />
        </IconButton>
      </Paper>

      {renderMenuActions()}
    </>
  )
}
