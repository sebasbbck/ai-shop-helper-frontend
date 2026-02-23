// ----------------------------------------------------------------------

import { Theme } from "@mui/material/styles"

const MuiTreeItem = {
  // ▼▼▼▼▼▼▼▼ 🎨 STYLE ▼▼▼▼▼▼▼▼
  styleOverrides: {
    label: ({ theme }: { theme: Theme }) => ({
      ...theme.typography.body2,
    }),
    iconContainer: {
      width: 18,
    },
  },
}

/* **********************************************************************
 * 🚀 Export
 * **********************************************************************/
export const treeView = {
  MuiTreeItem,
}
