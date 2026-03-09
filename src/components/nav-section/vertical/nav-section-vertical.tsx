import Collapse from '@mui/material/Collapse'
import { SxProps, Theme, useTheme } from '@mui/material/styles'
import { useBoolean } from 'minimal-shared/hooks'
import { mergeClasses } from 'minimal-shared/utils'
import { Nav, NavLi, NavSubheader, NavUl } from '../components'
import { navSectionClasses, navSectionCssVars } from '../styles'
import { NavList } from './nav-list'

// ----------------------------------------------------------------------

interface NavSectionVerticalProps {
  sx?: SxProps<Theme>
  data: any[]
  render?: {
    navIcon?: Record<string, React.ReactNode>
    navInfo?: (value: any) => Record<string, React.ReactElement>
  }
  className?: string
  slotProps?: {
    subheader?: SxProps<Theme>
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
  cssVars?: SxProps<Theme>
}

export function NavSectionVertical({
  sx,
  data,
  render,
  className,
  slotProps,
  checkPermissions,
  enabledRootRedirect,
  cssVars: overridesVars,
  ...other
}: NavSectionVerticalProps) {
  const theme = useTheme()

  const cssVars = { ...navSectionCssVars.vertical(theme), ...overridesVars }

  return (
    <Nav
      className={mergeClasses([navSectionClasses.vertical, className])}
      sx={[{ ...cssVars }, ...(Array.isArray(sx) ? sx : [sx])]}
      {...other}
    >
      <NavUl sx={{ flex: '1 1 auto', gap: 'var(--nav-item-gap)' }}>
        {data.map((group) => (
          <Group
            key={group.subheader ?? group.items[0].title}
            subheader={group.subheader}
            items={group.items}
            render={render}
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
  items: any[]
  render?: {
    navIcon?: Record<string, React.ReactNode>
    navInfo?: (value: any) => Record<string, React.ReactElement>
  }
  subheader?: string
  slotProps?: NavSectionVerticalProps['slotProps']
  checkPermissions?: NavSectionVerticalProps['checkPermissions']
  enabledRootRedirect?: boolean
}

function Group({
  items,
  render,
  subheader,
  slotProps,
  checkPermissions,
  enabledRootRedirect,
}: GroupProps) {
  const groupOpen = useBoolean(true)

  const renderContent = () => (
    <NavUl sx={{ gap: 'var(--nav-item-gap)' }}>
      {items.map((list) => (
        <NavList
          key={list.title}
          data={list}
          render={render}
          depth={1}
          slotProps={slotProps}
          checkPermissions={checkPermissions}
          enabledRootRedirect={enabledRootRedirect}
        />
      ))}
    </NavUl>
  )

  return (
    <NavLi>
      {subheader ? (
        <>
          <NavSubheader
            data-title={subheader}
            open={groupOpen.value}
            onClick={groupOpen.onToggle}
            sx={slotProps?.subheader}
          >
            {subheader}
          </NavSubheader>

          <Collapse in={groupOpen.value}>{renderContent()}</Collapse>
        </>
      ) : (
        renderContent()
      )}
    </NavLi>
  )
}
