import { useTheme, SxProps, Theme } from '@mui/material/styles'
import { usePopoverHover } from 'minimal-shared/hooks'
import { isActiveLink, isExternalLink } from 'minimal-shared/utils'
import { useCallback, useEffect, useRef } from 'react'
import { useTranslation } from 'next-i18next'

// import { usePathname } from "@/route-helpers/hooks"
import { NavDropdown, NavDropdownPaper, NavLi, NavUl } from '../components'
import { navSectionClasses } from '../styles'
import { NavItem } from './nav-item'
import { useRouter } from 'next/router'

// ----------------------------------------------------------------------

export interface NavItemData {
  title: string
  path: string
  icon?: React.ReactNode
  info?: React.ReactNode
  caption?: string
  disabled?: boolean
  deepMatch?: boolean
  allowedRoles?: string[]
  children?: NavItemData[]
}

interface NavListProps {
  data: NavItemData // Changed from any
  depth: number // Required in NavList
  render?: {
    navIcon?: Record<string, React.ReactNode>
    navInfo?: (value: any) => Record<string, React.ReactElement>
  }
  cssVars?: SxProps<Theme>
  slotProps?: {
    rootItem?: Record<string, any>
    subItem?: Record<string, any>
    dropdown?: {
      paper?: SxProps<Theme>
    }
  }
  checkPermissions?: (allowedRoles: string[]) => boolean
  enabledRootRedirect?: boolean
}

// ----------------------------------------------------------------------

export function NavList({
  data,
  depth,
  render,
  cssVars,
  slotProps,
  checkPermissions,
  enabledRootRedirect,
}: NavListProps) {
  const theme = useTheme()
  const { t } = useTranslation()
  const { pathname } = useRouter()

  const pathnameWithoutLocale = pathname.replace(
    /^\/(en|es|fr|de|pt)(\/|$)/,
    '/',
  )
  const navItemPathWithoutLocale = data.path.replace(/^\/\$lang/, '') || '/'

  const isActive = isActiveLink(
    pathnameWithoutLocale,
    navItemPathWithoutLocale,
    data.deepMatch ?? !!data.children,
  )

  const {
    open,
    onOpen,
    onClose,
    anchorEl,
    elementRef: navItemRef,
  } = usePopoverHover()

  // Type for browser timeout
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  )

  const isRtl = theme.direction === 'rtl'
  const id = open ? `${data.title}-popover` : undefined

  useEffect(() => {
    if (open) onClose()
  }, [pathname, onClose])

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current)
      }
    }
  }, [])

  const handleOpenMenu = useCallback(() => {
    if (data.children) {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current)
        closeTimerRef.current = undefined
      }
      onOpen()
    }
  }, [data.children, onOpen])

  const handleCloseMenu = useCallback(() => {
    if (data.children) {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current)
      closeTimerRef.current = setTimeout(() => {
        onClose()
        closeTimerRef.current = undefined
      }, 150)
    }
  }, [data.children, onClose])

  const renderNavItem = () => (
    <NavItem
      ref={navItemRef as any}
      aria-describedby={id}
      path={data.path}
      icon={data.icon}
      info={data.info}
      title={t(data.title as any)}
      caption={data.caption ? t(data.caption as any) : undefined}
      active={isActive}
      open={open}
      disabled={data.disabled}
      depth={depth}
      render={render}
      hasChild={!!data.children}
      notificationCount={(data as any).notificationCount}
      externalLink={isExternalLink(data.path)}
      enabledRootRedirect={enabledRootRedirect}
      slotProps={depth === 1 ? slotProps?.rootItem : slotProps?.subItem}
      onMouseEnter={handleOpenMenu}
      onMouseLeave={handleCloseMenu}
    />
  )

  const renderDropdown = () => {
    if (!data.children) return null

    return (
      <NavDropdown
        aria-hidden={!open}
        id={id}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'center',
          horizontal: isRtl ? 'left' : 'right',
        }}
        transformOrigin={{
          vertical: 'center',
          horizontal: isRtl ? 'right' : 'left',
        }}
        slotProps={{
          paper: {
            onMouseEnter: handleOpenMenu,
            onMouseLeave: handleCloseMenu,
            className: navSectionClasses.dropdown.root,
          },
        }}
        sx={cssVars}
      >
        <NavDropdownPaper
          className={navSectionClasses.dropdown.paper}
          sx={slotProps?.dropdown?.paper}
        >
          <NavSubList
            data={data.children}
            depth={depth}
            render={render}
            cssVars={cssVars}
            slotProps={slotProps}
            checkPermissions={checkPermissions}
            enabledRootRedirect={enabledRootRedirect}
          />
        </NavDropdownPaper>
      </NavDropdown>
    )
  }

  // Logic for hiding items (corrected)
  if (
    data.allowedRoles &&
    checkPermissions &&
    !checkPermissions(data.allowedRoles)
  ) {
    return null
  }

  return (
    <NavLi disabled={data.disabled}>
      {renderNavItem()}
      {renderDropdown()}
    </NavLi>
  )
}

// ----------------------------------------------------------------------

interface NavSubListProps {
  data: NavItemData[]
  depth: number
  render?: {
    navIcon?: Record<string, React.ReactNode>
    navInfo?: (value: any) => Record<string, React.ReactElement>
  }
  cssVars?: SxProps<Theme>
  slotProps?: NavListProps['slotProps']
  checkPermissions?: NavListProps['checkPermissions']
  enabledRootRedirect?: boolean
}

function NavSubList({
  data,
  render,
  cssVars,
  depth,
  slotProps,
  checkPermissions,
  enabledRootRedirect,
}: NavSubListProps) {
  return (
    <NavUl sx={{ gap: 0.5 }}>
      {data.map((list) => (
        <NavList
          key={list.title}
          data={list}
          render={render}
          depth={depth + 1}
          cssVars={cssVars}
          slotProps={slotProps}
          checkPermissions={checkPermissions}
          enabledRootRedirect={enabledRootRedirect}
        />
      ))}
    </NavUl>
  )
}
