import { Controller, useFormContext } from 'react-hook-form';

import Box from '@mui/material/Box';

import { HelperText } from './help-text';
import { Upload, UploadBox, UploadAvatar } from '../upload';
import { RHFProps } from '.';
import { SxProps, Theme } from '@mui/material/styles';

// ----------------------------------------------------------------------

export function RHFUploadAvatar({ name, slotProps, ...other }: RHFProps) {
  const { control, setValue } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const onDrop = (acceptedFiles: File[]) => {
          const value = acceptedFiles[0];

          setValue(name, value, { shouldValidate: true });
        };

        return (
          <Box {...slotProps?.wrapper}>
            <UploadAvatar value={field.value} error={!!error} onDrop={onDrop} {...other} />
            <HelperText errorMessage={error?.message} sx={{ justifyContent: 'center' }} />
          </Box>
        );
      }}
    />
  );
}

// ----------------------------------------------------------------------

export function RHFUploadBox({ name, ...other }: RHFProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <UploadBox value={field.value} error={!!error} {...other} />
      )}
    />
  );
}

// ----------------------------------------------------------------------

interface UploadSlotProps {
  wrapper?: React.HTMLAttributes<HTMLDivElement> & { sx?: SxProps<Theme> };
  multiPreview?: object;
  rejectedFiles?: object;
}

interface RHFUploadProps extends Omit<RHFProps, 'slotProps'> {
  slotProps?: UploadSlotProps;
  multiple?: boolean;
  helperText?: React.ReactNode;
}

export function RHFUpload({ name, multiple, helperText, ...other }: RHFUploadProps) {
  const { control, setValue } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const uploadProps = {
          multiple,
          accept: { 'image/*': [] },
          error: !!error,
          helperText: error?.message ?? helperText,
        };

        const onDrop = (acceptedFiles: File[]) => {
          const value = multiple ? [...field.value, ...acceptedFiles] : acceptedFiles[0];

          setValue(name, value, { shouldValidate: true });
        };

        return <Upload {...uploadProps} value={field.value} onDrop={onDrop} {...other} />;
      }}
    />
  );
}
