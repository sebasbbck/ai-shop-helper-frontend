import { colorKeys } from '../palette'
import { Components, ComponentsVariants, Theme } from '@mui/material/styles'
import { CSSObject } from '@mui/material/styles'
import { IconButtonProps } from '@mui/material/IconButton'

// ----------------------------------------------------------------------

/* **********************************************************************
 * 🗳️ Variants
 * **********************************************************************/
const colorVariants: ComponentsVariants<Theme>['MuiIconButton'] = [
  ...colorKeys.common.map((colorKey: string) => ({
    props: (props: IconButtonProps): boolean => props.color === colorKey,
    style: ({ theme }: { theme: Theme }): CSSObject => ({
      color: theme.vars.palette.common[colorKey],
    }),
  })),
]

/* **********************************************************************
 * 🧩 Components
 * **********************************************************************/
const MuiIconButton: Components<Theme>['MuiIconButton'] = {
  // ▼▼▼▼▼▼▼▼ 🎨 STYLE ▼▼▼▼▼▼▼▼
  variants: [...colorVariants],
}

/* **********************************************************************
 * 🚀 Export
 * **********************************************************************/
export const iconButton = {
  MuiIconButton,
}
