import { SvgIcon, useColorScheme } from '@mui/material'
import { Label } from '../../../../components/label'
import { BaseOption } from '../../../../components/settings/drawer/base-option'
import { settingIcons } from '../../../../components/settings/drawer/icons'
import { useEffect } from 'react'
import { useSettingsContext } from '../../../../components/settings'

export function ModeSettings({ t }) {
  const settings = useSettingsContext()
  const { mode, setMode, colorScheme } = useColorScheme()

  useEffect(() => {
    if (mode !== undefined && mode !== settings.state.mode) {
      settings.setState({ mode })
    }
  }, [mode, settings])

  return (
    <BaseOption
      label={t('settings.appearance.dark_mode')}
      selected={settings.state.mode === 'dark'}
      icon={<SvgIcon>{settingIcons.moon}</SvgIcon>}
      action={
        mode === 'system' ? (
          <Label
            sx={{
              height: 20,
              cursor: 'inherit',
              borderRadius: '20px',
              fontWeight: 'fontWeightSemiBold',
            }}
          >
            {t('settings.appearance.system')}
          </Label>
        ) : null
      }
      onChangeOption={() => {
        setMode(colorScheme === 'light' ? 'dark' : 'light')
        settings.setState({ mode: colorScheme === 'light' ? 'dark' : 'light' })
      }}
    />
  )
}
