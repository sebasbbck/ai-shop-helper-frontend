import { paginationItemClasses, PaginationItemProps } from "@mui/material/PaginationItem"
import { varAlpha } from "minimal-shared/utils"

import { colorKeys } from "../palette"
import { Components, ComponentsVariants, Theme } from "@mui/material/styles"

// ----------------------------------------------------------------------

const baseColors = ["standard"]
const allColors = [...baseColors, ...colorKeys.palette]

/* **********************************************************************
 * 🗳️ Variants
 * **********************************************************************/
const textVariants: ComponentsVariants<Theme>["MuiPaginationItem"] = [
  {
    props: (props) => props.variant === "text" && props.color === "standard",
    style: ({ theme }) => ({
      [`&.${paginationItemClasses.selected}`]: {
        ...theme.mixins.filledStyles(theme, "inherit", { hover: true }),
      },
    }),
  },
]

const outlinedVariants: ComponentsVariants<Theme>["MuiPaginationItem"] = [
  {
    props: (props) => props.variant === "outlined",
    style: ({ theme }) => ({
      borderColor: theme.vars.palette.shared.buttonOutlined,
      [`&.${paginationItemClasses.selected}`]: {
        borderColor: "currentColor",
        backgroundColor: varAlpha(
          "currentColor",
          theme.vars.palette.action.selectedOpacity,
        ),
        "&:hover": {
          backgroundColor: varAlpha(
            "currentColor",
            `calc(${theme.vars.palette.action.selectedOpacity} * 2)`,
          ),
        },
      },
    }),
  },
  {
    props: (props) =>
      props.variant === "outlined" && props.color === "standard",
    style: ({ theme }) => ({
      [`&.${paginationItemClasses.selected}`]: {
        backgroundColor: varAlpha(theme.vars.palette.grey["500Channel"], 0.08),
        "&:hover": {
          backgroundColor: varAlpha(
            theme.vars.palette.grey["500Channel"],
            0.16,
          ),
        },
      },
    }),
  },
]

const softVariants: ComponentsVariants<Theme>["MuiPaginationItem"] = [
  ...allColors.map((colorKey) => ({
    props: (props: PaginationItemProps) => props.variant === "soft" as any && props.color === colorKey,
    style: ({ theme }: { theme: Theme }) => {
      const currentColor = colorKey === "standard" ? "inherit" : colorKey

      return {
        [`&.${paginationItemClasses.selected}`]: {
          ...theme.mixins.softStyles(theme, currentColor, { hover: true }),
        },
      }
    },
  })),
]

const disabledVariants: ComponentsVariants<Theme>["MuiPaginationItem"] = [
  {
    props: {},
    style: ({ theme }) => ({
      [`&.${paginationItemClasses.disabled}`]: {
        [`&.${paginationItemClasses.selected}`]: {
          backgroundColor: theme.vars.palette.action.disabledBackground,
        },
      },
    }),
  },
]

/* **********************************************************************
 * 🧩 Components
 * **********************************************************************/
const MuiPaginationItem: Components<Theme>["MuiPaginationItem"] = {
  // ▼▼▼▼▼▼▼▼ 🎨 STYLE ▼▼▼▼▼▼▼▼
  styleOverrides: {
    root: ({ theme }: { theme: Theme }) => ({
      [`&.${paginationItemClasses.selected}`]: {
        fontWeight: theme.typography.fontWeightBold,
      },
    }),
  },
  variants: [
    ...textVariants,
    ...outlinedVariants,
    ...softVariants,
    ...disabledVariants,
  ],
}

/* **********************************************************************
 * 🚀 Export
 * **********************************************************************/
export const pagination = {
  MuiPaginationItem,
}
