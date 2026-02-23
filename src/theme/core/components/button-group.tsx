import { buttonGroupClasses } from "@mui/material/ButtonGroup"
import { varAlpha } from "minimal-shared/utils"

import { colorKeys } from "../palette"
import { Components, ComponentsVariants, Theme } from "@mui/material/styles"
import { CSSObject } from "@mui/material/styles"

// ----------------------------------------------------------------------

/* **********************************************************************
 * 🗳️ Variants
 * **********************************************************************/

const groupedVariants: ComponentsVariants<Theme>['MuiButtonGroup'] = [
  {
    props: (props: any) => props.variant === "contained",
    style: ({ theme }: { theme: Theme }): CSSObject => ({
      [`& .${buttonGroupClasses.grouped}`]: {
        borderColor: theme.vars.palette.shared.buttonOutlined,
      },
    }),
  },
  ...(colorKeys?.palette || []).map((colorKey: string) => ({
    props: (props: any) => props.variant === "contained" && props.color === colorKey,
    style: ({ theme }: { theme: Theme }): CSSObject => ({
      [`& .${buttonGroupClasses.grouped}`]: {
        borderColor: varAlpha(
          theme.vars.palette[colorKey as keyof typeof theme.vars.palette].darkChannel,
          theme.vars.opacity.outlined.border,
        ),
      },
    }),
  })),
  {
    props: (props: any) => props.variant === "text",
    style: ({ theme }: { theme: Theme }): CSSObject => ({
      [`& .${buttonGroupClasses.grouped}`]: {
        borderColor: varAlpha("currentColor", theme.vars.opacity.outlined.border),
      },
    }),
  },
  {
    props: (props: any) => props.variant === "text" && props.color === "inherit",
    style: ({ theme }: { theme: Theme }): CSSObject => ({
      [`& .${buttonGroupClasses.grouped}`]: {
        borderColor: theme.vars.palette.shared.buttonOutlined,
      },
    }),
  },
  {
    props: (props: any) => props.variant === "soft",
    style: ({ theme }: { theme: Theme }): CSSObject => ({
      [`& .${buttonGroupClasses.grouped}`]: {
        borderStyle: "solid",
        borderColor: varAlpha("currentColor", theme.vars.opacity.soft.border),
      },
    }),
  },
  {
    props: (props: any) => props.variant === "soft" && props.color === "inherit",
    style: ({ theme }: { theme: Theme }): CSSObject => ({
      [`& .${buttonGroupClasses.grouped}`]: {
        borderColor: theme.vars.palette.shared.buttonOutlined,
      },
    }),
  },
]

const positionVariants: ComponentsVariants<Theme>['MuiButtonGroup'] = [
  {
    props: (props: any) => props.variant === "soft" && props.orientation === "horizontal",
    style: {
      [`& .${buttonGroupClasses.firstButton}, & .${buttonGroupClasses.middleButton}`]: {
        borderRightWidth: 1,
      },
    },
  },
  {
    props: (props: any) => props.variant === "soft" && props.orientation === "vertical",
    style: {
      [`& .${buttonGroupClasses.firstButton}, & .${buttonGroupClasses.middleButton}`]: {
        borderBottomWidth: 1,
      },
    },
  },
]

const disabledVariants: ComponentsVariants<Theme>['MuiButtonGroup'] = [
  {
    props: (props: any) => !!props.disabled,
    style: ({ theme }: { theme: Theme }): CSSObject => ({
      [`& .${buttonGroupClasses.grouped}`]: {
        borderColor: theme.vars.palette.action.disabledBackground,
      },
    }),
  },
]

/* **********************************************************************
 * 🧩 Components
 * **********************************************************************/
const MuiButtonGroup: Components<Theme>['MuiButtonGroup'] = {
  defaultProps: {
    color: "inherit",
    disableElevation: true,
  },
  styleOverrides: {
    // Basic root styles here if needed
  },
  variants: [
    ...(groupedVariants ?? []),
    ...(positionVariants ?? []),
    ...(disabledVariants ?? []),
  ],
}

/* **********************************************************************
 * 🚀 Export
 * **********************************************************************/
export const buttonGroup = {
  MuiButtonGroup,
}
