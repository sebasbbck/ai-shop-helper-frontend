import Collapse from '@mui/material/Collapse'
import { styled } from '@mui/material/styles'

import { navSectionClasses } from '../styles'

// ----------------------------------------------------------------------

// Define the interface for your custom props
interface NavCollapseProps {
  depth: number
}

export const NavCollapse = styled(Collapse, {
  // depth is used for styling, so we don't want it passed to the DOM (Collapse)
  shouldForwardProp: (prop) => prop !== 'depth',
})<NavCollapseProps>(({ theme, depth }) => {
  const verticalLineStyles = {
    top: 0,
    left: 0,
    width: '2px',
    content: '""',
    position: 'absolute',
    backgroundColor: 'var(--nav-bullet-light-color)',
    bottom:
      'calc(var(--nav-item-sub-height) - 2px - var(--nav-bullet-size) / 2)',
    ...theme.applyStyles('dark', {
      backgroundColor: 'var(--nav-bullet-dark-color)',
    }),
  }

  return {
    ...(depth && {
      ...(depth + 1 !== 1 && {
        paddingLeft: 'calc(var(--nav-item-pl) + var(--nav-icon-size) / 2)',
        [`& .${navSectionClasses.ul}`]: {
          position: 'relative',
          paddingLeft: 'var(--nav-bullet-size)',
          '&::before': verticalLineStyles,
        },
      }),
    }),
  }
})
