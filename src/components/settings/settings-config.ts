import { CONFIG } from '../../global-config'
import { themeConfig } from '../../theme/theme-config'

// ----------------------------------------------------------------------

export const SETTINGS_STORAGE_KEY = 'app-settings'

export const defaultSettings = {
  mode: themeConfig.defaultMode,
  direction: themeConfig.direction,
  contrast: 'default',
  navLayout: 'vertical',
  primaryColor: 'default',
  navColor: 'integrate',
  compactLayout: true,
  fontSize: 16,
  fontFamily: themeConfig.fontFamily.primary,
  version: CONFIG.appVersion,
}
