import {
  createTheme as createMuiTheme,
  ThemeOptions,
  Direction,
} from '@mui/material/styles'
import { components } from './core/components'
import { customShadows } from './core/custom-shadows'
import { mixins } from './core/mixins'
import { opacity } from './core/opacity'
import { palette } from './core/palette'
import { shadows } from './core/shadows'
import { typography } from './core/typography'
import { themeConfig } from './theme-config'
import {
  applySettingsToComponents,
  applySettingsToTheme,
} from './with-settings'

// ----------------------------------------------------------------------

export const baseTheme = {
  colorSchemes: {
    light: {
      palette: palette.light,
      shadows: shadows.light,
      customShadows: customShadows.light,
      opacity,
    },
    dark: {
      palette: palette.dark,
      shadows: shadows.dark,
      customShadows: customShadows.dark,
      opacity,
    },
  },
  mixins,
  components,
  typography,
  shape: { borderRadius: 8 },
  direction: themeConfig.direction as Direction,
  cssVariables: themeConfig.cssVariables,
}

// ----------------------------------------------------------------------

interface CreateThemeOptions {
  settingsState?: any
  themeOverrides?: ThemeOptions
  localeComponents?: ThemeOptions
}

export function createTheme({
  settingsState,
  themeOverrides = {},
  localeComponents = {},
}: CreateThemeOptions = {}) {
  // Update core theme settings (colorSchemes, typography, etc.)
  const updatedCore = settingsState
    ? applySettingsToTheme(baseTheme as any, settingsState)
    : baseTheme

  // Update component settings (only components)
  const updatedComponents = settingsState
    ? applySettingsToComponents(settingsState)
    : {}

  // Create and return the final theme
  const theme = createMuiTheme(
    updatedCore as ThemeOptions,
    updatedComponents as ThemeOptions,
    localeComponents as ThemeOptions,
    themeOverrides,
  )

  return theme
}
