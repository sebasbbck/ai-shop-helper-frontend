// ----------------------------------------------------------------------

import { Components, Theme } from "@mui/material/styles"

const MuiMenuItem: Components<Theme>["MuiMenu"] = {
  // ▼▼▼▼▼▼▼▼ 🎨 STYLE ▼▼▼▼▼▼▼▼
  styleOverrides: {
    root: ({ theme }) => ({
      ...theme.mixins.menuItemStyles(theme),
    }),
  },
}

/* **********************************************************************
 * 🚀 Export
 * **********************************************************************/
export const menu = {
  MuiMenuItem,
}
