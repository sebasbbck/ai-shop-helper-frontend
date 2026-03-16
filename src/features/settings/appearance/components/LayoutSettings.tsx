import { useEffect } from 'react'
import { BaseOption } from '../../../../components/settings/drawer/base-option'
import {
  defaultSettings,
  useSettingsContext,
} from '../../../../components/settings'
import { useColorScheme } from '@mui/material/styles'
import { settingIcons } from '../../../../components/settings/drawer/icons'
import SvgIcon from '@mui/material/SvgIcon'
import {
  LargeBlock,
  SmallBlock,
} from '../../../../components/settings/drawer/styles'
import { NavColorOptions } from '../../../../components/settings/drawer/nav-layout-option'

export function CompactLayoutSettings({ t }) {
  const settings = useSettingsContext()
  const { mode, setMode, colorScheme } = useColorScheme()

  useEffect(() => {
    if (mode !== undefined && mode !== settings.state.mode) {
      settings.setState({ mode })
    }
  }, [mode, settings])

  return (
    <BaseOption
      tooltip={t('settings.appearance.compact_tooltip')}
      label={t('settings.appearance.compact')}
      selected={!!settings.state.compactLayout}
      icon={<SvgIcon>{settingIcons.autofitWidth}</SvgIcon>}
      onChangeOption={() => {
        settings.setState({ compactLayout: !settings.state.compactLayout })
      }}
    />
  )
}

export function NavLayoutSettings({ t }) {
  const settings = useSettingsContext()
  const { mode, setMode, colorScheme } = useColorScheme()

  useEffect(() => {
    if (mode !== undefined && mode !== settings.state.mode) {
      settings.setState({ mode })
    }
  }, [mode, settings])

  return (
    <LargeBlock title={t('settings.appearance.sidebar')} sx={{ gap: 2.5 }}>
      <SmallBlock
        label={t('settings.appearance.style')}
        canReset={settings.state.navColor !== defaultSettings.navColor}
        onReset={() => {
          settings.setState({ navColor: defaultSettings.navColor })
        }}
      >
        <NavColorOptions
          value={settings.state.navColor}
          onChangeOption={(newOption) => {
            settings.setState({ navColor: newOption })
          }}
          options={[
            {
              label: t('settings.appearance.integrate'),
              value: 'integrate',
              icon: <SvgIcon>{settingIcons.sidebarOutline}</SvgIcon>,
            },
            {
              label: t('settings.appearance.apparent'),
              value: 'apparent',
              icon: <SvgIcon>{settingIcons.sidebarFill}</SvgIcon>,
            },
          ]}
        />
      </SmallBlock>
    </LargeBlock>
  )
}
