import '@mui/material/Button'

declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    aishophelper: true
  }

  interface ButtonPropsVariantOverrides {
    soft: true
  }

  interface ButtonPropsSizeOverrides {
    xLarge: true
  }
}

declare module '@mui/material/ButtonGroup' {
  interface ButtonGroupPropsVariantOverrides {
    soft: true
  }
}

declare module '@mui/material/Tabs' {
  interface TabsPropsIndicatorColorOverrides {
    custom: true
    inherit: true
  }
}
