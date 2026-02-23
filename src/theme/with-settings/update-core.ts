import {
  createPaletteChannel,
  hexToRgbChannel,
  InputPalette,
  setFont,
} from "minimal-shared/utils"
import { createShadowColor } from "../core/custom-shadows"
import { primaryColorPresets } from "./color-presets"
import { ThemeOptions } from "@mui/material/styles"

// ----------------------------------------------------------------------

/**
 * Updates the core theme with the provided settings state.
 * @param theme - The base theme options to update.
 * @param settingsState - The settings state containing direction, fontFamily, contrast, and primaryColor.
 * @returns Updated theme options with applied settings.
 */

type PrimaryPresets = Record<string, InputPalette>

export function applySettingsToTheme(
  theme: ThemeOptions,
  settingsState: { 
    direction: 'rtl' | 'ltr'
    fontFamily: string
    contrast?: string
    primaryColor?: string 
  }
) {
  const {
    direction,
    fontFamily,
    contrast = "default",
    primaryColor = "default",
  } = settingsState ?? {}

  const isDefaultContrast = contrast === "default"
  const isDefaultPrimaryColor = primaryColor === "default"

  const lightPalette = (theme.colorSchemes?.light as any)?.palette

  const primaryColorPalette = createPaletteChannel(
    (primaryColorPresets as PrimaryPresets)[primaryColor],
  )
  // const secondaryColorPalette = createPaletteChannel(secondaryColorPresets[primaryColor]);

  const updateColorScheme = (schemeName: "light" | "dark") => {
    const currentScheme = theme.colorSchemes?.[schemeName]

    if (!currentScheme || typeof currentScheme === 'boolean') {
      return currentScheme
    }

    const updatedPalette = {
      ...currentScheme?.palette,
      ...(!isDefaultPrimaryColor && {
        primary: primaryColorPalette,
        // secondary: secondaryColorPalette,
      }),
      ...(schemeName === "light" && {
        background: {
          ...lightPalette?.background,
          ...(!isDefaultContrast && {
            default: lightPalette.grey[200],
            defaultChannel: hexToRgbChannel(lightPalette.grey[200]),
          }),
        },
      }),
    }

    const updatedCustomShadows = {
      ...(currentScheme as any).customShadows, // customShadows is a custom extension
      ...(!isDefaultPrimaryColor && {
        primary: createShadowColor(primaryColorPalette.mainChannel),
        // secondary: createShadowColor(secondaryColorPalette.mainChannel),
      }),
    }

    return {
      ...currentScheme,
      palette: updatedPalette,
      customShadows: updatedCustomShadows,
    }
  }

  return {
    ...theme,
    direction,
    colorSchemes: {
      light: updateColorScheme("light"),
      dark: updateColorScheme("dark"),
    },
    typography: {
      ...theme.typography,
      fontFamily: setFont(fontFamily),
    },
  }
}
