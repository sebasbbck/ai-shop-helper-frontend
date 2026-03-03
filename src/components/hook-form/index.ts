import { SxProps, Theme } from "@mui/material/styles"

export * from "./fields"
export * from "./form-provider"
export * from "./rhf-autocomplete"
export * from "./rhf-checkbox"
export * from "./rhf-country-select"
export * from "./rhf-date-picker"
export * from "./rhf-phone-input"
export * from "./rhf-radio-group"
export * from "./rhf-rating"
export * from "./rhf-select"
export * from "./rhf-slider"
export * from "./rhf-switch"
export * from "./rhf-text-field"
export * from "./schema-utils"

export interface RHFProps {
  name: string
  label?: string
  options?: Array<{ label: string; value: string }>
  slotProps?: {
    textField?: {
      sx?: SxProps<Theme>
      InputProps?: Record<string, any>
      inputProps?: Record<string, any>
      slotProps?: {
        htmlInput?: Record<string, any>
      }
      helperText?: string
    }
    [key: string]: any
  }
  helperText?: string
  chip?: {
    size?: "small" | "medium"
    variant?: "filled" | "outlined" | "soft" | "solid"
    [key: string]: any
  }
  checkbox?: {
    size?: "small" | "medium"
    [key: string]: any
  }
  placeholder?: string
  sx?: SxProps<Theme>
  [key: string]: any
}
