"use client";

import { createTheme } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface PaletteColor {
    lighter: string;
    darker: string;
  }
  interface SimplePaletteColorOptions {
    lighter?: string;
    darker?: string;
  }
}

const theme = createTheme({
  cssVariables: true,
  typography: {
    fontFamily: "var(--font-roboto)",
  },
  palette: {
    primary: {
      lighter: "#D6E4FE",
      light: "#6E9BFA",
      main: "#1868F8",
      dark: "#0E4BC0",
      darker: "#08307F",
      contrastText: "#FFFFFF",
    },
    background: {
      default: "#F8F9FA",
      paper: "#FFFFFF",
      hawkesBlue: "#D6E2FC",
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 500,
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarWidth: "thin",
        },
      },
    },
  },
});

export default theme;
