import { createTheme } from '@mui/material/styles'
import { varAlpha } from 'minimal-shared/utils'

import { common, grey } from './palette'

// ----------------------------------------------------------------------

function updateShadowColor(shadow: string, colorChannel: string) {
  return shadow.replace(/rgba\(\d+,\d+,\d+,(.*?)\)/g, (_, alpha) =>
    varAlpha(colorChannel, parseFloat(alpha)),
  )
}

function createShadows(colorChannel: string) {
  // Get default MUI shadows
  const { shadows: defaultShadows } = createTheme()

  return defaultShadows.map((shadow) => updateShadowColor(shadow, colorChannel))
}

/* **********************************************************************
 * 📦 Final
 * **********************************************************************/
export const shadows = {
  light: createShadows(grey['500Channel']),
  dark: createShadows(common.blackChannel),
}
