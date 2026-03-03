import Alert from "@mui/material/Alert"

import Box from "@mui/material/Box"
import Link from "@mui/material/Link"
import { merge } from "es-toolkit"
import NextLink from "next/link"
import { HeaderSection, LayoutSection, MainSection } from "../core"
import { SimpleCompactContent } from "./content"
import { LanguagePopover } from "../components/language-popover"
import { Breakpoint, SxProps, Theme } from "@mui/material"
import { useTranslation } from "next-i18next"

// ----------------------------------------------------------------------

interface SimpleLayoutProps {
  sx?: SxProps<Theme>
  children: React.ReactNode
  className?: string
  layoutQuery?: Breakpoint
  slotProps?: {
    header?: any
    main?: any
    nav?: any
    [key: string]: any
  }
  [key: string]: any
}

export function SimpleLayout({
  sx,
  cssVars,
  children,
  slotProps,
  layoutQuery = "md",
}: SimpleLayoutProps) {
  const { t } = useTranslation('translation')

  const renderHeader = () => {
    const headerSlotProps = { container: { maxWidth: false } }

    const headerSlots = {
      topArea: (
        <Alert severity="info" sx={{ display: "none", borderRadius: 0 }}>
          This is an info Alert.
        </Alert>
      ),
      leftArea: <img src="/assets/images/ai-shop-helper-logo-recortado.png" alt="Logo" style={{ maxWidth: "40px" }} />,
      rightArea: (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: { xs: 1, sm: 1.5 },
          }}
        >
          {/** @slot Help link */}
          <Link
            href={t("translation:layout.faqs_link")}
            component={NextLink}
            color="inherit"
            sx={{ typography: "subtitle2" }}
          >
            {t("translation:layout.help")}
          </Link>

          {/** @slot Language popover */}
          <LanguagePopover
            data={[
              { value: 'en', label: 'English', countryCode: 'GB' },
              { value: 'es', label: 'Español', countryCode: 'ES' },
              { value: 'fr', label: 'Français', countryCode: 'FR' },
              { value: 'pt', label: 'Português', countryCode: 'PT' },
              { value: 'de', label: 'Deutsch', countryCode: 'DE' },
            ]}
          />
        </Box>
      ),
    }

    return (
      <HeaderSection
        layoutQuery={layoutQuery}
        {...slotProps?.header}
        slots={{ ...headerSlots, ...slotProps?.header?.slots }}
        slotProps={merge(headerSlotProps, slotProps?.header?.slotProps ?? {})}
        sx={slotProps?.header?.sx}
      />
    )
  }

  const renderFooter = () => null

  const renderMain = () => {
    const { compact, ...restContentProps } = slotProps?.content ?? {}

    return (
      <MainSection {...slotProps?.main}>
        {compact ? (
          <SimpleCompactContent layoutQuery={layoutQuery} {...restContentProps}>
            {children}
          </SimpleCompactContent>
        ) : (
          children
        )}
      </MainSection>
    )
  }

  return (
    <LayoutSection
      /** **************************************
       * @Header
       *************************************** */
      headerSection={renderHeader()}
      /** **************************************
       * @Footer
       *************************************** */
      footerSection={renderFooter()}
      /** **************************************
       * @Styles
       *************************************** */
      cssVars={{ "--layout-simple-content-compact-width": "448px", ...cssVars }}
      sx={sx}
    >
      {renderMain()}
    </LayoutSection>
  )
}
