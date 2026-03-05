import { useId, useMemo, useCallback, HTMLAttributes } from 'react'

import Chip from '@mui/material/Chip'
import TextField, { TextFieldProps } from '@mui/material/TextField'
import { filledInputClasses } from '@mui/material/FilledInput'
import { outlinedInputClasses } from '@mui/material/OutlinedInput'
import Autocomplete, {
  autocompleteClasses,
  AutocompleteProps,
} from '@mui/material/Autocomplete'
import InputAdornment, {
  inputAdornmentClasses,
} from '@mui/material/InputAdornment'
import { SxProps, Theme } from '@mui/material/styles'

import { countries } from '../../assets/data'
import { FlagIcon } from '../flag-icon'

// ----------------------------------------------------------------------

export type CountryType = {
  code: string
  label: string
  phone: string
}

const getCountry = (inputValue: string | CountryType | null): CountryType => {
  if (!inputValue) return { code: '', label: '', phone: '' }

  const query = typeof inputValue === 'object' ? inputValue.label : inputValue

  return (
    (countries as CountryType[]).find(
      (country) =>
        country.label === query ||
        country.code === query ||
        country.phone === query,
    ) ?? {
      code: '',
      label: '',
      phone: '',
    }
  )
}

interface CountrySelectProps extends Omit<
  AutocompleteProps<string, boolean, false, false>,
  'options' | 'renderInput'
> {
  label?: string
  error?: boolean
  variant?: TextFieldProps['variant']
  helperText?: React.ReactNode
  hiddenLabel?: boolean
  placeholder?: string
  displayValue?: 'label' | 'code'
  slotProps?: any // You can refine this further based on your custom theme
}

// ----------------------------------------------------------------------

export function CountrySelect({
  id,
  label,
  error,
  variant,
  multiple,
  slotProps,
  helperText,
  hiddenLabel,
  placeholder,
  displayValue = 'label',
  ...other
}: CountrySelectProps) {
  const uniqueId = useId()

  const options = useMemo(
    () =>
      (countries as CountryType[]).map((country) =>
        String(displayValue === 'code' ? country.code : country.label),
      ),
    [displayValue],
  )

  const getOptionLabel = useCallback(
    (option: string | CountryType) => {
      const country = getCountry(option)
      return displayValue === 'code' ? country.code : country.label
    },
    [displayValue],
  )

  const renderOption = useCallback(
    (props: HTMLAttributes<HTMLLIElement>, option: string) => {
      const country = getCountry(option)

      return (
        <li {...props} key={country.code || option}>
          <FlagIcon
            code={country.code}
            sx={{
              mr: 1,
              width: 22,
              height: 22,
              borderRadius: '50%',
            }}
          />
          {country.label} ({country.code}) +{country.phone}
        </li>
      )
    },
    [],
  )

  const renderInput = useCallback(
    (params: any) => {
      const country = getCountry(params.inputProps.value as string)
      const hasAdornment = !multiple && !!country.code

      const textFieldStyles: SxProps<Theme> = {
        [`& .${inputAdornmentClasses.root}`]: {
          ml: 0.5,
          mr: 1,
        },
        [`& .${outlinedInputClasses.root}, .${filledInputClasses.root}`]: {
          [`& .${autocompleteClasses.input}`]: {
            pl: 0,
          },
        },
        [`& .${filledInputClasses.root}`]: {
          [`& .${inputAdornmentClasses.root}`]: {
            transform: hiddenLabel ? 'unset' : 'translateY(-8px)',
          },
        },
      }

      const textFieldSlotProps = {
        ...slotProps?.textField?.slotProps,
        htmlInput: {
          ...params.inputProps,
          ...slotProps?.textField?.slotProps?.htmlInput,
          autoComplete: 'new-password',
        },
        input: {
          ...params.InputProps,
          ...slotProps?.textField?.slotProps?.input,
          ...(hasAdornment && {
            startAdornment: (
              <InputAdornment position="start">
                <FlagIcon
                  code={country.code}
                  sx={{ width: 22, height: 22, borderRadius: '50%' }}
                />
              </InputAdornment>
            ),
          }),
        },
      }

      return (
        <TextField
          {...params}
          label={label}
          variant={variant}
          placeholder={placeholder}
          helperText={helperText}
          hiddenLabel={hiddenLabel}
          error={!!error}
          {...slotProps?.textField}
          slotProps={textFieldSlotProps}
          sx={[
            ...(multiple ? [] : [textFieldStyles]),
            ...(Array.isArray(slotProps?.textField?.sx)
              ? slotProps.textField.sx
              : [slotProps?.textField?.sx]),
          ]}
        />
      )
    },
    [
      error,
      helperText,
      hiddenLabel,
      label,
      multiple,
      placeholder,
      slotProps?.textField,
      variant,
    ],
  )

  const renderValue = useCallback(
    (selected: string[], getItemProps: any) =>
      selected.map((option, index) => {
        const country = getCountry(option)

        return (
          <Chip
            {...getItemProps({ index })}
            key={country.label}
            label={country.label}
            size="small"
            variant="soft"
            icon={
              <FlagIcon
                code={country.code}
                sx={[{ width: 16, height: 16, borderRadius: '50%' }]}
              />
            }
            {...slotProps?.chip}
          />
        )
      }),
    [slotProps?.chip],
  )

  return (
    <Autocomplete
      id={id ?? `${uniqueId}-country-select`}
      options={options}
      multiple={multiple}
      autoHighlight={!multiple}
      disableCloseOnSelect={multiple}
      getOptionLabel={getOptionLabel}
      renderOption={renderOption}
      renderInput={renderInput}
      renderValue={multiple ? (renderValue as any) : undefined}
      {...slotProps}
      {...(other as any)}
    />
  )
}
