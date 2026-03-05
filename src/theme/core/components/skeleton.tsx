import { Theme } from '@mui/material/styles'
import { varAlpha } from 'minimal-shared/utils'

// ----------------------------------------------------------------------

const MuiSkeleton = {
  // ▼▼▼▼▼▼▼▼ ⚙️ PROPS ▼▼▼▼▼▼▼▼
  defaultProps: {
    animation: 'wave',
    variant: 'rounded',
  },
  // ▼▼▼▼▼▼▼▼ 🎨 STYLE ▼▼▼▼▼▼▼▼
  styleOverrides: {
    root: ({ theme }: { theme: Theme }) => ({
      backgroundColor: varAlpha(theme.vars.palette.grey['400Channel'], 0.12),
    }),
    rounded: ({ theme }: { theme: Theme }) => ({
      borderRadius: Number(theme.shape.borderRadius) * 2,
    }),
  },
}

/* **********************************************************************
 * 🚀 Export
 * **********************************************************************/
export const skeleton = {
  MuiSkeleton,
}
