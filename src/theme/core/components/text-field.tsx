import {
  Theme,
  Components,
  inputBaseClasses,
  inputAdornmentClasses,
  outlinedInputClasses,
  filledInputClasses,
  ComponentsVariants,
} from '@mui/material'
import { varAlpha } from 'minimal-shared/utils'

// ----------------------------------------------------------------------

export const INPUT_TYPOGRAPHY = {
  fontSize: { base: 15, responsive: 16 },
  lineHeight: 24,
}

export const INPUT_PADDING = {
  base: {
    small: { paddingTop: 0, paddingBottom: 4 },
    medium: { paddingTop: 4, paddingBottom: 4 },
  },
  outlined: {
    small: { paddingTop: 8, paddingBottom: 8 },
    medium: { paddingTop: 16, paddingBottom: 16 },
  },
  filled: {
    small: { paddingTop: 20 },
    medium: { paddingTop: 24 },
    smallHidden: { paddingTop: 8, paddingBottom: 8 },
    mediumHidden: { paddingTop: 16, paddingBottom: 16 },
  },
}

export function getInputTypography(
  theme: Theme,
  keys: (keyof typeof INPUT_TYPOGRAPHY | 'height')[],
) {
  const { fontSize, lineHeight } = INPUT_TYPOGRAPHY

  const baseStyles: Record<string, any> = {
    fontSize: theme.typography.pxToRem(fontSize.base),
    height: `${lineHeight}px`,
    lineHeight: `${lineHeight}px`,
  }

  const responsiveStyles: Record<string, any> = {
    fontSize: theme.typography.pxToRem(fontSize.responsive),
    height: `${lineHeight}px`,
    lineHeight: `${lineHeight}px`,
  }

  const styles: Record<string, any> = {}

  keys.forEach((key) => {
    styles[key] = baseStyles[key]
  })

  styles[theme.breakpoints.down('sm')] = {}
  keys.forEach((key) => {
    styles[theme.breakpoints.down('sm')][key] = responsiveStyles[key]
  })

  return styles
}

/* **********************************************************************
 * 🧩 Shared Style Logic (All Exported)
 * **********************************************************************/

export const inputBaseStyles = {
  root: (context: string, theme: Theme, classes: any) => ({
    '--disabled-color': theme.vars.palette.action.disabled,
    ...getInputTypography(theme, ['lineHeight']),
    [`&.${classes.disabled}`]: {
      [`& .${inputAdornmentClasses.root} *`]: {
        color: 'var(--disabled-color)',
      },
      [`& .${classes.input}`]: {
        ...(context === 'standard' && {
          WebkitTextFillColor: 'var(--disabled-color)',
        }),
        ...(context === 'picker' && {
          '& span': { color: 'var(--disabled-color)' },
        }),
      },
    },
  }),
  input: (context: string, theme: Theme) => ({
    ...(context === 'standard' && {
      ...getInputTypography(theme, ['fontSize', 'height', 'lineHeight']),
      '&:focus': { borderRadius: 'inherit' },
      '&::placeholder': { color: theme.vars.palette.text.disabled, opacity: 1 },
    }),
    ...(context === 'picker' && {
      ...getInputTypography(theme, ['fontSize', 'lineHeight']),
      '& span': { lineHeight: 'inherit' },
    }),
  }),
}

export const inputStyles = {
  root: (theme: Theme) => ({
    '&::before': {
      borderBottomColor: theme.vars.palette.shared.inputUnderline,
    },
    '&::after': { borderBottomColor: theme.vars.palette.text.primary },
  }),
}

export const outlinedInputStyles = {
  root: (theme: Theme, classes: any) => ({
    [`&.${classes.focused}:not(.${classes.error})`]: {
      [`& .${classes.notchedOutline}`]: {
        borderColor: theme.vars.palette.text.primary,
      },
    },
    [`&.${classes.disabled}`]: {
      [`& .${classes.notchedOutline}`]: {
        borderColor: theme.vars.palette.action.disabledBackground,
      },
    },
  }),
  notchedOutline: (theme: Theme) => ({
    borderColor: theme.vars.palette.shared.inputOutlined,
    transition: theme.transitions.create(['border-color'], {
      duration: theme.transitions.duration.shortest,
    }),
  }),
}

export const filledInputStyles = {
  root: (theme: Theme, classes: any) => {
    const baseBg = varAlpha(theme.vars.palette.grey['500Channel'], 0.08)
    const hoverBg = varAlpha(theme.vars.palette.grey['500Channel'], 0.16)
    const errorBg = varAlpha(theme.vars.palette.error.mainChannel, 0.08)
    const disabledBg = theme.vars.palette.action.disabledBackground

    return {
      backgroundColor: baseBg,
      borderRadius: theme.shape.borderRadius,
      [`&:hover, &.${classes.focused}`]: { backgroundColor: hoverBg },
      [`&.${classes.error}`]: {
        backgroundColor: errorBg,
        [`&:hover, &.${classes.focused}`]: {
          backgroundColor: varAlpha(theme.vars.palette.error.mainChannel, 0.16),
        },
      },
      [`&.${classes.disabled}`]: { backgroundColor: disabledBg },
    }
  },
}

/* **********************************************************************
 * 🗳️ Variants (All Exported as Objects)
 * **********************************************************************/

export const inputBaseVariants = {
  root: [
    {
      props: (props: any) => !!props.multiline,
      style: { ...INPUT_PADDING.base.medium },
    },
    {
      props: (props: any) => !!props.multiline && props.size === 'small',
      style: { ...INPUT_PADDING.base.small },
    },
  ] as ComponentsVariants<Theme>['MuiInputBase'],
  input: [
    {
      props: (props: any) => !props.multiline,
      style: { ...INPUT_PADDING.base.medium },
    },
    {
      props: (props: any) =>
        !props.multiline &&
        (props.size === 'small' || props.ownerState?.inputSize === 'small'),
      style: { ...INPUT_PADDING.base.small },
    },
  ] as ComponentsVariants<Theme>['MuiInputBase'],
}

export const outlinedInputVariants = {
  root: [
    {
      props: (props: any) => !!props.multiline,
      style: { ...INPUT_PADDING.outlined.medium },
    },
    {
      props: (props: any) => !!props.multiline && props.size === 'small',
      style: { ...INPUT_PADDING.outlined.small },
    },
  ] as ComponentsVariants<Theme>['MuiOutlinedInput'],
  input: [
    {
      props: (props: any) =>
        !props.multiline &&
        (props.size === 'small' || props.ownerState?.inputSize === 'small'),
      style: { ...INPUT_PADDING.outlined.small },
    },
    {
      props: (props: any) => !props.multiline,
      style: { ...INPUT_PADDING.outlined.medium },
    },
  ] as ComponentsVariants<Theme>['MuiOutlinedInput'],
}

export const filledInputVariants = {
  root: [
    {
      props: (props: any) => !!props.multiline,
      style: { ...INPUT_PADDING.filled.medium },
    },
    {
      props: (props: any) => !!props.multiline && props.size === 'small',
      style: { ...INPUT_PADDING.filled.small },
    },
  ] as ComponentsVariants<Theme>['MuiFilledInput'],
  input: [
    {
      props: (props: any) =>
        !props.multiline &&
        (props.size === 'small' || props.ownerState?.inputSize === 'small'),
      style: { ...INPUT_PADDING.filled.small },
    },
    {
      props: (props: any) => !props.multiline,
      style: { ...INPUT_PADDING.filled.medium },
    },
    {
      props: (props: any) => !!props.hiddenLabel,
      style: { ...INPUT_PADDING.filled.mediumHidden },
    },
  ] as ComponentsVariants<Theme>['MuiFilledInput'],
}

/* **********************************************************************
 * 🧩 Internal Component Theme Definitions
 * **********************************************************************/

const MuiInputBase: Components<Theme>['MuiInputBase'] = {
  styleOverrides: {
    root: ({ theme }) =>
      inputBaseStyles.root('standard', theme, inputBaseClasses),
    input: ({ theme }) => inputBaseStyles.input('standard', theme),
  },
  variants: [
    ...(inputBaseVariants.root ?? []),
    ...(inputBaseVariants.input ?? []).map((variant) => ({
      ...variant,
      style: { [`& .${inputBaseClasses.input}`]: variant.style },
    })),
  ],
}

const MuiOutlinedInput: Components<Theme>['MuiOutlinedInput'] = {
  styleOverrides: {
    root: ({ theme }) => outlinedInputStyles.root(theme, outlinedInputClasses),
    notchedOutline: ({ theme }) => outlinedInputStyles.notchedOutline(theme),
  },
  variants: [
    ...(outlinedInputVariants.root ?? []),
    ...(outlinedInputVariants.input ?? []).map((variant) => ({
      ...variant,
      style: { [`& .${outlinedInputClasses.input}`]: variant.style },
    })),
  ],
}

const MuiFilledInput: Components<Theme>['MuiFilledInput'] = {
  defaultProps: { disableUnderline: true },
  styleOverrides: {
    root: ({ theme }) => filledInputStyles.root(theme, filledInputClasses),
  },
  variants: [
    ...(filledInputVariants.root ?? []),
    ...(filledInputVariants.input ?? []).map((variant) => ({
      ...variant,
      style: { [`& .${filledInputClasses.input}`]: variant.style },
    })),
  ],
}

const MuiInput: Components<Theme>['MuiInput'] = {
  styleOverrides: {
    root: ({ theme }) => inputStyles.root(theme),
  },
}

const MuiTextField: Components<Theme>['MuiTextField'] = {
  defaultProps: { variant: 'outlined' },
}

export const textField = {
  MuiInput,
  MuiInputBase,
  MuiTextField,
  MuiFilledInput,
  MuiOutlinedInput,
}
