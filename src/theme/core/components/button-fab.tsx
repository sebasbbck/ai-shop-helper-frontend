import { fabClasses } from "@mui/material/Fab"
import { pxToRem, varAlpha } from "minimal-shared/utils"

import { colorKeys } from "../palette"
import { Components, ComponentsVariants, Theme } from "@mui/material/styles"
import { CSSObject } from "@mui/material/styles"
import { FabProps } from "@mui/material/Fab"

// ----------------------------------------------------------------------

const baseColors = ["default", "inherit"] as const
const allColors = [...baseColors, ...colorKeys.palette, ...colorKeys.common] as const

const VARIANTS = {
  filled: ["circular", "extended"] as const,
  outlined: ["outlined", "outlinedExtended"] as const,
  soft: ["soft", "softExtended"] as const,
  extended: ["extended", "outlinedExtended", "softExtended"] as const,
} as const

interface DimensionValue {
  "--size": string
  padding: string
  fontSize: string
  lineHeight: number
}

const DIMENSIONS: Record<string, DimensionValue> = {
  extendedSmall: {
    "--size": "36px",
    padding: "4px 8px",
    fontSize: pxToRem(13),
    lineHeight: 22 / 13,
  },
  extendedMedium: {
    "--size": "40px",
    padding: "6px 12px",
    fontSize: pxToRem(14),
    lineHeight: 24 / 14,
  },
  extendedLarge: {
    "--size": "48px",
    padding: "8px 16px",
    fontSize: pxToRem(15),
    lineHeight: 26 / 15,
  },
}

function isVariant(allowed: readonly string[], variant: string | undefined): variant is string {
  return !!variant && allowed.includes(variant)
}

/* **********************************************************************
 * 🗳️ Variants
 * **********************************************************************/
const filledVariants: ComponentsVariants<Theme>['MuiFab'] = [
  {
    props: (props: FabProps): boolean =>
      isVariant(VARIANTS.filled, props.variant) && props.color === "default",
    style: ({ theme }: { theme: Theme }): CSSObject => ({
      ...theme.mixins.filledStyles(theme, "default", { hover: true }),
      boxShadow: theme.vars.customShadows.z8,
    }),
  },
  {
    props: (props) =>
      isVariant(VARIANTS.filled, props.variant) && props.color === "inherit",
    style: ({ theme }) => ({
      ...theme.mixins.filledStyles(theme, "inherit", { hover: true }),
      boxShadow: theme.vars.customShadows.z8,
    }),
  },
  ...colorKeys.common.map((colorKey: string) => ({
    props: (props: FabProps): boolean =>
      isVariant(VARIANTS.filled, props.variant) && props.color === colorKey,
    style: ({ theme }: { theme: Theme }): CSSObject => ({
      ...theme.mixins.filledStyles(theme, colorKey, { hover: true }),
      boxShadow: theme.vars.customShadows.z8,
    }),
  })),
  ...colorKeys.palette.map((colorKey: string) => ({
    props: (props: FabProps): boolean =>
      isVariant(VARIANTS.filled, props.variant) && props.color === colorKey,
    style: ({ theme }: { theme: Theme }): CSSObject => ({
      boxShadow: theme.vars.customShadows[colorKey],
    }),
  })),
]

const outlinedVariants: ComponentsVariants<Theme>['MuiFab'] = [
  {
    props: (props: FabProps): boolean => isVariant(VARIANTS.outlined, props.variant),
    style: ({ theme }: { theme: Theme }): CSSObject => ({
      borderWidth: 1,
      boxShadow: "none",
      borderStyle: "solid",
      backgroundColor: "transparent",
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
    props: (props: FabProps): boolean =>
      isVariant(VARIANTS.outlined, props.variant) &&
      (props.color === "default" || props.color === "inherit"),
    style: ({ theme }: { theme: Theme }): CSSObject => ({
      borderColor: theme.vars.palette.shared.buttonOutlined,
      "&:hover": {
        backgroundColor: theme.vars.palette.action.hover,
      },
    }),
  },
  {
    props: (props: FabProps): boolean =>
      isVariant(VARIANTS.outlined, props.variant) && props.color === "default",
    style: ({ theme }: { theme: Theme }): CSSObject => ({
      color: theme.vars.palette.action.active,
    }),
  },
  ...colorKeys.common.map((colorKey: string) => ({
    props: (props: FabProps): boolean =>
      isVariant(VARIANTS.outlined, props.variant) && props.color === colorKey,
    style: ({ theme }: { theme: Theme }): CSSObject => ({
      color: theme.vars.palette.common[colorKey],
    }),
  })),
  ...colorKeys.palette.map((colorKey: string) => ({
    props: (props: FabProps): boolean =>
      isVariant(VARIANTS.outlined, props.variant) && props.color === colorKey,
    style: ({ theme }: { theme: Theme }): CSSObject => ({
      color: theme.vars.palette[colorKey].main,
    }),
  })),
]

const softVariants: ComponentsVariants<Theme>['MuiFab'] = [
  ...allColors.map((colorKey: string) => ({
    props: (props: FabProps): boolean =>
      isVariant(VARIANTS.soft, props.variant) && props.color === colorKey,
    style: ({ theme }: { theme: Theme }): CSSObject => ({
      ...theme.mixins.softStyles(theme, colorKey, { hover: true }),
    }),
  })),
]

const sizeVariants: ComponentsVariants<Theme>['MuiFab'] = [
  {
    props: (props: FabProps): boolean => isVariant(VARIANTS.extended, props.variant),
    style: ({ theme }: { theme: Theme }): CSSObject => ({
      width: "auto",
      height: "auto",
      gap: theme.spacing(1),
      minWidth: "var(--size)",
      minHeight: "var(--size)",
      borderRadius: "calc(var(--size) / 2)",
    }),
  },
  {
    props: (props: FabProps): boolean =>
      isVariant(VARIANTS.extended, props.variant) && props.size === "small",
    style: DIMENSIONS.extendedSmall,
  },
  {
    props: (props: FabProps): boolean =>
      isVariant(VARIANTS.extended, props.variant) && props.size === "medium",
    style: DIMENSIONS.extendedMedium,
  },
  {
    props: (props: FabProps): boolean =>
      isVariant(VARIANTS.extended, props.variant) && props.size === "large",
    style: DIMENSIONS.extendedLarge,
  },
]

const disabledVariants: ComponentsVariants<Theme>['MuiFab'] = [
  {
    props: (props: FabProps): boolean => isVariant(VARIANTS.outlined, props.variant),
    style: ({ theme }: { theme: Theme }): CSSObject => ({
      [`&.${fabClasses.disabled}`]: {
        backgroundColor: "transparent",
        borderColor: theme.vars.palette.action.disabledBackground,
      },
    }),
  },
]

/* **********************************************************************
 * 🧩 Components
 * **********************************************************************/
const MuiFab: Components<Theme>['MuiFab'] = {
  // ▼▼▼▼▼▼▼▼ ⚙️ PROPS ▼▼▼▼▼▼▼▼
  defaultProps: {
    color: "primary",
    size: "medium",
  },
  // ▼▼▼▼▼▼▼▼ 🎨 STYLE ▼▼▼▼▼▼▼▼
  styleOverrides: {
    root: {
      "&:hover": { boxShadow: "none" },
    },
  },
  variants: [
    ...filledVariants,
    ...outlinedVariants,
    ...softVariants,
    ...sizeVariants,
    ...disabledVariants,
  ],
}

/* **********************************************************************
 * 🚀 Export
 * **********************************************************************/
export const fab = {
  MuiFab,
}
