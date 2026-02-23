import '@mui/material/styles'
import { varAlpha } from "minimal-shared/utils"
import { bgBlur, bgGradient } from "./background"
import { borderGradient } from "./border"
import {
  filledStyles,
  menuItemStyles,
  paperStyles,
  softStyles,
} from "./global-styles-components"
import { maxLine, textGradient } from "./text"

declare module '@mui/material/styles' {
  // This adds the .vars property to the theme object
  interface Theme {
    vars: ThemeVars
  }

  // This adds the 'Channel' keys to colors like grey, primary, etc.
  interface Color {
    '50Channel': string
    '100Channel': string
    '200Channel': string
    '300Channel': string
    '400Channel': string
    '500Channel': string
    '600Channel': string
    '700Channel': string
    '800Channel': string
    '900Channel': string
  }

  // This adds 'mainChannel', 'lightChannel', etc. to primary, secondary...
  interface PaletteColor {
    mainChannel: string
    lightChannel: string
    darkChannel: string
    contrastTextChannel: string
  }

  interface Mixins {
    paperStyles: (theme: Theme, options?: { dropdown?: boolean }) => any;
    menuItemStyles: (theme: Theme) => any;
    hideScrollX: React.CSSProperties;
    hideScrollY: React.CSSProperties;
    scrollbarStyles: (theme: Theme) => any;
    bgBlur,
    maxLine,
    bgGradient,
    softStyles,
    paperStyles,
    textGradient,
    filledStyles,
    borderGradient,
    menuItemStyles,
  }
}