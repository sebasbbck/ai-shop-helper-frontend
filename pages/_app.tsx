import type { AppProps } from 'next/app'
import { appWithTranslation } from 'next-i18next'
import '../styles/globals.css'
import { themeConfig, ThemeProvider } from '../src/theme'
import { defaultSettings, SettingsProvider } from '../src/components/settings'
import { MUIToaster } from '../src/components/ui/mui-toaster'
import { Backdropper } from '../src/hooks/useBackdrop'
import { MotionLazy } from '../src/components/animate/motion-lazy'
import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import path from 'path'
import nextI18NextConfig from '../next-i18next.config'

const queryClient = new QueryClient({
  queryCache: new QueryCache(),
  mutationCache: new MutationCache(),
})

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SettingsProvider defaultSettings={defaultSettings}>
      <ThemeProvider
        modeStorageKey={themeConfig.modeStorageKey}
        defaultMode={themeConfig.defaultMode}
      >
        <MotionLazy>
          <QueryClientProvider client={queryClient}>
            <MUIToaster />
            <Backdropper />
            <Component {...pageProps} />
          </QueryClientProvider>
        </MotionLazy>
      </ThemeProvider>
    </SettingsProvider>
  )
}

export default appWithTranslation(MyApp, nextI18NextConfig)
