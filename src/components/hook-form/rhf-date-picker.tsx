import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker"
import { TimePicker } from "@mui/x-date-pickers/TimePicker"
import dayjs from "dayjs"
import { Controller, useFormContext } from "react-hook-form"
import { RHFProps } from "."

// ----------------------------------------------------------------------

function normalizeDateValue(value: any) {
  if (dayjs.isDayjs(value)) return value

  const parsed = value ? dayjs(value) : null
  return parsed?.isValid() ? parsed : null
}

// ----------------------------------------------------------------------

export function RHFDatePicker({ name, slotProps, ...other }: RHFProps) {
  const { control } = useFormContext()

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <DatePicker
          {...field}
          value={normalizeDateValue(field.value)}
          onChange={(newValue) => {
            if (!newValue) {
              field.onChange(null)
              return
            }

            const parsedValue = dayjs(newValue)
            field.onChange(
              parsedValue.isValid() ? parsedValue.format() : newValue,
            )
          }}
          slotProps={{
            ...slotProps,
            textField: {
              ...slotProps?.textField,
              error: !!error,
              helperText: error?.message ?? slotProps?.textField?.helperText,
            },
          }}
          {...other}
        />
      )}
    />
  )
}

// ----------------------------------------------------------------------

export function RHFTimePicker({ name, slotProps, ...other }: RHFProps) {
  const { control } = useFormContext()

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TimePicker
          {...field}
          value={normalizeDateValue(field.value)}
          onChange={(newValue) => {
            if (!newValue) {
              field.onChange(null)
              return
            }

            const parsedValue = dayjs(newValue)
            field.onChange(
              parsedValue.isValid() ? parsedValue.format() : newValue,
            )
          }}
          slotProps={{
            ...slotProps,
            textField: {
              ...slotProps?.textField,
              error: !!error,
              helperText: error?.message ?? slotProps?.textField?.helperText,
            },
          }}
          {...other}
        />
      )}
    />
  )
}

// ----------------------------------------------------------------------

export function RHFDateTimePicker({ name, slotProps, ...other }: RHFProps) {
  const { control } = useFormContext()

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <DateTimePicker
          {...field}
          value={normalizeDateValue(field.value)}
          onChange={(newValue) => {
            if (!newValue) {
              field.onChange(null)
              return
            }

            const parsedValue = dayjs(newValue)
            field.onChange(
              parsedValue.isValid() ? parsedValue.format() : newValue,
            )
          }}
          slotProps={{
            ...slotProps,
            textField: {
              ...slotProps?.textField,
              error: !!error,
              helperText: error?.message ?? slotProps?.textField?.helperText,
            },
          }}
          {...other}
        />
      )}
    />
  )
}
