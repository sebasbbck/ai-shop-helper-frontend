import { forwardRef } from 'react'
import { mergeClasses } from 'minimal-shared/utils'

import Tooltip from '@mui/material/Tooltip'
import ButtonBase from '@mui/material/ButtonBase'
import { styled, SxProps, Theme } from '@mui/material/styles'

import { Iconify } from '../../iconify'
import { navItemStyles, navSectionClasses } from '../styles'
import { createNavItem } from '../utils'

// ----------------------------------------------------------------------

interface NavItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  path?: string
  icon?: React.ReactNode
  info?: React.ReactNode
  title?: string
  caption?: string
  open?: boolean
  active?: boolean
  disabled?: boolean
  depth?: number
  render?: {
    navIcon?: Record<string, React.ReactNode>
    navInfo?: (value: any) => Record<string, React.ReactElement>
  }
  hasChild?: boolean
  notificationCount?: number
  slotProps?: {
    sx?: SxProps<Theme>
    icon?: SxProps<Theme>
    title?: SxProps<Theme>
    caption?: SxProps<Theme>
    info?: SxProps<Theme>
    arrow?: SxProps<Theme>
  }
  className?: string
  externalLink?: boolean
  enabledRootRedirect?: boolean
}

// Interface for styled components state
interface ItemOwnerState extends StyledState {
  // Add any additional ownerState props if needed
}

interface StyledState {
  open?: boolean
  active?: boolean
  disabled?: boolean
  variant?: 'rootItem' | 'subItem'
}

export const NavItem = forwardRef<HTMLButtonElement, NavItemProps>(
  (props, ref) => {
    const {
      path,
      icon,
      info,
      title,
      caption,
      open,
      active,
      disabled,
      depth,
      render,
      hasChild,
      notificationCount,
      slotProps,
      className,
      externalLink,
      enabledRootRedirect,
      ...other
    } = props

    const navItem = createNavItem({
      path,
      icon,
      info,
      depth,
      render,
      hasChild,
      externalLink,
      enabledRootRedirect,
    })

    const ownerState: ItemOwnerState = {
      open,
      active,
      disabled,
      variant: navItem.rootItem ? 'rootItem' : 'subItem',
    }

    return (
      <ItemRoot
        ref={ref}
        aria-label={title}
        {...ownerState}
        {...navItem.baseProps}
        className={mergeClasses([navSectionClasses.item.root, className], {
          [navSectionClasses.state.open]: open,
          [navSectionClasses.state.active]: active,
          [navSectionClasses.state.disabled]: disabled,
        })}
        sx={slotProps?.sx}
        {...other}
      >
        {icon && (
          <ItemIconWrapper {...ownerState}>
            <ItemIcon
              {...ownerState}
              className={navSectionClasses.item.icon}
              sx={slotProps?.icon}
            >
              {navItem.renderIcon}
            </ItemIcon>
            {notificationCount !== undefined && notificationCount > 0 && (
              <NotificationBadge count={notificationCount} {...ownerState}>
                {notificationCount}
              </NotificationBadge>
            )}
          </ItemIconWrapper>
        )}

        {title && (
          <ItemTitle
            {...ownerState}
            className={navSectionClasses.item.title}
            sx={slotProps?.title}
          >
            {title}
          </ItemTitle>
        )}

        {caption && (
          <Tooltip title={caption} arrow placement="right">
            <ItemCaptionIcon
              {...ownerState}
              icon="eva:info-outline"
              className={navSectionClasses.item.caption}
              sx={slotProps?.caption}
            />
          </Tooltip>
        )}

        {info && navItem.subItem && (
          <ItemInfo
            {...ownerState}
            className={navSectionClasses.item.info}
            sx={slotProps?.info}
          >
            {navItem.renderInfo}
          </ItemInfo>
        )}

        {hasChild && (
          <ItemArrow
            {...ownerState}
            icon="eva:arrow-ios-forward-fill"
            className={navSectionClasses.item.arrow}
            sx={slotProps?.arrow}
          />
        )}
      </ItemRoot>
    )
  },
)

// ----------------------------------------------------------------------

const shouldForwardProp = (prop: string) =>
  !['open', 'active', 'disabled', 'variant', 'sx'].includes(prop)

const ItemRoot = styled(ButtonBase, { shouldForwardProp })<StyledState>(({
  active,
  open,
  theme,
}) => {
  const rootItemStyles = {
    textAlign: 'center' as const,
    flexDirection: 'column' as const,
    minHeight: 'var(--nav-item-root-height)',
    padding: 'var(--nav-item-root-padding)',
    ...(open && {
      color: 'var(--nav-item-root-open-color)',
      backgroundColor: 'var(--nav-item-root-open-bg)',
    }),
    ...(active && {
      color: 'var(--nav-item-root-active-color)',
      backgroundColor: 'var(--nav-item-root-active-bg)',
      '&:hover': { backgroundColor: 'var(--nav-item-root-active-hover-bg)' },
      ...theme.applyStyles('dark', {
        color: 'var(--nav-item-root-active-color-on-dark)',
      }),
    }),
  }

  const subItemStyles = {
    minHeight: 'var(--nav-item-sub-height)',
    padding: 'var(--nav-item-sub-padding)',
    color: theme.vars.palette.text.secondary,
    ...(open && {
      color: 'var(--nav-item-sub-open-color)',
      backgroundColor: 'var(--nav-item-sub-open-bg)',
    }),
    ...(active && {
      color: 'var(--nav-item-sub-active-color)',
      backgroundColor: 'var(--nav-item-sub-active-bg)',
    }),
  }

  return {
    width: '100%',
    color: 'var(--nav-item-color)',
    borderRadius: 'var(--nav-item-radius)',
    '&:hover': { backgroundColor: 'var(--nav-item-hover-bg)' },
    variants: [
      { props: { variant: 'rootItem' }, style: rootItemStyles },
      { props: { variant: 'subItem' }, style: subItemStyles },
      { props: { disabled: true }, style: navItemStyles.disabled },
    ],
  }
})

/**
 * @slot icon wrapper for notification badge
 */
const ItemIconWrapper = styled('div', { shouldForwardProp })<StyledState>(
  () => ({
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }),
)

/**
 * @slot notification badge for mini layout
 */
interface NotificationBadgeProps {
  count: number
  active?: boolean
  disabled?: boolean
  variant?: 'rootItem' | 'subItem'
}

const NotificationBadge = styled('div', {
  shouldForwardProp,
})<NotificationBadgeProps>(({ theme }) => ({
  position: 'absolute',
  top: '-6px',
  right: '-6px',
  minWidth: '14px',
  height: '14px',
  borderRadius: '50%',
  backgroundColor: theme.vars.palette.error.main,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.vars.palette.error.contrastText,
  fontSize: '10px',
  fontWeight: '700',
  paddingLeft: '1px',
}))

const ItemIcon = styled('span', { shouldForwardProp })<StyledState>(() => ({
  ...navItemStyles.icon,
  width: 'var(--nav-icon-size)',
  height: 'var(--nav-icon-size)',
  margin: 'var(--nav-icon-root-margin)',
  variants: [
    {
      props: { variant: 'subItem' },
      style: { margin: 'var(--nav-icon-sub-margin)' },
    },
  ],
}))

const ItemTitle = styled('span', { shouldForwardProp })<StyledState>(
  ({ active, theme }) => ({
    ...navItemStyles.title(theme),
    lineHeight: '16px',
    fontSize: theme.typography.pxToRem(10),
    fontWeight: theme.typography.fontWeightBold,
    variants: [
      {
        props: { variant: 'rootItem' },
        style: {
          ...(active && { fontWeight: theme.typography.fontWeightBold }),
        },
      },
      {
        props: { variant: 'subItem' },
        style: {
          ...theme.typography.body2,
          fontWeight: theme.typography.fontWeightMedium,
          ...(active && { fontWeight: theme.typography.fontWeightBold }),
        },
      },
    ],
  }),
)

const ItemCaptionIcon = styled(Iconify, { shouldForwardProp })<StyledState>(
  () => ({
    ...navItemStyles.captionIcon,
    color: 'var(--nav-item-caption-color)',
    variants: [
      {
        props: { variant: 'rootItem' },
        style: { top: 11, left: 6, position: 'absolute' },
      },
    ],
  }),
)

const ItemInfo = styled('span', { shouldForwardProp })<StyledState>(() => ({
  ...navItemStyles.info,
}))

const ItemArrow = styled(Iconify, { shouldForwardProp })<StyledState>(
  ({ theme }) => ({
    ...navItemStyles.arrow(theme),
    variants: [
      {
        props: { variant: 'rootItem' },
        style: {
          margin: 0,
          top: 11,
          right: 6,
          position: 'absolute',
        },
      },
      {
        props: { variant: 'subItem' },
        style: { marginRight: theme.spacing(-0.5) },
      },
    ],
  }),
)
