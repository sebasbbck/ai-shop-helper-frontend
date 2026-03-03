import Box from "@mui/material/Box"
import Checkbox from "@mui/material/Checkbox"
import FormControl from "@mui/material/FormControl"
import FormControlLabel from "@mui/material/FormControlLabel"
import FormGroup from "@mui/material/FormGroup"
import FormLabel from "@mui/material/FormLabel"
import { Controller, useFormContext } from "react-hook-form"

import { HelperText } from "./help-text"
import { RHFProps } from "."

// ----------------------------------------------------------------------

export function RHFCheckbox({
  sx,
  name,
  label,
  slotProps,
  helperText,
  ...other
}: RHFProps) {
  const { control } = useFormContext()

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Box {...slotProps?.wrapper}>
          <FormControlLabel
            label={label}
            control={
              <Checkbox
                {...field}
                checked={field.value}
                {...slotProps?.checkbox}
                slotProps={{
                  ...slotProps?.checkbox?.slotProps,
                  input: {
                    id: `${name}-checkbox`,
                    ...(!label && { "aria-label": `${name} checkbox` }),
                    ...slotProps?.checkbox?.slotProps?.input,
                  },
                }}
              />
            }
            sx={[{ mx: 0 }, ...(Array.isArray(sx) ? sx : [sx])]}
            {...other}
          />

          <HelperText
            {...slotProps?.helperText}
            errorMessage={error?.message}
            helperText={helperText}
          />
        </Box>
      )}
    />
  )
}

// ----------------------------------------------------------------------

export function RHFMultiCheckbox({
  name,
  label,
  options,
  slotProps,
  helperText,
  ...other
}: RHFProps) {
  const { control } = useFormContext()

  const getSelected = (selectedItems: any[], item: string) =>
    selectedItems.includes(item)
      ? selectedItems.filter((value) => value !== item)
      : [...selectedItems, item]

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <FormControl component="fieldset" {...slotProps?.wrapper}>
          {label && (
            <FormLabel
              component="legend"
              {...slotProps?.formLabel}
              sx={[
                { mb: 1, typography: "body2" },
                ...(Array.isArray(slotProps?.formLabel?.sx)
                  ? slotProps.formLabel.sx
                  : [slotProps?.formLabel?.sx]),
              ]}
            >
              {label}
            </FormLabel>
          )}

          <FormGroup {...other}>
            {options.map((option) => (
              <FormControlLabel
                key={option.value}
                control={
                  <Checkbox
                    checked={field.value.includes(option.value)}
                    onChange={() =>
                      field.onChange(getSelected(field.value, option.value))
                    }
                    {...slotProps?.checkbox}
                    slotProps={{
                      ...slotProps?.checkbox?.slotProps,
                      input: {
                        id: `${option.label}-checkbox`,
                        ...(!option.label && {
                          "aria-label": `${option.label} checkbox`,
                        }),
                        ...slotProps?.checkbox?.slotProps?.input,
                      },
                    }}
                  />
                }
                label={option.label}
              />
            ))}
          </FormGroup>

          <HelperText
            {...slotProps?.helperText}
            disableGutters
            errorMessage={error?.message}
            helperText={helperText}
          />
        </FormControl>
      )}
    />
  )
}
