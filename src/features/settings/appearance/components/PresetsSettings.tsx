import { SvgIcon, useColorScheme } from '@mui/material'
import { PresetsOptions } from '../../../../components/settings/drawer/presets-options'
import { LargeBlock } from '../../../../components/settings/drawer/styles'
import { settingIcons } from '../../../../components/settings/drawer/icons'
import { primaryColorPresets } from '../../../../theme/with-settings/color-presets'
import { useEffect } from 'react'
import {
  defaultSettings,
  useSettingsContext,
} from '../../../../components/settings'

export function PresetsSettings({ t }) {
  const settings = useSettingsContext()
  const { mode, setMode, colorScheme } = useColorScheme()

  useEffect(() => {
    if (mode !== undefined && mode !== settings.state.mode) {
      settings.setState({ mode })
    }
  }, [mode, settings])

  return (
    <LargeBlock
      title={t('settings.appearance.presets')}
      canReset={settings.state.primaryColor !== defaultSettings.primaryColor}
      onReset={() => {
        settings.setState({ primaryColor: defaultSettings.primaryColor })
      }}
    >
      <PresetsOptions
        icon={
          <SvgIcon sx={{ width: 28, height: 28 }}>
            {settingIcons.siderbarDuotone}
          </SvgIcon>
        }
        options={Object.keys(primaryColorPresets).map((key) => {
          const presetKey = key as keyof typeof primaryColorPresets
          const preset = primaryColorPresets[presetKey]

          return {
            name: key,
            value: preset.main,
            icon:
              key === 'preset5'
                ? settingIcons.die
                : settingIcons.siderbarDuotone,
            tooltip:
              key === 'preset5' ? t('settings.appearance.random') : undefined,
          }
        })}
        value={settings.state.primaryColor}
        onChangeOption={(newOption) => {
          settings.setState({ primaryColor: newOption })
        }}
      />
    </LargeBlock>
  )
}
