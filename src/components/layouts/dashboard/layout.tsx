import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import { Breakpoint, SxProps, Theme, useTheme } from '@mui/material/styles'
import { merge } from 'es-toolkit'
import { useBoolean } from 'minimal-shared/hooks'

import { useSettingsContext } from '../../../components/settings'
import useAuth from '../../../hooks/useAuth'
import { AccountDrawer } from '../components/account-drawer'
import { MenuButton } from '../components/menu-button'
import {
  HeaderSection,
  LayoutSection,
  layoutClasses,
  MainSection,
} from '../core'
import { _account } from '../nav-config-account'
import { navData as dashboardNavData } from '../nav-config-dashboard'
import { dashboardLayoutVars, dashboardNavColorVars } from './css-vars'
import { NavMobile } from './nav-mobile'
import { NavVertical } from './nav-vertical'
// import { ProjectsPopover } from '../../../components/projects-popover';
import { LanguagePopover } from '../components/language-popover'
import { UserPublic } from '../../../../api/model'
// ----------------------------------------------------------------------

interface DashboardLayoutProps {
  sx?: SxProps<Theme>
  cssVars?: object
  children: React.ReactNode
  slotProps?: {
    header?: any
    main?: any
    nav?: any
    [key: string]: any
  }
  layoutQuery?: string
  [key: string]: any
}

export function DashboardLayout({
  sx,
  cssVars,
  children,
  slotProps,
  layoutQuery = 'lg',
}: DashboardLayoutProps) {
  const theme = useTheme()

  const { user } = useAuth()

  const settings = useSettingsContext()

  const navVars = dashboardNavColorVars(
    theme,
    settings.state.navColor,
    settings.state.navLayout,
  )

  const { value: open, onFalse: onClose, onTrue: onOpen } = useBoolean()

  const navData = slotProps?.nav?.data ?? dashboardNavData
  const filtered = navData.map((section: { items: any[] }) => ({
    ...section,
    items: section.items.filter(
      (item: { visible: (arg0: UserPublic | null | undefined) => any }) =>
        typeof item.visible === 'function' ? item.visible(user) : true,
    ),
  }))

  const isNavMini = settings.state.navLayout === 'mini'
  const isNavVertical = isNavMini || settings.state.navLayout === 'vertical'

  // const canDisplayItemByRole = (allowedRoles: string | any[]) =>
  //  !allowedRoles?.includes(user?.role)

  const renderHeader = () => {
    const headerSlotProps = {
      container: {
        maxWidth: false,
        sx: {
          ...(isNavVertical && { px: { [layoutQuery]: 5 } }),
        },
      },
    }

    const headerSlots = {
      topArea: (
        <Alert severity="info" sx={{ display: 'none', borderRadius: 0 }}>
          This is an info Alert.
        </Alert>
      ),
      bottomArea: null,
      leftArea: (
        <>
          {/** @slot Nav mobile */}
          <MenuButton
            onClick={onOpen}
            sx={{
              mr: 1,
              ml: -1,
              [theme.breakpoints.up(layoutQuery as Breakpoint)]: {
                display: 'none',
              },
            }}
          />
          <NavMobile
            data={filtered}
            open={open}
            onClose={onClose}
            cssVars={navVars.section}
            // checkPermissions={canDisplayItemByRole}
          />

          {/** @slot Projects popover */}
          {/* <ProjectsPopover /> */}
        </>
      ),
      rightArea: (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: { xs: 0, sm: 0.75 },
          }}
        >
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

          {/** @slot Settings button (temporarily disabled) */}
          {/* <SettingsButton /> */}

          {/** @slot Account drawer */}
          <AccountDrawer data={_account} />
        </Box>
      ),
    }

    return (
      <HeaderSection
        layoutQuery={layoutQuery as Breakpoint}
        disableElevation={isNavVertical}
        {...slotProps?.header}
        slots={{ ...headerSlots, ...slotProps?.header?.slots }}
        slotProps={merge(headerSlotProps, slotProps?.header?.slotProps ?? {})}
        sx={slotProps?.header?.sx}
      />
    )
  }

  const renderSidebar = () => (
    <NavVertical
      data={filtered}
      isNavMini={isNavMini}
      layoutQuery={layoutQuery as Breakpoint}
      cssVars={navVars.section}
      // checkPermissions={canDisplayItemByRole}
      onToggleNav={() =>
        settings.setField(
          'navLayout',
          settings.state.navLayout === 'vertical' ? 'mini' : 'vertical',
        )
      }
    />
  )

  const renderFooter = () => null

  const renderMain = () => (
    <MainSection {...slotProps?.main}>{children}</MainSection>
  )

  return (
    <LayoutSection
      /** **************************************
       * @Header
       *************************************** */
      headerSection={renderHeader()}
      /** **************************************
       * @Sidebar
       *************************************** */
      sidebarSection={renderSidebar()}
      /** **************************************
       * @Footer
       *************************************** */
      footerSection={renderFooter()}
      /** **************************************
       * @Styles
       *************************************** */
      cssVars={{ ...dashboardLayoutVars(theme), ...navVars.layout, ...cssVars }}
      sx={[
        {
          [`& .${layoutClasses.sidebarContainer}`]: {
            [theme.breakpoints.up(layoutQuery as Breakpoint)]: {
              pl: isNavMini
                ? 'var(--layout-nav-mini-width)'
                : 'var(--layout-nav-vertical-width)',
              transition: theme.transitions.create(['padding-left'], {
                easing: 'var(--layout-transition-easing)',
                duration: 'var(--layout-transition-duration)',
              }),
            },
          },
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {renderMain()}
    </LayoutSection>
  )
}
