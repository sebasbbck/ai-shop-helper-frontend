import { cloneElement } from 'react'

import NextLink from 'next/link'

// ----------------------------------------------------------------------

interface CreateNavItemParams {
  path?: string
  icon?: React.ReactNode
  info?: React.ReactNode
  depth?: number
  render?: {
    navIcon?: Record<string, React.ReactNode>
    navInfo?: (value: any) => Record<string, React.ReactElement>
  }
  hasChild?: boolean
  externalLink?: boolean
  enabledRootRedirect?: boolean
}

// ----------------------------------------------------------------------

export function createNavItem({
  path,
  icon,
  info,
  depth,
  render,
  hasChild,
  externalLink,
  enabledRootRedirect,
}: CreateNavItemParams) {
  const rootItem = depth === 1
  const subItem = !rootItem
  const subDeepItem = Number(depth) > 2

  const isLink = !hasChild || enabledRootRedirect !== false

  const linkProps = externalLink
    ? { href: path, target: '_blank', rel: 'noopener noreferrer' }
    : { component: NextLink, href: path }

  const baseProps = isLink ? linkProps : {}

  /**
   * Render @icon
   */
  let renderIcon = null

  if (icon && render?.navIcon && typeof icon === 'string') {
    renderIcon = render?.navIcon[icon]
  } else {
    renderIcon = icon
  }

  /**
   * Render @info
   */
  let renderInfo = null

  if (info && render?.navInfo && Array.isArray(info)) {
    const [key, value] = info
    const element = render.navInfo(value)[key]

    renderInfo = element ? cloneElement(element) : null
  } else {
    renderInfo = info
  }

  return {
    subItem,
    rootItem,
    subDeepItem,
    baseProps,
    renderIcon,
    renderInfo,
  }
}
