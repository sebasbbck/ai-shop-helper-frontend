import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { isValidPhoneNumber } from 'react-phone-number-input/input'

import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'

import { Form, Field, schemaUtils } from '../../../components/hook-form'
import { SxProps, Theme } from '@mui/material/styles'

// ----------------------------------------------------------------------

export const AddressCreateSchema = z.object({
  city: z.string().min(1, { error: 'City is required!' }),
  state: z.string().min(1, { error: 'State is required!' }),
  name: z.string().min(1, { error: 'Name is required!' }),
  address: z.string().min(1, { error: 'Address is required!' }),
  zipCode: z.string().min(1, { error: 'Zip code is required!' }),
  phoneNumber: schemaUtils.phoneNumber({ isValid: isValidPhoneNumber }),
  country: schemaUtils.nullableInput(
    z.string().min(1, { error: 'Country is required!' }),
    {
      error: 'Country is required!',
    },
  ),
  // Not required
  primary: z.boolean(),
  addressType: z.string(),
})

interface AddressCreateFormProps {
  open: boolean
  onClose: () => any
  onCreate: (arg0?: any) => any
  slotProps?: any
  sx?: SxProps<Theme>
  [key: string]: any
}

// ----------------------------------------------------------------------

export function AddressCreateForm({
  open,
  onClose,
  onCreate,
  slotProps,
  sx,
  ...other
}: AddressCreateFormProps) {
  const defaultValues = {
    name: '',
    city: '',
    state: '',
    address: '',
    zipCode: '',
    country: '',
    primary: true,
    phoneNumber: '',
    addressType: 'Home',
  }

  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(AddressCreateSchema),
    defaultValues,
  })

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods

  const onSubmit = handleSubmit(async (data) => {
    try {
      onCreate({
        name: data.name,
        phoneNumber: data.phoneNumber,
        fullAddress: `${data.address}, ${data.city}, ${data.state}, ${data.country}, ${data.zipCode}`,
        addressType: data.addressType,
        primary: data.primary,
      })
      onClose()
    } catch (error) {
      console.error(error)
    }
  })

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={open}
      onClose={onClose}
      slotProps={slotProps}
      sx={sx}
      {...other}
    >
      <Form methods={methods} onSubmit={onSubmit}>
        <DialogTitle>Add address</DialogTitle>

        <DialogContent dividers>
          <Stack spacing={3}>
            <Field.RadioGroup
              row
              name="addressType"
              options={[
                { label: 'Home', value: 'Home' },
                { label: 'Office', value: 'Office' },
              ]}
            />

            <Box
              sx={{
                rowGap: 3,
                columnGap: 2,
                display: 'grid',
                gridTemplateColumns: {
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(2, 1fr)',
                },
              }}
            >
              <Field.Text name="name" label="Full name" />
              <Field.PhoneInput
                name="phoneNumber"
                label="Phone number"
                helperText="Phone number"
                defaultCountry="US"
              />
            </Box>

            <Field.Text name="address" label="Address" />

            <Box
              sx={{
                rowGap: 3,
                columnGap: 2,
                display: 'grid',
                gridTemplateColumns: {
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(3, 1fr)',
                },
              }}
            >
              <Field.Text name="city" label="Town/city" />
              <Field.Text name="state" label="State" />
              <Field.Text name="zipCode" label="Zip/code" />
            </Box>

            <Field.CountrySelect
              name="country"
              label="Country"
              placeholder="Choose a country"
            />
            <Field.Checkbox
              name="primary"
              label="Use this address as default."
            />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button
            color="inherit"
            variant="outlined"
            onClick={onClose}
            {...slotProps?.cancelButton}
          >
            {slotProps?.cancelButton?.label ?? 'Cancel'}
          </Button>
          <Button
            type="submit"
            variant="contained"
            loading={isSubmitting}
            {...slotProps?.submitButton}
          >
            {slotProps?.submitButton?.label ?? 'Add'}
          </Button>
        </DialogActions>
      </Form>
    </Dialog>
  )
}
