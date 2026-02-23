// ----------------------------------------------------------------------

import { PaperProps, Theme } from "@mui/material"

const MuiPaper = {
  // ▼▼▼▼▼▼▼▼ ⚙️ PROPS ▼▼▼▼▼▼▼▼
  defaultProps: {
    elevation: 0,
  },
  // ▼▼▼▼▼▼▼▼ 🎨 STYLE ▼▼▼▼▼▼▼▼
  styleOverrides: {
    root: {
      backgroundImage: "none",
      variants: [
        {
          props: (props: PaperProps) => props.variant === "outlined",
          style: ({ theme }: { theme: Theme }) => ({
            borderColor: theme.vars.palette.shared.paperOutlined,
          }),
        },
      ],
    },
  },
}

/* **********************************************************************
 * 🚀 Export
 * **********************************************************************/
export const paper = {
  MuiPaper,
}
