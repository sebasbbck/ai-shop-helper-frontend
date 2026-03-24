import { useState, useCallback } from 'react'

import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import TextField from '@mui/material/TextField'
import ButtonBase from '@mui/material/ButtonBase'
import Typography from '@mui/material/Typography'
import InputAdornment from '@mui/material/InputAdornment'

import { Label } from '../../../components/label'
import { Iconify } from '../../../components/iconify'
import { Scrollbar } from '../../../components/scrollbar'
import { SearchNotFound } from '../../../components/search-not-found'
import { SxProps, Theme } from '@mui/material/styles'

// ----------------------------------------------------------------------

interface AddressProps {
  id: string | number
  primary: boolean
  name: string
  phoneNumber: string
  fullAddress: string
  company?: string
  email?: string
  addressType: string
}

interface AddressListDialogProps {
  sx?: SxProps<Theme>
  open: boolean
  list: AddressProps[]
  onClose: () => any
  selected: (arg0?: any) => any
  onSelect: (arg0?: any) => any
  title?: string
  [key: string]: any
}

export function AddressListDialog({
  sx,
  open,
  list,
  action,
  onClose,
  selected,
  onSelect,
  title = 'Address book',
  ...other
}: AddressListDialogProps) {
  const [searchAddress, setSearchAddress] = useState('')

  const dataFiltered = applyFilter({ inputData: list, query: searchAddress })

  const notFound = !dataFiltered.length && !!searchAddress

  const handleSearchAddress = useCallback((event: any) => {
    setSearchAddress(event.target.value)
  }, [])

  const handleSelectAddress = useCallback(
    (address: AddressProps) => {
      onSelect(address)
      setSearchAddress('')
      onClose()
    },
    [onClose, onSelect],
  )

  const renderList = () => (
    <Scrollbar sx={{ p: 0.5, maxHeight: 480 }}>
      <Box sx={{ gap: 0.5, display: 'flex', flexDirection: 'column' }}>
        {dataFiltered.map((address: AddressProps) => (
          <ButtonBase
            key={address.id}
            onClick={() => handleSelectAddress(address)}
            sx={{
              py: 1,
              px: 1.5,
              gap: 0.5,
              width: 1,
              borderRadius: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              ...(selected(`${address.id}`) && { bgcolor: 'action.selected' }),
            }}
          >
            <Box sx={{ gap: 1, display: 'flex', alignItems: 'center' }}>
              <Typography variant="subtitle2">{address.name}</Typography>
              {address.primary && <Label color="info">Default</Label>}
            </Box>

            {address.company && (
              <Box sx={{ color: 'primary.main', typography: 'caption' }}>
                {address.company}
              </Box>
            )}

            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {address.fullAddress}
            </Typography>

            {address.phoneNumber && (
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {address.phoneNumber}
              </Typography>
            )}
          </ButtonBase>
        ))}
      </Box>
    </Scrollbar>
  )

  return (
    <Dialog
      fullWidth
      maxWidth="xs"
      open={open}
      onClose={onClose}
      sx={sx}
      {...other}
    >
      <Box
        sx={{
          py: 3,
          pl: 3,
          pr: 1.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="h6"> {title} </Typography>
        {action && action}
      </Box>

      <Box sx={{ px: 2, pb: 2 }}>
        <TextField
          fullWidth
          value={searchAddress}
          onChange={handleSearchAddress}
          placeholder="Search..."
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify
                    icon="eva:search-fill"
                    sx={{ color: 'text.disabled' }}
                  />
                </InputAdornment>
              ),
            },
          }}
        />
      </Box>

      {notFound ? (
        <SearchNotFound query={searchAddress} sx={{ px: 3, pt: 5, pb: 10 }} />
      ) : (
        renderList()
      )}
    </Dialog>
  )
}

// ----------------------------------------------------------------------

function applyFilter({
  inputData,
  query,
}: {
  inputData: AddressProps[]
  query: string
}) {
  if (!query) {
    return inputData
  }

  return inputData.filter(
    ({ name, company, fullAddress, phoneNumber }: AddressProps) =>
      [name, company, fullAddress, phoneNumber].some((field) =>
        field?.toLowerCase().includes(query.toLowerCase()),
      ),
  )
}
