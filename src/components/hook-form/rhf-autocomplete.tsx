import Autocomplete from "@mui/material/Autocomplete"

import TextField from "@mui/material/TextField"
import { Controller, useFormContext } from "react-hook-form"
import { RHFProps } from "."

// ----------------------------------------------------------------------

export function RHFAutocomplete({
  name,
  label,
  slotProps,
  helperText,
  placeholder,
  ...other
}: RHFProps) {
  const { control, setValue } = useFormContext()

  const { textField, ...otherSlotProps } = slotProps ?? {}

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Autocomplete
          {...field}
          id={`${name}-rhf-autocomplete`}
          onChange={(_event, newValue) => setValue(name, newValue, { shouldValidate: true })}
          options={undefined}
          renderInput={(params) => (
            <TextField
              {...params}
              {...textField}
              label={label}
              placeholder={placeholder}
              error={!!error}
              helperText={error?.message ?? helperText}
              slotProps={{
                ...textField?.slotProps,
                htmlInput: {
                  ...params.inputProps,
                  ...textField?.slotProps?.htmlInput,
                  autoComplete: "new-password", // Disable autocomplete and autofill
                },
              }} />
          )}
          slotProps={{
            ...otherSlotProps,
            chip: {
              size: "small",
              variant: "soft",
              ...otherSlotProps?.chip,
            },
          }}
          {...other}        />
        )}
      />
  )
}
