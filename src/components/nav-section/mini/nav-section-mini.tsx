import { SxProps, Theme, useTheme } from '@mui/material/styles'
import { mergeClasses } from 'minimal-shared/utils'
import { Nav, NavLi, NavUl } from '../components'
import { navSectionClasses, navSectionCssVars } from '../styles'
import { NavList } from './nav-list-fix'

// ----------------------------------------------------------------------

interface NavSectionMiniProps {
  sx?: SxProps<Theme>
  data: Array<{
    subheader?: string
    items: Array<any>
  }>
  render?: {
    navIcon?: Record<string, React.ReactNode>
    navInfo?: (value: any) => Record<string, React.ReactElement>
  }
  className?: string
  slotProps?: {
    rootItem?: Record<string, any>
    subItem?: Record<string, any>
  }
  checkPermissions?: (allowedRoles: string[]) => boolean
  enabledRootRedirect?: boolean
  cssVars?: SxProps<Theme>
}

// ----------------------------------------------------------------------

export function NavSectionMini({
  sx,
  data,
  render,
  className,
  slotProps,
  checkPermissions,
  enabledRootRedirect,
  cssVars: overridesVars,
  ...other
}: NavSectionMiniProps) {
  const theme = useTheme()

  const cssVars = { ...navSectionCssVars.mini(theme), ...overridesVars }

  return (
    <Nav
      className={mergeClasses([navSectionClasses.mini, className])}
      sx={[{ ...cssVars }, ...(Array.isArray(sx) ? sx : [sx])]}
      {...other}
    >
      <NavUl sx={{ flex: '1 1 auto', gap: 'var(--nav-item-gap)' }}>
        {data.map((group) => (
          <Group
            key={group.subheader ?? group.items[0].title}
            render={render}
            cssVars={cssVars}
            items={group.items}
            slotProps={slotProps}
            checkPermissions={checkPermissions}
            enabledRootRedirect={enabledRootRedirect}
          />
        ))}
      </NavUl>
    </Nav>
  )
}

// ----------------------------------------------------------------------

interface GroupProps {
  items: Array<any>
  render?: {
    navIcon?: Record<string, React.ReactNode>
    navInfo?: (value: any) => Record<string, React.ReactElement>
  }
  cssVars?: SxProps<Theme>
  slotProps?: NavSectionMiniProps['slotProps']
  checkPermissions?: NavSectionMiniProps['checkPermissions']
  enabledRootRedirect?: boolean
}

function Group({
  items,
  render,
  cssVars,
  slotProps,
  checkPermissions,
  enabledRootRedirect,
}: GroupProps) {
  return (
    <NavLi>
      <NavUl sx={{ gap: 'var(--nav-item-gap)' }}>
        {items.map((list) => (
          <NavList
            key={list.title}
            depth={1}
            data={list}
            render={render}
            cssVars={cssVars}
            slotProps={slotProps}
            checkPermissions={checkPermissions}
            enabledRootRedirect={enabledRootRedirect}
          />
        ))}
      </NavUl>
    </NavLi>
  )
}
