import SvgIcon from '@mui/material/SvgIcon'
import {
  defaultSettings,
  useSettingsContext,
} from '../../../../components/settings'
import {
  FontFamilyOptions,
  FontSizeOptions,
} from '../../../../components/settings/drawer/font-options'
import {
  LargeBlock,
  SmallBlock,
} from '../../../../components/settings/drawer/styles'
import { themeConfig } from '../../../../theme'
import { settingIcons } from '../../../../components/settings/drawer/icons'
import { useColorScheme } from '@mui/material/styles'
import { useEffect } from 'react'

export function FontSettings({ t, showFontFamily, showFontSize }) {
  const settings = useSettingsContext()
  const { mode, setMode, colorScheme } = useColorScheme()

  useEffect(() => {
    if (mode !== undefined && mode !== settings.state.mode) {
      settings.setState({ mode })
    }
  }, [mode, settings])

  return (
    <LargeBlock title={t('settings.appearance.font')} sx={{ gap: 2.5 }}>
      {showFontFamily && (
        <SmallBlock
          label={t('settings.appearance.family')}
          canReset={settings.state.fontFamily !== defaultSettings.fontFamily}
          onReset={() => {
            settings.setState({ fontFamily: defaultSettings.fontFamily })
          }}
        >
          <FontFamilyOptions
            value={settings.state.fontFamily}
            onChangeOption={(newOption) => {
              settings.setState({ fontFamily: newOption })
            }}
            options={[themeConfig.fontFamily.primary, 'DM Sans Variable']}
            icon={
              <SvgIcon sx={{ width: 28, height: 28 }}>
                {settingIcons.font}
              </SvgIcon>
            }
          />
        </SmallBlock>
      )}
      {showFontSize && (
        <SmallBlock
          label={t('settings.appearance.size')}
          canReset={settings.state.fontSize !== defaultSettings.fontSize}
          onReset={() => {
            settings.setState({ fontSize: defaultSettings.fontSize })
          }}
          sx={{ gap: 5 }}
        >
          <FontSizeOptions
            options={[12, 24]}
            value={settings.state.fontSize}
            onChangeOption={(newOption) => {
              settings.setState({ fontSize: newOption })
            }}
          />
        </SmallBlock>
      )}
    </LargeBlock>
  )
}
