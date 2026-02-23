import { Theme, Components, ComponentsVariants, CSSObject } from "@mui/material/styles"
import Box from "@mui/material/Box"
import { parseCssVar } from "minimal-shared/utils"

import { colorKeys } from "../palette"

// ----------------------------------------------------------------------

type AvatarColor = "default" | "inherit" | (typeof colorKeys.palette)[number]

const baseColors: AvatarColor[] = ["default", "inherit"]
const allColors: AvatarColor[] = [...baseColors, ...colorKeys.palette]

export function getAvatarColor(inputValue?: string | null, fallback: AvatarColor = "default"): AvatarColor {
  if (!inputValue?.trim()) return fallback

  const firstChar = inputValue.trim()[0].toLowerCase()

  if (!/[a-z]/.test(firstChar)) return fallback

  const alphabetIndex = firstChar.charCodeAt(0) - "a".charCodeAt(0)
  const colorIndex = alphabetIndex % allColors.length

  return allColors[colorIndex] || fallback
}

const customRenderSurplus = (surplus: number) => (
  <Box
    component="span"
    sx={(theme) => ({
      width: 1,
      height: 1,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "absolute",
      color: theme.vars.palette.primary.dark,
      backgroundColor: theme.vars.palette.primary.lighter,
      fontSize: {
        "@0": theme.typography.pxToRem(11),
        "@32": theme.typography.pxToRem(12),
        "@36": theme.typography.pxToRem(13),
        "@40": theme.typography.pxToRem(14),
        "@64": theme.typography.pxToRem(18),
      },
    })}
  >
    +{surplus}
  </Box>
)

/* **********************************************************************
 * 🗳️ Variants
 * **********************************************************************/

// Note: We use 'any' for props here because 'color' is likely a custom prop 
// added via module augmentation, and standard AvatarProps won't recognize it yet.
const colorVariants: ComponentsVariants<Theme>["MuiAvatar"] = [
  {
    props: {},
    style: ({ theme }): CSSObject => ({
      color: theme.vars.palette.action.active,
      [parseCssVar(theme.vars.palette.Avatar.defaultBg)]: theme.vars.palette.grey[300],
      ...theme.applyStyles("dark", {
        [parseCssVar(theme.vars.palette.Avatar.defaultBg)]: theme.vars.palette.grey[700],
      }),
    }),
  },
  {
    props: (props: any) =>
      props.color === "inherit" || (!!props.alt && getAvatarColor(props.alt) === "inherit"),
    style: ({ theme }): CSSObject => ({
      ...theme.mixins.filledStyles(theme, "inherit"),
    }),
  },
  ...colorKeys.palette.map((colorKey) => ({
    props: (props: any) =>
      props.color === colorKey || (!!props.alt && getAvatarColor(props.alt) === colorKey),
    style: ({ theme }: { theme: Theme }): CSSObject => ({
      color: theme.vars.palette[colorKey as keyof typeof theme.vars.palette].contrastText,
      backgroundColor: theme.vars.palette[colorKey as keyof typeof theme.vars.palette].main,
    }),
  })),
]

const avatarGroupVariants = {
  root: [
    {
      props: { variant: "compact" } as any,
      style: { width: 40, height: 40, position: "relative" } as CSSObject,
    },
  ],
  avatar: [
    {
      props: { variant: "compact" } as any,
      style: {
        margin: 0,
        width: 28,
        height: 28,
        position: "absolute",
        "&:first-of-type": { left: 0, bottom: 0, zIndex: 9 },
        "&:last-of-type": { top: 0, right: 0 },
      } as CSSObject,
    },
  ],
}

/* **********************************************************************
 * 🧩 Components
 * **********************************************************************/
const MuiAvatar: Components<Theme>["MuiAvatar"] = {
  styleOverrides: {
    root: ({ theme }) => ({
      containerType: "inline-size",
      fontSize: theme.typography.pxToRem(18),
      fontWeight: theme.typography.fontWeightMedium,
    }),
    colorDefault: {
      // Cast to avoid the Interpolation error
      variants: colorVariants as any,
    },
    rounded: ({ theme }) => ({
      borderRadius: Number(theme.shape.borderRadius) * 1.5,
    }),
  },
}

const MuiAvatarGroup: Components<Theme>["MuiAvatarGroup"] = {
  defaultProps: {
    max: 4,
    renderSurplus: (surplus) => customRenderSurplus(surplus),
  },
  styleOverrides: {
    root: {
      justifyContent: "flex-end",
      variants: avatarGroupVariants.root as any,
    },
    avatar: {
      variants: avatarGroupVariants.avatar as any,
    },
  },
}

export const avatar = { MuiAvatar, MuiAvatarGroup }
