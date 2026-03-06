import { Theme } from '@mui/material/styles'
import { parseCssVar } from 'minimal-shared/utils'

// ----------------------------------------------------------------------

const MuiTooltip = {
  // ▼▼▼▼▼▼▼▼ ⚙️ PROPS ▼▼▼▼▼▼▼▼
  defaultProps: {
    slotProps: {
      popper: {
        modifiers: [
          {
            name: 'offset',
            options: {
              offset: [0, -4],
            },
          },
        ],
      },
    },
  },
  // ▼▼▼▼▼▼▼▼ 🎨 STYLE ▼▼▼▼▼▼▼▼
  styleOverrides: {
    tooltip: ({ theme }: { theme: Theme }) => ({
      borderRadius: Number(theme.shape.borderRadius) * 0.75,
      [parseCssVar(theme.vars.palette.Tooltip.bg)]:
        theme.vars.palette.grey[800],
      ...theme.applyStyles('dark', {
        [parseCssVar(theme.vars.palette.Tooltip.bg)]:
          theme.vars.palette.grey[700],
      }),
    }),
  },
}

/* **********************************************************************
 * 🚀 Export
 * **********************************************************************/
export const tooltip = {
  MuiTooltip,
}
