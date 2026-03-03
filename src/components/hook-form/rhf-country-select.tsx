import { Controller, useFormContext } from 'react-hook-form';
import { CountrySelect } from '../country-select';

interface RHFCountrySelectProps {
  name: string;
  helperText?: React.ReactNode;
  [key: string]: any;
}

export function RHFCountrySelect({ name, helperText, ...other }: RHFCountrySelectProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <CountrySelect
          {...field}
          id={`${name}-rhf-country-select`}
          // Ensure value is always at least an empty string to avoid "uncontrolled to controlled" warnings
          value={field.value ?? ''} 
          onChange={(_event, newValue) => {
            // newValue will be the string (label or code) based on your CountrySelect options
            field.onChange(newValue ?? '');
          }}
          // Handle blur to ensure validation triggers correctly
          onBlur={field.onBlur}
          error={!!error}
          helperText={error?.message ?? helperText}
          {...other}
        />
      )}
    />
  );
}
