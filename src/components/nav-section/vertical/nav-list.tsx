import { useBoolean } from 'minimal-shared/hooks'
import { isActiveLink, isExternalLink } from 'minimal-shared/utils'
import { useEffect, useRef } from 'react'

// import { usePathname } from "@/route-helpers/hooks"
import useAuth from '../../../hooks/useAuth'
import { NavCollapse, NavLi, NavUl } from '../components'
import { navSectionClasses } from '../styles'
import { NavItem } from './nav-item'
import { useTranslation } from 'next-i18next'
import { SxProps, Theme } from '@mui/material/styles'
import { useRouter } from 'next/router'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

// ----------------------------------------------------------------------

interface NavListProps {
  data: any
  depth: number
  render?: {
    navIcon?: Record<string, React.ReactNode>
    navInfo?: (value: any) => Record<string, React.ReactElement>
  }
  slotProps?: {
    rootItem?: {
      sx?: SxProps<Theme>
      icon?: SxProps<Theme>
      title?: SxProps<Theme>
      caption?: SxProps<Theme>
      info?: SxProps<Theme>
      arrow?: SxProps<Theme>
      texts?: SxProps<Theme>
    }
    subItem?: {
      sx?: SxProps<Theme>
      icon?: SxProps<Theme>
      title?: SxProps<Theme>
      caption?: SxProps<Theme>
      info?: SxProps<Theme>
      arrow?: SxProps<Theme>
      texts?: SxProps<Theme>
    }
  }
  checkPermissions?: (allowedRoles: string[]) => boolean
  enabledRootRedirect?: boolean
}

export function NavList({
  data,
  depth,
  render,
  slotProps,
  checkPermissions,
  enabledRootRedirect,
}: NavListProps) {
  const { pathname } = useRouter()
  const navItemRef = useRef(null)

  const { user } = useAuth()
  const { t } = useTranslation()

  // strip the locale (/en or /es) from the browser URL
  const pathnameWithoutLocale = pathname.replace(
    /^\/(en|es|fr|de|pt)(\/|$)/,
    '/',
  )
  // strip the /$lang variable from the sidebar data path
  const navItemPathWithoutLocale = data.path.replace(/^\/\$lang/, '') || '/'

  const isActive = isActiveLink(
    pathnameWithoutLocale,
    navItemPathWithoutLocale, // use the cleaned data path
    data.deepMatch ?? !!data.children,
  )

  const { value: open, onFalse: onClose, onToggle } = useBoolean(isActive)

  useEffect(() => {
    if (!isActive) {
      onClose()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive, onClose])

  const renderNavItem = () => (
    <NavItem
      ref={navItemRef}
      // slots
      path={data.path}
      icon={data.icon}
      info={data.info}
      title={t(data.title)}
      caption={t(data.caption)}
      // state
      open={open}
      active={isActive}
      disabled={data.disabled}
      // options
      depth={depth}
      render={render}
      hasChild={!!data.children}
      notificationCount={data.notificationCount}
      externalLink={isExternalLink(data.path)}
      enabledRootRedirect={enabledRootRedirect}
      // styles
      slotProps={depth === 1 ? slotProps?.rootItem : slotProps?.subItem}
      // actions
      //
      onToggle={onToggle}
    />
  )

  const renderCollapse = () =>
    !!data.children && (
      <NavCollapse
        mountOnEnter
        unmountOnExit
        depth={depth}
        in={open}
        data-group={data.title}
      >
        <NavSubList
          data={data.children}
          render={render}
          depth={depth}
          slotProps={slotProps}
          checkPermissions={checkPermissions}
          enabledRootRedirect={enabledRootRedirect}
        />
      </NavCollapse>
    )

  // Hidden item by role
  if (
    data.allowedRoles &&
    checkPermissions &&
    checkPermissions(data.allowedRoles)
  ) {
    return null
  }

  // Hidden item by visible function
  if (data.visible && !data.visible(user)) {
    return null
  }

  return (
    <NavLi
      disabled={data.disabled}
      sx={{
        ...(!!data.children && {
          [`& .${navSectionClasses.li}`]: {
            '&:first-of-type': { mt: 'var(--nav-item-gap)' },
          },
        }),
      }}
    >
      {renderNavItem()}
      {renderCollapse()}
    </NavLi>
  )
}

// ----------------------------------------------------------------------

interface NavSubListProps {
  data: any[]
  depth: number
  render?: {
    navIcon?: Record<string, React.ReactNode>
    navInfo?: (value: any) => Record<string, React.ReactElement>
  }
  slotProps?: {
    rootItem?: {
      sx?: SxProps<Theme>
      icon?: SxProps<Theme>
      title?: SxProps<Theme>
      caption?: SxProps<Theme>
      info?: SxProps<Theme>
      arrow?: SxProps<Theme>
      texts?: SxProps<Theme>
    }
    subItem?: {
      sx?: SxProps<Theme>
      icon?: SxProps<Theme>
      title?: SxProps<Theme>
      caption?: SxProps<Theme>
      info?: SxProps<Theme>
      arrow?: SxProps<Theme>
      texts?: SxProps<Theme>
    }
  }
  checkPermissions?: (allowedRoles: string[]) => boolean
  enabledRootRedirect?: boolean
}

function NavSubList({
  data,
  render,
  depth = 0,
  slotProps,
  checkPermissions,
  enabledRootRedirect,
}: NavSubListProps) {
  return (
    <NavUl sx={{ gap: 'var(--nav-item-gap)' }}>
      {data.map((list) => (
        <NavList
          key={list.title}
          data={list}
          render={render}
          depth={depth + 1}
          slotProps={slotProps}
          checkPermissions={checkPermissions}
          enabledRootRedirect={enabledRootRedirect}
        />
      ))}
    </NavUl>
  )
}
