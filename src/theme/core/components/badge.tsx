import {
  Theme,
  Components,
  ComponentsVariants,
  CSSObject,
} from '@mui/material/styles'

// ----------------------------------------------------------------------

/* **********************************************************************
 * 🗳️ Variants
 * **********************************************************************/

const colorVariants: ComponentsVariants<Theme>['MuiBadge'] = [
  {
    props: (props: any) => props.color === 'default',
    style: ({ theme }): CSSObject => ({
      ...theme.mixins.filledStyles(theme, 'default'),
    }),
  },
]

const statusVariants: ComponentsVariants<Theme>['MuiBadge'] = [
  {
    props: (props: any) =>
      ['online', 'always', 'busy', 'offline'].includes(props.variant),
    style: ({ theme }): CSSObject => ({
      width: 10,
      height: 10,
      padding: 0,
      top: 'auto',
      right: '14%',
      bottom: '14%',
      minWidth: 'auto',
      transform: 'scale(1) translate(50%, 50%)',
      '&::before, &::after': {
        content: "''",
        borderRadius: 1,
        backgroundColor: theme.vars.palette.common.white,
      },
    }),
  },
  {
    props: (props: any) => props.variant === 'online',
    style: ({ theme }): CSSObject => ({
      backgroundColor: theme.vars.palette.success.main,
    }),
  },
  {
    props: (props: any) => props.variant === 'always',
    style: ({ theme }): CSSObject => ({
      backgroundColor: theme.vars.palette.warning.main,
      '&::before': { width: 2, height: 4, transform: 'translate(1px, -1px)' },
      '&::after': {
        width: 2,
        height: 4,
        transform: 'translate(0, 1px) rotate(125deg)',
      },
    }),
  },
  {
    props: (props: any) => props.variant === 'busy',
    style: ({ theme }): CSSObject => ({
      backgroundColor: theme.vars.palette.error.main,
      '&::before': { width: 6, height: 2 },
    }),
  },
  {
    props: (props: any) => props.variant === 'offline',
    style: ({ theme }): CSSObject => ({
      backgroundColor: theme.vars.palette.text.disabled,
      '&::before': { width: 6, height: 6, borderRadius: '50%' },
    }),
  },
  {
    props: (props: any) => props.variant === 'invisible',
    style: {
      display: 'none',
    } as CSSObject,
  },
]

/* **********************************************************************
 * 🧩 Components
 * **********************************************************************/

const MuiBadge: Components<Theme>['MuiBadge'] = {
  styleOverrides: {
    dot: { borderRadius: '50%' },
    badge: {
      // Cast the array to 'any' to bypass the complex Interpolation union type check
      variants: [...colorVariants, ...statusVariants] as any,
    },
  },
}

/* **********************************************************************
 * 🚀 Export
 * **********************************************************************/

export const badge = {
  MuiBadge,
}
