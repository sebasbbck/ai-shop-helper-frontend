import { Controller, useFormContext } from 'react-hook-form'

import { PhoneInput } from '../phone-input'

// ----------------------------------------------------------------------

interface RHFPhoneInputProps {
  name: string
  helperText: string
  [key: string]: any
}

export function RHFPhoneInput({
  name,
  helperText,
  ...other
}: RHFPhoneInputProps) {
  const { control } = useFormContext()

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <PhoneInput
          {...field}
          fullWidth
          error={!!error}
          helperText={error?.message ?? helperText}
          {...other}
        />
      )}
    />
  )
}
