"use client";

import { Controller } from "react-hook-form";
import type { Control, FieldValues, Path } from "react-hook-form";
import { useTranslations } from "next-intl";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import { InputType } from "@/api/model/inputType";
import type { AgentInputSchema } from "@/api/model/agentInputSchema";

interface Props<T extends FieldValues> {
  input: AgentInputSchema;
  control: Control<T>;
  name: Path<T>;
  disabled?: boolean;
  dynamicOptions?: string[];
}

export default function SchemaInputField<T extends FieldValues>({
  input,
  control,
  name,
  disabled,
  dynamicOptions,
}: Props<T>) {
  const t = useTranslations();
  const tVal = useTranslations("Validation");

  const label = (() => {
    try {
      return t(input.label_i18n_key as Parameters<typeof t>[0]);
    } catch {
      return input.label_i18n_key;
    }
  })();

  if (input.input_type === InputType.select) {
    const options: string[] =
      dynamicOptions ??
      (Array.isArray(input.options)
        ? input.options.filter((o): o is string => typeof o === "string")
        : []);

    return (
      <Controller
        name={name}
        control={control}
        rules={{ required: input.required ? tVal("required") : false }}
        render={({ field, fieldState }) => (
          <FormControl size="small" fullWidth error={!!fieldState.error} disabled={disabled}>
            <InputLabel>{label}</InputLabel>
            <Select {...field} label={label}>
              {options.map((opt) => (
                <MenuItem key={opt} value={opt}>
                  {opt}
                </MenuItem>
              ))}
            </Select>
            {fieldState.error && (
              <FormHelperText>{fieldState.error.message}</FormHelperText>
            )}
          </FormControl>
        )}
      />
    );
  }

  return (
    <Controller
      name={name}
      control={control}
      rules={{ required: input.required ? tVal("required") : false }}
      render={({ field, fieldState }) => (
        <TextField
          {...field}
          label={label}
          size="small"
          fullWidth
          multiline={input.input_type === InputType.textarea}
          minRows={input.input_type === InputType.textarea ? 2 : undefined}
          error={!!fieldState.error}
          helperText={fieldState.error?.message}
          disabled={disabled}
        />
      )}
    />
  );
}
