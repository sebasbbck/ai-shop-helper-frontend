import { chipClasses, ChipProps } from '@mui/material/Chip'
import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon'

import { colorKeys } from '../palette'
import { ComponentsVariants, Theme } from '@mui/material/styles'

// ----------------------------------------------------------------------

const baseColors = ['default']
const allColors = [...baseColors, ...colorKeys.palette, ...colorKeys.common]

const DIMENSIONS = {
  small: { borderRadius: '8px' },
  medium: { borderRadius: '10px' },
}

/* **********************************************************************
 * ♉️ Custom icons
 * **********************************************************************/
const DeleteIcon = (props: SvgIconProps) => (
  // https://icon-sets.iconify.design/solar/close-circle-bold/
  <SvgIcon {...props}>
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2s10 4.477 10 10M8.97 8.97a.75.75 0 0 1 1.06 0L12 10.94l1.97-1.97a.75.75 0 0 1 1.06 1.06L13.06 12l1.97 1.97a.75.75 0 0 1-1.06 1.06L12 13.06l-1.97 1.97a.75.75 0 0 1-1.06-1.06L10.94 12l-1.97-1.97a.75.75 0 0 1 0-1.06"
      clipRule="evenodd"
    />
  </SvgIcon>
)

/* **********************************************************************
 * 🗳️ Variants
 * **********************************************************************/
const filledVariants: ComponentsVariants<Theme>['MuiChip'] = [
  {
    props: (props) => props.variant === 'filled' && props.color === 'default',
    style: ({ theme }) => ({
      ...theme.mixins.filledStyles(theme, 'inherit'),
      [`&.${chipClasses.clickable}`]: {
        ...theme.mixins.filledStyles(theme, 'inherit', { hover: true }),
      },
    }),
  },
  ...colorKeys.common.map((colorKey) => ({
    props: (props: ChipProps) =>
      props.variant === 'filled' && props.color === colorKey,
    style: ({ theme }: { theme: Theme }) => ({
      ...theme.mixins.filledStyles(theme, colorKey),
      [`&.${chipClasses.clickable}`]: {
        ...theme.mixins.filledStyles(theme, colorKey, { hover: true }),
      },
    }),
  })),
]

const outlinedVariants: ComponentsVariants<Theme>['MuiChip'] = [
  {
    props: (props) => props.variant === 'outlined',
    style: {
      borderColor: 'currentColor',
    },
  },
  {
    props: (props) => props.variant === 'outlined' && props.color === 'default',
    style: ({ theme }) => ({
      borderColor: theme.vars.palette.shared.buttonOutlined,
    }),
  },
  ...colorKeys.common.map((colorKey) => ({
    props: (props: ChipProps) =>
      props.variant === 'outlined' && props.color === colorKey,
    style: ({ theme }: { theme: Theme }) => ({
      color: theme.vars.palette.common[colorKey],
    }),
  })),
]

const softVariants = [
  ...allColors.map((colorKey) => ({
    props: (props: ChipProps) =>
      props.variant === ('soft' as any) && props.color === colorKey,
    style: ({ theme }: { theme: Theme }) => {
      const currentColor = colorKey === 'default' ? 'inherit' : colorKey

      return {
        ...theme.mixins.softStyles(theme, currentColor),
        [`&.${chipClasses.clickable}`]: {
          ...theme.mixins.softStyles(theme, currentColor, { hover: true }),
        },
      }
    },
  })),
]

const avatarVariants: ComponentsVariants<Theme>['MuiChip'] = [
  ...colorKeys.common.map((colorKey) => ({
    props: (props: ChipProps) => props.color === colorKey,
    style: {
      color: 'inherit',
      backgroundColor: 'color-mix(in srgb, currentColor 24%, transparent)',
    },
  })),
  ...colorKeys.palette.map((colorKey) => ({
    props: (props: ChipProps) => props.color === colorKey,
    style: ({ theme }: { theme: Theme }) => ({
      color: theme.vars.palette[colorKey].lighter,
      backgroundColor: theme.vars.palette[colorKey].dark,
    }),
  })),
]

const sizeVariants = [
  {
    props: (props: ChipProps) => props.size === 'small',
    style: { ...DIMENSIONS.small },
  },
  {
    props: (props: ChipProps) => props.size === 'medium',
    style: { ...DIMENSIONS.medium },
  },
]

const disabledVariants = [
  {
    props: {},
    style: ({ theme }: { theme: Theme }) => ({
      [`&.${chipClasses.disabled}`]: {
        opacity: 1,
        color: theme.vars.palette.action.disabled,
        [`&:not(.${chipClasses.outlined})`]: {
          backgroundColor: theme.vars.palette.action.disabledBackground,
        },
        [`&.${chipClasses.outlined}`]: {
          borderColor: theme.vars.palette.action.disabledBackground,
        },
        [`& .${chipClasses.avatar}`]: {
          color: theme.vars.palette.action.disabled,
          backgroundColor: theme.vars.palette.action.disabledBackground,
          '& img': { opacity: theme.vars.palette.action.disabledOpacity },
        },
      },
    }),
  },
]

/* **********************************************************************
 * 🧩 Components
 * **********************************************************************/
const MuiChip = {
  // ▼▼▼▼▼▼▼▼ ⚙️ PROPS ▼▼▼▼▼▼▼▼
  defaultProps: {
    deleteIcon: <DeleteIcon />,
    variant: 'soft',
  },
  // ▼▼▼▼▼▼▼▼ 🎨 STYLE ▼▼▼▼▼▼▼▼
  styleOverrides: {
    root: {
      variants: [
        ...filledVariants,
        ...outlinedVariants,
        ...softVariants,
        ...sizeVariants,
        ...disabledVariants,
      ],
    },
    label: ({ theme }: { theme: Theme }) => ({
      fontWeight: theme.typography.fontWeightMedium,
    }),
    avatar: {
      variants: [...avatarVariants],
    },
    icon: {
      color: 'currentColor',
    },
    deleteIcon: {
      opacity: 0.48,
      color: 'currentColor',
      '&:hover': {
        opacity: 0.8,
        color: 'currentColor',
      },
    },
  },
}

/* **********************************************************************
 * 🚀 Export
 * **********************************************************************/
export const chip = {
  MuiChip,
}
