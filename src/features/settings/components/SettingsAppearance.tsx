import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import {
  defaultSettings,
  useSettingsContext,
} from '../../../components/settings'
import { useColorScheme } from '@mui/material/styles'
import { useTranslation } from 'next-i18next'
import { hasKeys } from 'minimal-shared/utils'
import { FontSettings } from '../appearance/components/FontSettings'
import { SettingsHead } from '../appearance/components/SettingsHead'
import { ModeSettings } from '../appearance/components/ModeSettings'
import {
  CompactLayoutSettings,
  NavLayoutSettings,
} from '../appearance/components/LayoutSettings'
import { PresetsSettings } from '../appearance/components/PresetsSettings'

export function SettingsAppearance() {
  const settings = useSettingsContext() as any
  const { mode, setMode, colorScheme } = useColorScheme()
  const { t } = useTranslation()

  const visibility = {
    mode: hasKeys(defaultSettings, ['mode']),
    navColor: hasKeys(defaultSettings, ['navColor']),
    fontSize: hasKeys(defaultSettings, ['fontSize']),
    fontFamily: hasKeys(defaultSettings, ['fontFamily']),
    primaryColor: hasKeys(defaultSettings, ['primaryColor']),
    compactLayout: hasKeys(defaultSettings, ['compactLayout']),
    navLayout: false,
  }

  return (
    <Card>
      <SettingsHead t={t} handleReset={undefined} />
      <Box
        sx={{
          pb: 5,
          gap: 6,
          px: 2.5,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box
          sx={{
            gap: 2,
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
          }}
        >
          {visibility.mode && <ModeSettings t={t} />}
          {visibility.compactLayout && <CompactLayoutSettings t={t} />}
        </Box>

        {(visibility.navColor || visibility.navLayout) && (
          <NavLayoutSettings t={t} />
        )}
        {visibility.primaryColor && <PresetsSettings t={t} />}
        {(visibility.fontFamily || visibility.fontSize) && (
          <FontSettings
            t={t}
            showFontFamily={visibility.fontFamily}
            showFontSize={visibility.fontSize}
          />
        )}
      </Box>
    </Card>
  )
}
