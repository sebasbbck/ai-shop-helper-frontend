import { cardClasses } from '@mui/material/Card'

// ----------------------------------------------------------------------

export function applySettingsToComponents(settingsState: {
  fontSize: any
  contrast: string
}) {
  const MuiCssBaseline = {
    styleOverrides: (theme: { vars: { customShadows: { z1: any } } }) => ({
      html: {
        fontSize: settingsState?.fontSize,
      },
      body: {
        [`& .${cardClasses.root}`]: {
          ...(settingsState?.contrast === 'high' && {
            '--card-shadow': theme.vars.customShadows.z1,
          }),
        },
      },
    }),
  }

  return {
    components: {
      MuiCssBaseline,
    },
  }
}
