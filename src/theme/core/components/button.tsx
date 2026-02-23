import { buttonClasses } from "@mui/material/Button"
import { varAlpha } from "minimal-shared/utils"

import { colorKeys } from "../palette"
import { Components, ComponentsVariants, Theme } from "@mui/material/styles"
import { CSSObject } from "@mui/material/styles"
import { ButtonProps } from "@mui/material/Button"

// ----------------------------------------------------------------------

const baseColors = ["inherit"] as const
const allColors = [...baseColors, ...colorKeys.palette, ...colorKeys.common] as const

interface DimensionValue {
  "--padding-y": string
  "--padding-x": string
  minHeight: number
  lineHeight: number
}

interface DimensionValueXLarge {
  minHeight: number
}

const DIMENSIONS: Record<string, DimensionValue | DimensionValueXLarge> = {
  small: {
    "--padding-y": "4px",
    "--padding-x": "8px",
    minHeight: 30,
    lineHeight: 22 / 13,
  },
  medium: {
    "--padding-y": "6px",
    "--padding-x": "12px",
    minHeight: 36,
    lineHeight: 24 / 14,
  },
  large: {
    "--padding-y": "8px",
    "--padding-x": "16px",
    minHeight: 48,
    lineHeight: 26 / 15,
  },
  xLarge: { minHeight: 56 },
}

/* **********************************************************************
 * 🗳️ Variants
 * **********************************************************************/
const containedVariants: ComponentsVariants<Theme>['MuiButton'] = [
  {
    props: (props: ButtonProps): boolean =>
      props.variant === "contained" && props.color === "inherit",
    style: ({ theme }: { theme: Theme }): CSSObject => ({
      ...theme.mixins.filledStyles(theme, "inherit", {
        hover: {
          boxShadow: theme.vars.customShadows.z8,
        },
      }),
    }),
  },
  ...colorKeys.common.map((colorKey: string) => ({
    props: (props: ButtonProps): boolean => props.variant === "contained" && props.color === colorKey,
    style: ({ theme }: { theme: Theme }): CSSObject => ({
      ...theme.mixins.filledStyles(theme, colorKey, {
        hover: {
          boxShadow: theme.vars.customShadows.z8,
        },
      }),
    }),
  })),
  ...colorKeys.palette.map((colorKey: string) => ({
    props: (props: ButtonProps): boolean => props.variant === "contained" && props.color === colorKey,
    style: ({ theme }: { theme: Theme }): CSSObject => ({
      "&:hover": {
        boxShadow: theme.vars.customShadows[colorKey],
      },
    }),
  })),
]

const outlinedVariants: ComponentsVariants<Theme>['MuiButton'] = [
  {
    props: (props: ButtonProps): boolean => props.variant === "outlined",
    style: ({ theme }: { theme: Theme }): CSSObject => ({
      borderColor: varAlpha("currentColor", theme.vars.opacity.outlined.border),
      "&:hover": {
        borderColor: "currentColor",
        boxShadow: "0 0 0 0.75px currentColor",
        backgroundColor: varAlpha(
          "currentColor",
          theme.vars.palette.action.hoverOpacity,
        ),
      },
    }),
  },
  {
    props: (props: ButtonProps): boolean => props.variant === "outlined" && props.color === "inherit",
    style: ({ theme }: { theme: Theme }): CSSObject => ({
      borderColor: theme.vars.palette.shared.buttonOutlined,
      "&:hover": {
        backgroundColor: theme.vars.palette.action.hover,
      },
    }),
  },
  ...colorKeys.common.map((colorKey: string) => ({
    props: (props: ButtonProps): boolean => props.variant === "outlined" && props.color === colorKey,
    style: ({ theme }: { theme: Theme }): CSSObject => ({
      color: theme.vars.palette.common[colorKey],
    }),
  })),
]

const textVariants: ComponentsVariants<Theme>['MuiButton'] = [
  {
    props: (props: ButtonProps): boolean => props.variant === "text",
    style: ({ theme }: { theme: Theme }): CSSObject => ({
      "&:hover": {
        backgroundColor: varAlpha(
          "currentColor",
          theme.vars.palette.action.hoverOpacity,
        ),
      },
    }),
  },
  {
    props: (props: ButtonProps): boolean => props.variant === "text" && props.color === "inherit",
    style: ({ theme }: { theme: Theme }): CSSObject => ({
      "&:hover": {
        backgroundColor: theme.vars.palette.action.hover,
      },
    }),
  },
  ...colorKeys.common.map((colorKey: string) => ({
    props: (props: ButtonProps): boolean => props.variant === "text" && props.color === colorKey,
    style: ({ theme }: { theme: Theme }): CSSObject => ({
      color: theme.vars.palette.common[colorKey],
    }),
  })),
]

const softVariants: ComponentsVariants<Theme>['MuiButton'] = [
  ...allColors.map((colorKey: string) => ({
    props: (props: ButtonProps): boolean => props.variant === "soft" && props.color === colorKey,
    style: ({ theme }: { theme: Theme }): CSSObject => ({
      ...theme.mixins.softStyles(theme, colorKey, { hover: true }),
    }),
  })),
]

const sizeVariants: ComponentsVariants<Theme>['MuiButton'] = [
  {
    props: (): boolean => true,
    style: { padding: "var(--padding-y) var(--padding-x)" },
  },
  {
    props: (props: ButtonProps): boolean => props.size === "small",
    style: { ...DIMENSIONS.small },
  },
  {
    props: (props: ButtonProps): boolean => props.size === "medium",
    style: { ...DIMENSIONS.medium },
  },
  {
    props: (props: ButtonProps): boolean => props.size === "large" || props.size === "xLarge",
    style: { ...DIMENSIONS.large },
  },
  {
    props: (props: ButtonProps): boolean => props.size === "xLarge",
    style: ({ theme }: { theme: Theme }): CSSObject => ({
      ...DIMENSIONS.xLarge,
      fontSize: theme.typography.pxToRem(15),
    }),
  },
  {
    props: (props: ButtonProps): boolean => props.variant === "outlined",
    style: {
      paddingTop: "calc(var(--padding-y) - 4px)",
      paddingBottom: "calc(var(--padding-y) - 4px)",
    },
  },
  {
    props: (props: ButtonProps): boolean => props.variant === "text",
    style: {
      paddingLeft: "calc(var(--padding-x) - 4px)",
      paddingRight: "calc(var(--padding-x) - 4px)",
    },
  },
]

const disabledVariants: ComponentsVariants<Theme>['MuiButton'] = [
  {
    props: (props: ButtonProps): boolean => props.variant === "soft",
    style: ({ theme }: { theme: Theme }): CSSObject => ({
      [`&.${buttonClasses.disabled}`]: {
        backgroundColor: theme.vars.palette.action.disabledBackground,
      },
    }),
  },
]

/* **********************************************************************
 * 🧩 Components
 * **********************************************************************/
const MuiButtonBase: Components<Theme>['MuiButton'] = {
  // ▼▼▼▼▼▼▼▼ 🎨 STYLE ▼▼▼▼▼▼▼▼
  styleOverrides: {
    root: ({ theme }: { theme: Theme }): CSSObject => ({
      fontFamily: theme.typography.fontFamily,
    }),
  },
}

const MuiButton: Components<Theme>['MuiButton'] = {
  // ▼▼▼▼▼▼▼▼ ⚙️ PROPS ▼▼▼▼▼▼▼▼
  defaultProps: {
    color: "inherit",
    disableElevation: true,
  },
  // ▼▼▼▼▼▼▼▼ 🎨 STYLE ▼▼▼▼▼▼▼▼
  styleOverrides: {
    
  },
  variants: [
    ...containedVariants,
    ...outlinedVariants,
    ...textVariants,
    ...softVariants,
    ...sizeVariants,
    ...disabledVariants,
  ],
}

/* **********************************************************************
 * 🚀 Export
 * **********************************************************************/
export const button = {
  MuiButton,
  MuiButtonBase,
}
