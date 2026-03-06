import { toggleButtonClasses } from '@mui/material/ToggleButton'
import { varAlpha } from 'minimal-shared/utils'

import { colorKeys } from '../palette'
import { Components, ComponentsVariants, Theme } from '@mui/material/styles'
import { CSSObject } from '@mui/material/styles'

// ----------------------------------------------------------------------

const SIZES = ['small', 'medium', 'large'] as const

interface DimensionRecord {
  [key: string]: Record<string, string>
}

const DIMENSIONS: DimensionRecord = {
  small: { '--size': '40px', '--padding': '7px' },
  medium: { '--size': '48px', '--padding': '11px' },
  large: { '--size': '56px', '--padding': '15px' },
  group: { '--group-gap': '4px' },
}

/* **********************************************************************
 * 🗳️ Variants
 * **********************************************************************/
const colorVariants: ComponentsVariants<Theme>['MuiToggleButton'] = [
  ...colorKeys?.palette.map((colorKey: string) => ({
    props: (props: any): boolean => props.color === colorKey,
    style: ({ theme }: { theme: Theme }): CSSObject => ({
      '&:hover': {
        borderColor: varAlpha(
          theme.vars.palette[colorKey].mainChannel,
          theme.vars.opacity.outlined.border,
        ),
        backgroundColor: varAlpha(
          theme.vars.palette[colorKey].mainChannel,
          theme.vars.palette.action.hoverOpacity,
        ),
      },
    }),
  })),
]

const sizeVariants: ComponentsVariants<Theme>['MuiToggleButton'] = [
  ...SIZES.map((size: string) => ({
    props: (props: any): boolean => props.size === size,
    style: { ...DIMENSIONS[size] },
  })),
]

const standaloneStateVariants: ComponentsVariants<Theme>['MuiToggleButton'] = [
  {
    props: (): boolean => true,
    style: ({ theme }: { theme: Theme }): CSSObject => ({
      [`&.${toggleButtonClasses.selected}`]: {
        borderColor: 'currentColor',
        boxShadow: '0 0 0 0.75px currentColor',
      },
      [`&.${toggleButtonClasses.disabled}`]: {
        boxShadow: 'none',
        color: theme.vars.palette.action.disabled,
        borderColor: theme.vars.palette.action.disabledBackground,
        [`&.${toggleButtonClasses.selected}`]: {
          backgroundColor: theme.vars.palette.action.disabledBackground,
        },
      },
    }),
  },
]

const groupedStateVariants: ComponentsVariants<Theme>['MuiToggleButton'] = [
  {
    props: (): boolean => true,
    style: {
      [`&.${toggleButtonClasses.selected}`]: { boxShadow: 'none' },
      [`&.${toggleButtonClasses.disabled}`]: { border: 'none' },
    },
  },
]

/* **********************************************************************
 * 🧩 Components
 * **********************************************************************/
const MuiToggleButton: Components<Theme>['MuiToggleButton'] = {
  // ▼▼▼▼▼▼▼▼ 🎨 STYLE ▼▼▼▼▼▼▼▼
  styleOverrides: {
    root: ({ theme }: { theme: Theme }): CSSObject => ({
      gap: 8,
      minWidth: 'var(--size)',
      minHeight: 'var(--size)',
      padding: 'var(--padding)',
      fontWeight: theme.typography.fontWeightBold,
    }),
  },
  variants: [...colorVariants, ...sizeVariants, ...standaloneStateVariants],
}

const MuiToggleButtonGroup: Components<Theme>['MuiToggleButtonGroup'] = {
  // ▼▼▼▼▼▼▼▼ 🎨 STYLE ▼▼▼▼▼▼▼▼
  styleOverrides: {
    root: ({ theme }: { theme: Theme }): CSSObject => ({
      ...DIMENSIONS.group,
      gap: 'var(--group-gap)',
      padding: 'var(--group-gap)',
      border: `1px solid ${theme.vars.palette.shared.paperOutlined}`,
    }),
    grouped: (): CSSObject => ({
      border: 'none',
      borderRadius: 'inherit',
      padding: 'calc(var(--padding) - var(--group-gap))',
      minWidth: 'calc(var(--size) - (var(--group-gap) * 2 + 2px))',
      minHeight: 'calc(var(--size) - (var(--group-gap) * 2 + 2px))',
      variants: [...groupedStateVariants],
    }),
  },
}

/* **********************************************************************
 * 🚀 Export
 * **********************************************************************/
export const toggleButton = {
  MuiToggleButton,
  MuiToggleButtonGroup,
}
