import type { AppProps } from "next/app";
import { appWithTranslation } from 'next-i18next';
import "../styles/globals.css";
import { themeConfig, ThemeProvider } from "../src/theme";
import { defaultSettings, SettingsProvider } from "../src/components/settings";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SettingsProvider defaultSettings={defaultSettings}>
      <ThemeProvider
        modeStorageKey={themeConfig.modeStorageKey}
        defaultMode={themeConfig.defaultMode}
      >
        <Component {...pageProps} />
      </ThemeProvider>
    </SettingsProvider>
  );
}

export default appWithTranslation(MyApp);