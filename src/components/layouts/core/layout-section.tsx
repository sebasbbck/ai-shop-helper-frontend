import GlobalStyles from '@mui/material/GlobalStyles'

import { styled, SxProps, Theme } from '@mui/material/styles'
import { mergeClasses } from 'minimal-shared/utils'

import { layoutClasses } from './classes'
import { layoutSectionVars } from './css-vars'

// ----------------------------------------------------------------------

interface LayoutSectionProps {
  sx?: SxProps<Theme>
  cssVars?: object
  children: React.ReactNode
  footerSection?: React.ReactNode
  headerSection?: React.ReactNode
  sidebarSection?: React.ReactNode
  className?: string
  [key: string]: any
}

export function LayoutSection({
  sx,
  cssVars,
  children,
  footerSection,
  headerSection,
  sidebarSection,
  className,
  ...other
}: LayoutSectionProps) {
  const inputGlobalStyles = (
    <GlobalStyles
      styles={(theme) => ({
        body: { ...layoutSectionVars(theme), ...cssVars },
      })}
    />
  )

  return (
    <>
      {inputGlobalStyles}

      <LayoutRoot
        id="root__layout"
        className={mergeClasses([layoutClasses.root, className])}
        sx={sx}
        {...other}
      >
        {sidebarSection ? (
          <>
            {sidebarSection}
            <LayoutSidebarContainer className={layoutClasses.sidebarContainer}>
              {headerSection}
              {children}
              {footerSection}
            </LayoutSidebarContainer>
          </>
        ) : (
          <>
            {headerSection}
            {children}
            {footerSection}
          </>
        )}
      </LayoutRoot>
    </>
  )
}

// ----------------------------------------------------------------------

const LayoutRoot = styled('div')``

const LayoutSidebarContainer = styled('div')(() => ({
  display: 'flex',
  flex: '1 1 auto',
  flexDirection: 'column',
}))
