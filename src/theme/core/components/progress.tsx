import { linearProgressClasses, LinearProgressProps } from "@mui/material/LinearProgress"
import { varAlpha } from "minimal-shared/utils"

import { colorKeys } from "../palette"
import { ComponentsVariants, Theme } from "@mui/material/styles"

// ----------------------------------------------------------------------

const baseColors = ["inherit"]
const allColors = [...baseColors, ...colorKeys.palette]

const LINEAR_OPACITY = { track: 0.24, dashed: 0.48 }

function getColorStyle(theme: Theme, colorKey: string) {
  if (colorKey === "inherit") {
    return {
      "&::before": { opacity: LINEAR_OPACITY.track },
      [`& .${linearProgressClasses.bar2}`]: { opacity: 1 },
    }
  }

  return {
    backgroundColor: varAlpha(
      theme.vars.palette[colorKey].mainChannel,
      LINEAR_OPACITY.track,
    ),
  }
}

function getBufferStyle(theme: Theme, colorKey: string) {
  const isInherit = colorKey === "inherit"

  const gradientColor = isInherit
    ? "currentColor"
    : theme.vars.palette[colorKey].mainChannel
  const backgroundColor = isInherit
    ? "currentColor"
    : varAlpha(theme.vars.palette[colorKey].mainChannel, LINEAR_OPACITY.track)

  return {
    [`& .${linearProgressClasses.bar2}`]: {
      backgroundColor,
      ...(isInherit && { opacity: LINEAR_OPACITY.track }),
    },
    [`& .${linearProgressClasses.dashed}`]: {
      backgroundImage: `radial-gradient(${varAlpha(gradientColor, LINEAR_OPACITY.dashed)} 0%, ${varAlpha(gradientColor, LINEAR_OPACITY.dashed)} 16%, transparent 42%)`,
    },
  }
}

/* **********************************************************************
 * 🗳️ Variants
 * **********************************************************************/
const colorVariants: ComponentsVariants<Theme>["MuiLinearProgress"] = [
  ...allColors.map((colorKey) => ({
    props: (props: LinearProgressProps) => props.color === colorKey && props.variant !== "buffer",
    style: ({ theme }: { theme: Theme }) => getColorStyle(theme, colorKey),
  })),
  ...allColors.map((colorKey) => ({
    props: (props: LinearProgressProps) => props.color === colorKey && props.variant === "buffer",
    style: ({ theme }: { theme: Theme }) => getBufferStyle(theme, colorKey),
  })),
]

/* **********************************************************************
 * 🧩 Components
 * **********************************************************************/
const MuiCircularProgress = {
  // ▼▼▼▼▼▼▼▼ ⚙️ PROPS ▼▼▼▼▼▼▼▼
  defaultProps: {
    color: "inherit",
  },
}

const MuiLinearProgress = {
  // ▼▼▼▼▼▼▼▼ ⚙️ PROPS ▼▼▼▼▼▼▼▼
  defaultProps: {
    color: "inherit",
  },
  // ▼▼▼▼▼▼▼▼ 🎨 STYLE ▼▼▼▼▼▼▼▼
  styleOverrides: {
    root: {
      borderRadius: 16,
      variants: [...colorVariants],
    },
    bar: {
      borderRadius: "inherit",
    },
  },
}

/* **********************************************************************
 * 🚀 Export
 * **********************************************************************/
export const progress = {
  MuiLinearProgress,
  MuiCircularProgress,
}
