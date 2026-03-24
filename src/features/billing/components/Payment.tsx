import { useBoolean } from 'minimal-shared/hooks'

import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import CardHeader from '@mui/material/CardHeader'
import DialogTitle from '@mui/material/DialogTitle'
import DialogActions from '@mui/material/DialogActions'

import { Iconify } from '../../../components/iconify'

import { PaymentCardItem } from './PaymentCardItem'
import { PaymentCardCreateForm } from './PaymentCardCreateForm'
import { SxProps, Theme } from '@mui/material'

// ----------------------------------------------------------------------

interface PaymentProps {
  cards: Array<{
    id: string | number
    cardType: string
    cardNumber: string
    // cardHolder: string
    // expiryDate: string
    primary: boolean
  }>
  sx?: SxProps<Theme>
  [key: string]: any
}

export function Payment({ cards, sx, ...other }: PaymentProps) {
  const openForm = useBoolean()

  const renderCardCreateFormDialog = () => (
    <Dialog
      fullWidth
      maxWidth="xs"
      open={openForm.value}
      onClose={openForm.onFalse}
    >
      <DialogTitle>Add card</DialogTitle>

      <PaymentCardCreateForm sx={{ px: 3 }} />

      <DialogActions>
        <Button color="inherit" variant="outlined" onClick={openForm.onFalse}>
          Cancel
        </Button>
        <Button color="inherit" variant="contained" onClick={openForm.onFalse}>
          Add
        </Button>
      </DialogActions>
    </Dialog>
  )

  return (
    <>
      <Card sx={[{ my: 3 }, ...(Array.isArray(sx) ? sx : [sx])]} {...other}>
        <CardHeader
          title="Payment method"
          action={
            <Button
              size="small"
              color="primary"
              startIcon={<Iconify icon="mingcute:add-line" />}
              onClick={openForm.onTrue}
            >
              Add card
            </Button>
          }
        />

        <Box
          sx={{
            p: 3,
            rowGap: 2.5,
            columnGap: 2,
            display: 'grid',
            gridTemplateColumns: { xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' },
          }}
        >
          {cards.map((card) => (
            <PaymentCardItem key={card.id} card={card} />
          ))}
        </Box>
      </Card>

      {renderCardCreateFormDialog()}
    </>
  )
}
