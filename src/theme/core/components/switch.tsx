import { Components, ComponentsVariants, Theme } from '@mui/material/styles'
import { switchClasses } from '@mui/material/Switch'
import { varAlpha } from 'minimal-shared/utils'

// ----------------------------------------------------------------------

const DIMENSIONS = {
  small: { thumb: 10, track: 16, trackRadius: 8, translateX: '10px' },
  medium: { thumb: 14, track: 20, trackRadius: 10, translateX: '14px' },
}

/* **********************************************************************
 * 🗳️ Variants
 * **********************************************************************/
const colorVariants: ComponentsVariants<Theme>['MuiSwitch'] = [
  {
    props: (props) => props.color === 'default',
    style: ({ theme }) => ({
      [`&.${switchClasses.checked}`]: {
        [`& + .${switchClasses.track}`]: {
          backgroundColor: theme.vars.palette.text.primary,
        },
        [`& .${switchClasses.thumb}`]: {
          ...theme.applyStyles('dark', {
            color: theme.vars.palette.grey[800],
          }),
        },
      },
    }),
  },
]

const sizeVariants: ComponentsVariants<Theme>['MuiSwitch'] = [
  {
    props: (props) => props.size === 'small',
    style: {
      [`& .${switchClasses.switchBase}`]: {
        [`&.${switchClasses.checked}`]: {
          transform: `translateX(${DIMENSIONS.small.translateX})`,
        },
      },
      [`& .${switchClasses.thumb}`]: {
        width: DIMENSIONS.small.thumb,
        height: DIMENSIONS.small.thumb,
      },
      [`& .${switchClasses.track}`]: {
        height: DIMENSIONS.small.track,
        borderRadius: DIMENSIONS.small.trackRadius,
      },
    },
  },
]

const disabledVariants: ComponentsVariants<Theme>['MuiSwitch'] = [
  {
    props: {},
    style: ({ theme }) => ({
      [`&.${switchClasses.disabled}`]: {
        [`& + .${switchClasses.track}`]: {
          opacity: theme.vars.opacity.switchTrackDisabled,
        },
        [`& .${switchClasses.thumb}`]: {
          ...theme.applyStyles('dark', {
            opacity: theme.vars.opacity.switchTrackDisabled,
          }),
        },
      },
    }),
  },
]

const checkedVariants: ComponentsVariants<Theme>['MuiSwitch'] = [
  {
    props: {},
    style: ({ theme }) => ({
      [`& .${switchClasses.switchBase}.${switchClasses.checked}`]: {
        [`& + .${switchClasses.track}`]: {
          opacity: theme.vars.opacity.switchTrack,
        },
      },
    }),
  },
]

/* **********************************************************************
 * 🧩 Components
 * **********************************************************************/
const MuiSwitch: Components<Theme>['MuiSwitch'] = {
  // ▼▼▼▼▼▼▼▼ 🎨 STYLE ▼▼▼▼▼▼▼▼
  styleOverrides: {
    root: {
      alignItems: 'center',
    },
    switchBase: {
      top: 'auto',
      left: '6px',
      [`&.${switchClasses.checked}`]: {
        transform: `translateX(${DIMENSIONS.medium.translateX})`,
      },
    },
    thumb: ({ theme }) => ({
      width: DIMENSIONS.medium.thumb,
      height: DIMENSIONS.medium.thumb,
      color: theme.vars.palette.common.white,
    }),
    track: ({ theme }) => ({
      height: DIMENSIONS.medium.track,
      borderRadius: DIMENSIONS.medium.trackRadius,
      backgroundColor: varAlpha(theme.vars.palette.grey['500Channel'], 0.48),
    }),
  },
  // ✅ Variants are siblings to styleOverrides
  // We keep your variants exactly as they were written because they
  // already use selectors like `& .${switchClasses.switchBase}`
  variants: [
    ...sizeVariants,
    ...colorVariants,
    ...checkedVariants,
    ...disabledVariants,
  ],
}

/* **********************************************************************
 * 🚀 Export
 * **********************************************************************/
export const switches = {
  MuiSwitch,
}
