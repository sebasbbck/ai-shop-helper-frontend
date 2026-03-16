import { styled } from '@mui/material/styles'
import { mergeClasses } from 'minimal-shared/utils'

import { navSectionClasses } from '../styles'

// ----------------------------------------------------------------------

export const Nav = styled('nav')``

// ----------------------------------------------------------------------

export const NavLi = styled(
  (props: any) => (
    <li
      {...props}
      className={mergeClasses([navSectionClasses.li, props.className])}
    />
  ),
  { shouldForwardProp: (prop) => !['disabled', 'sx'].includes(prop as string) },
)(() => ({
  display: 'inline-block',
  variants: [{ props: { disabled: true }, style: { cursor: 'not-allowed' } }],
}))

// ----------------------------------------------------------------------

export const NavUl = styled((props: any) => (
  <ul
    {...props}
    className={mergeClasses([navSectionClasses.ul, props.className])}
  />
))(() => ({ display: 'flex', flexDirection: 'column' }))
