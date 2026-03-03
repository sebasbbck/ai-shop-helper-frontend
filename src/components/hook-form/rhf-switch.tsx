import Box from "@mui/material/Box"
import FormControl from "@mui/material/FormControl"
import FormControlLabel from "@mui/material/FormControlLabel"
import FormGroup from "@mui/material/FormGroup"
import FormLabel from "@mui/material/FormLabel"
import Switch from "@mui/material/Switch"
import { Controller, useFormContext } from "react-hook-form"

import { HelperText } from "./help-text"
import { RHFProps } from "."

// ----------------------------------------------------------------------

export function RHFSwitch({
  name,
  helperText,
  label,
  slotProps,
  sx,
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
              <Switch
                {...field}
                checked={field.value}
                {...slotProps?.switch}
                slotProps={{
                  ...slotProps?.switch?.slotProps,
                  input: {
                    id: `${name}-switch`,
                    ...(!label && { "aria-label": `${name} switch` }),
                    ...slotProps?.switch?.slotProps?.input,
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

export function RHFMultiSwitch({
  name,
  label,
  options,
  helperText,
  slotProps,
  ...other
}: RHFProps) {
  const { control } = useFormContext()

  const getSelected = (selectedItems: any[], item: any) =>
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
                  <Switch
                    checked={field.value.includes(option.value)}
                    onChange={() =>
                      field.onChange(getSelected(field.value, option.value))
                    }
                    {...slotProps?.switch}
                    slotProps={{
                      ...slotProps?.switch?.slotProps,
                      input: {
                        id: `${option.label}-switch`,
                        ...(!option.label && {
                          "aria-label": `${option.label} switch`,
                        }),
                        ...slotProps?.switch?.slotProps?.input,
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
