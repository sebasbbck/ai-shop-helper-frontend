import ButtonBase from '@mui/material/ButtonBase'
import {
  CSSObject,
  CSSProperties,
  styled,
  SxProps,
  Theme,
} from '@mui/material/styles'
import Tooltip from '@mui/material/Tooltip'
import { mergeClasses } from 'minimal-shared/utils'

import { Iconify } from '../../iconify'
import { navItemStyles, navSectionClasses } from '../styles'
import { createNavItem } from '../utils'
import { Badge } from '@mui/material'
import { RefObject } from 'react'

// ----------------------------------------------------------------------

interface NavItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  ref?: RefObject<any>
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
    texts?: SxProps<Theme>
  }
  className?: string
  externalLink?: boolean
  enabledRootRedirect?: boolean
  onToggle?: VoidFunction
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

export function NavItem({
  ref,
  path,
  icon,
  info,
  title,
  caption,
  /********/
  open,
  active,
  disabled,
  /********/
  depth,
  render,
  hasChild,
  notificationCount,
  slotProps,
  className,
  externalLink,
  enabledRootRedirect,
  /********/
  onToggle,
  ...other
}: NavItemProps) {
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
        <ItemIcon
          {...ownerState}
          className={navSectionClasses.item.icon}
          sx={slotProps?.icon}
        >
          {navItem.renderIcon}
        </ItemIcon>
      )}

      {title && (
        <ItemTexts
          {...ownerState}
          className={navSectionClasses.item.texts}
          sx={slotProps?.texts}
        >
          <ItemTitle
            {...ownerState}
            className={navSectionClasses.item.title}
            sx={slotProps?.title}
          >
            {title}
          </ItemTitle>

          {caption && (
            <Tooltip title={caption} placement="top-start">
              <ItemCaptionText
                {...ownerState}
                className={navSectionClasses.item.caption}
                sx={slotProps?.caption}
              >
                {caption}
              </ItemCaptionText>
            </Tooltip>
          )}
        </ItemTexts>
      )}

      {info && (
        <ItemInfo
          {...ownerState}
          className={navSectionClasses.item.info}
          sx={slotProps?.info}
        >
          {navItem.renderInfo}
        </ItemInfo>
      )}

      {notificationCount !== undefined && notificationCount > 0 && (
        <NotificationBadge count={notificationCount} {...ownerState}>
          {notificationCount}
        </NotificationBadge>
      )}

      {hasChild && (
        <Badge
          onClick={onToggle}
          sx={{
            cursor: 'pointer',
            mr: 2,
            px: 2,
            '& .MuiBadge-badge': {
              backgroundColor: 'transparent',
              // color: (theme) => theme.palette.primary.main,
            },
          }}
          badgeContent={
            <ItemArrow
              {...ownerState}
              icon={
                open
                  ? 'eva:arrow-ios-downward-fill'
                  : 'eva:arrow-ios-forward-fill'
              }
              className={navSectionClasses.item.arrow}
              sx={slotProps?.arrow}
            />
          }
        ></Badge>
      )}
    </ItemRoot>
  )
}

// ----------------------------------------------------------------------

const shouldForwardProp = (prop: string) =>
  !['open', 'active', 'disabled', 'variant', 'sx'].includes(prop)

/**
 * @slot root
 */
const ItemRoot = styled(ButtonBase, { shouldForwardProp })<StyledState>(({
  active,
  open,
  theme,
}) => {
  const bulletSvg = `"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' fill='none' viewBox='0 0 14 14'%3E%3Cpath d='M1 1v4a8 8 0 0 0 8 8h4' stroke='%23efefef' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E"`

  const bulletStyles = {
    left: 0,
    content: '""',
    position: 'absolute',
    width: 'var(--nav-bullet-size)',
    height: 'var(--nav-bullet-size)',
    backgroundColor: 'var(--nav-bullet-light-color)',
    mask: `url(${bulletSvg}) no-repeat 50% 50%/100% auto`,
    WebkitMask: `url(${bulletSvg}) no-repeat 50% 50%/100% auto`,
    transform:
      theme.direction === 'rtl'
        ? 'translate(calc(var(--nav-bullet-size) * 1), calc(var(--nav-bullet-size) * -0.4)) scaleX(-1)'
        : 'translate(calc(var(--nav-bullet-size) * -1), calc(var(--nav-bullet-size) * -0.4))',
    ...theme.applyStyles('dark', {
      backgroundColor: 'var(--nav-bullet-dark-color)',
    }),
  }

  const rootItemStyles = {
    minHeight: 'var(--nav-item-root-height)',
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
    '&::before': bulletStyles,
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
    position: 'relative',
    width: '100%',
    justifyContent: 'flex-start',
    textAlign: 'left',
    paddingTop: 'var(--nav-item-pt)',
    paddingLeft: 'var(--nav-item-pl)',
    paddingRight: 'var(--nav-item-pr)',
    paddingBottom: 'var(--nav-item-pb)',
    borderRadius: 'var(--nav-item-radius)',
    color: 'var(--nav-item-color)',
    '&:hover': { backgroundColor: 'var(--nav-item-hover-bg)' },
    variants: [
      { props: { variant: 'rootItem' }, style: rootItemStyles },
      { props: { variant: 'subItem' }, style: subItemStyles },
      { props: { disabled: true }, style: navItemStyles.disabled },
    ],
  }
})

/**
 * @slot icon
 */
const ItemIcon = styled('span', { shouldForwardProp })(() => ({
  ...navItemStyles.icon,
  width: 'var(--nav-icon-size)',
  height: 'var(--nav-icon-size)',
  margin: 'var(--nav-icon-margin)',
}))

/**
 * @slot texts
 */
interface ItemTextsProps {
  flex?: CSSProperties['flex']
  display?: CSSProperties['display']
  flexDirection?: CSSProperties['flexDirection']
}

const ItemTexts = styled('span', { shouldForwardProp })<ItemTextsProps>(() => ({
  ...(navItemStyles.texts as CSSObject),
  flexDirection: 'column',
}))

/**
 * @slot title
 */
const ItemTitle = styled('span', { shouldForwardProp })(({ theme }) => ({
  ...navItemStyles.title(theme),
  ...theme.typography.body2,
  fontWeight: theme.typography.fontWeightMedium,
  variants: [
    {
      props: { active: true },
      style: { fontWeight: theme.typography.fontWeightBold },
    },
  ],
}))

/**
 * @slot caption text
 */
const ItemCaptionText = styled('span', { shouldForwardProp })(({ theme }) => ({
  ...navItemStyles.captionText(theme),
  color: 'var(--nav-item-caption-color)',
}))

/**
 * @slot info
 */
const ItemInfo = styled('span', { shouldForwardProp })(({}) => ({
  ...navItemStyles.info,
}))

/**
 * @slot arrow
 */
const ItemArrow = styled(Iconify, { shouldForwardProp })(({ theme }) => ({
  ...navItemStyles.arrow(theme),
}))

/**
 * @slot notification badge
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
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginLeft: 'auto',
  marginRight: '5px',
  minWidth: '20px',
  height: '20px',
  borderRadius: '50%',
  backgroundColor: theme.vars.palette.error.main,
  color: theme.vars.palette.error.contrastText,
  fontSize: '12px',
  fontWeight: '600',
  flexShrink: 0,
  paddingRight: '1px',
}))
