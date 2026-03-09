import Box from '@mui/material/Box'
import { Breakpoint, styled, SxProps, Theme } from '@mui/material/styles'
import { mergeClasses, varAlpha } from 'minimal-shared/utils'

import {
  NavSectionMini,
  NavSectionVertical,
} from '../../../components/nav-section'
import { Scrollbar } from '../../../components/scrollbar'
import { NavToggleButton } from '../components/nav-toggle-button'
import { layoutClasses } from '../core'
import { useRouter } from 'next/router'

// ----------------------------------------------------------------------

interface NavVerticalProps {
  sx?: SxProps<Theme>
  data: any[]
  isNavMini: boolean
  slots?: {
    topArea?: React.ReactNode
    bottomArea?: React.ReactNode
  }
  onClose?: () => void
  onToggleNav: () => void
  cssVars?: object
  layoutQuery?: Breakpoint
  className?: string
  checkPermissions?: (item: any) => boolean
  [key: string]: any
}

export function NavVertical({
  sx,
  data,
  slots,
  cssVars,
  className,
  isNavMini,
  onToggleNav,
  checkPermissions,
  layoutQuery = 'md',
  ...other
}: NavVerticalProps) {
  const router = useRouter()

  const renderNavVertical = () => (
    <>
      {slots?.topArea ?? (
        <Box sx={{ pl: 3.5, py: 2.5, display: 'flex', gap: 2 }}>
          <img
            src="/assets/images/ai-shop-helper-logo.png"
            alt="Logo"
            style={{ maxHeight: '23px', cursor: 'pointer' }}
            onClick={() => {
              router.push('/')
            }}
          />
          {/* <Label color="primary">v{CONFIG.appVersion}</Label> */}
        </Box>
      )}
      {/** Split incoming nav `data` into top and bottom groups so we can pin bottom items */}
      {(() => {
        const topSections = (data ?? [])
          .map((section) => ({
            ...section,
            items: (section.items ?? []).filter(
              (it: any) => it.position !== 'bottom',
            ),
          }))
          .filter((s) => (s.items ?? []).length > 0)

        const bottomItems = (data ?? []).flatMap((section) =>
          (section.items ?? []).filter((it: any) => it.position === 'bottom'),
        )

        return (
          <>
            <Scrollbar
              fillContent
              sx={undefined}
              ref={undefined}
              className={undefined}
              slotProps={undefined}
            >
              <NavSectionVertical
                data={topSections}
                cssVars={cssVars}
                checkPermissions={checkPermissions}
                sx={{ px: 2, flex: '1 1 auto' }}
                render={undefined}
                className={undefined}
                slotProps={undefined}
                enabledRootRedirect={undefined}
              />
            </Scrollbar>

            {bottomItems.length > 0 && (
              <Box sx={{ mt: 'auto', pb: 2.5, px: 2 }}>
                <NavSectionVertical
                  data={[{ items: bottomItems }]}
                  cssVars={cssVars}
                  checkPermissions={checkPermissions}
                  sx={undefined}
                  render={undefined}
                  className={undefined}
                  slotProps={undefined}
                  enabledRootRedirect={undefined}
                />
              </Box>
            )}
          </>
        )
      })()}
    </>
  )

  const renderNavMini = () => (
    <>
      {slots?.topArea ?? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 2.5 }}>
          <img
            src="/assets/images/ai-shop-helper-logo-recortado.png"
            alt="Logo"
            style={{ maxWidth: '40px', cursor: 'pointer' }}
            onClick={() => {
              router.push('/')
            }}
          />
        </Box>
      )}
      {(() => {
        const topSections = (data ?? [])
          .map((section) => ({
            ...section,
            items: (section.items ?? []).filter(
              (it: any) => it.position !== 'bottom',
            ),
          }))
          .filter((s) => (s.items ?? []).length > 0)

        const bottomItems = (data ?? []).flatMap((section) =>
          (section.items ?? []).filter((it: any) => it.position === 'bottom'),
        )

        return (
          <>
            <NavSectionMini
              data={topSections}
              cssVars={cssVars}
              checkPermissions={checkPermissions}
              sx={[
                (theme: any) => ({
                  ...theme.mixins.hideScrollY,
                  pb: 2,
                  px: 0.5,
                  flex: '1 1 auto',
                  overflowY: 'auto',
                }),
              ]}
              render={undefined}
              className={undefined}
              slotProps={undefined}
              enabledRootRedirect={undefined}
            />

            {bottomItems.length > 0 && (
              <Box sx={{ mt: 'auto', pb: 1, px: 0.5 }}>
                <NavSectionMini
                  data={[{ items: bottomItems }]}
                  cssVars={cssVars}
                  checkPermissions={checkPermissions}
                  sx={undefined}
                  render={undefined}
                  className={undefined}
                  slotProps={undefined}
                  enabledRootRedirect={undefined}
                />
              </Box>
            )}
          </>
        )
      })()}
    </>
  )

  // console.log("Nav data: " + JSON.stringify(data, null, 2))

  return (
    <NavRoot
      isNavMini={isNavMini}
      layoutQuery={layoutQuery}
      className={mergeClasses([
        layoutClasses.nav.root,
        layoutClasses.nav.vertical,
        className,
      ])}
      sx={sx}
      {...other}
    >
      <NavToggleButton
        isNavMini={isNavMini}
        onClick={onToggleNav}
        sx={[
          (theme) => ({
            display: 'none',
            [theme.breakpoints.up(layoutQuery)]: { display: 'inline-flex' },
          }),
        ]}
      />
      {isNavMini ? renderNavMini() : renderNavVertical()}
    </NavRoot>
  )
}

// ----------------------------------------------------------------------

interface NavRootProps {
  isNavMini: boolean
  layoutQuery?: Breakpoint
  sx?: SxProps<Theme>
  [key: string]: any
}

const NavRoot = styled('div', {
  shouldForwardProp: (prop) =>
    !['isNavMini', 'layoutQuery', 'sx'].includes(prop as string),
})<NavRootProps>(({ isNavMini, layoutQuery = 'md', theme }) => ({
  top: 0,
  left: 0,
  height: '100%',
  display: 'none',
  position: 'fixed',
  flexDirection: 'column',
  zIndex: 'var(--layout-nav-zIndex)',
  backgroundColor: 'var(--layout-nav-bg)',
  width: isNavMini
    ? 'var(--layout-nav-mini-width)'
    : 'var(--layout-nav-vertical-width)',
  borderRight: `1px solid var(--layout-nav-border-color, ${varAlpha(theme.vars.palette.grey['500Channel'], 0.12)})`,
  transition: theme.transitions.create(['width'], {
    easing: 'var(--layout-transition-easing)',
    duration: 'var(--layout-transition-duration)',
  }),
  [theme.breakpoints.up(layoutQuery)]: { display: 'flex' },
}))
