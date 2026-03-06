import Box from '@mui/material/Box'
import Rating from '@mui/material/Rating'
import { Controller, useFormContext } from 'react-hook-form'

import { HelperText } from './help-text'
import { RHFProps } from '.'

// ----------------------------------------------------------------------

export function RHFRating({ name, helperText, slotProps, ...other }: RHFProps) {
  const { control } = useFormContext()

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Box
          {...slotProps?.wrapper}
          sx={[
            { display: 'flex', flexDirection: 'column' },
            ...(Array.isArray(slotProps?.wrapper?.sx)
              ? slotProps.wrapper.sx
              : [slotProps?.wrapper?.sx]),
          ]}
        >
          <Rating
            {...field}
            onChange={(_event, newValue) => field.onChange(Number(newValue))}
            {...other}
          />

          <HelperText
            {...slotProps?.helperText}
            disableGutters
            errorMessage={error?.message}
            helperText={helperText}
          />
        </Box>
      )}
    />
  )
}
