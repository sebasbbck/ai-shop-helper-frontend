import { listClasses } from '@mui/material/List'
import { Theme } from '@mui/material/styles'

// ----------------------------------------------------------------------

const MuiPopover = {
  // ▼▼▼▼▼▼▼▼ 🎨 STYLE ▼▼▼▼▼▼▼▼
  styleOverrides: {
    paper: ({ theme }: { theme: Theme }) => ({
      ...theme.mixins.paperStyles(theme, { dropdown: true }),
      [`& .${listClasses.root}`]: {
        paddingTop: 0,
        paddingBottom: 0,
      },
    }),
  },
}

/* **********************************************************************
 * 🚀 Export
 * **********************************************************************/
export const popover = {
  MuiPopover,
}
