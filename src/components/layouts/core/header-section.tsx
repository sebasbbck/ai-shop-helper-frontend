import AppBar from "@mui/material/AppBar"
import Container from "@mui/material/Container"
import { Breakpoint, styled, SxProps, Theme } from "@mui/material/styles"
import { useScrollOffsetTop } from "minimal-shared/hooks"
import { mergeClasses, varAlpha } from "minimal-shared/utils"

import { layoutClasses } from "./classes"

// ----------------------------------------------------------------------

interface HeaderSectionProps {
  sx?: SxProps<Theme>
  slots?: {
    topArea?: React.ReactNode
    leftArea?: React.ReactNode
    centerArea?: React.ReactNode
    rightArea?: React.ReactNode
    bottomArea?: React.ReactNode
  }
  slotProps?: {
    container?: object
    centerArea?: object
  }
  className?: string
  disableOffset?: boolean
  disableElevation?: boolean
  layoutQuery?: Breakpoint 
  [key: string]: any
}

export function HeaderSection({
  sx,
  slots,
  slotProps,
  className,
  disableOffset,
  disableElevation,
  layoutQuery = "md",
  ...other
}: HeaderSectionProps) {
  const { offsetTop: isOffset } = useScrollOffsetTop()

  return (
    <HeaderRoot
      position="sticky"
      color="transparent"
      isOffset={isOffset}
      disableOffset={disableOffset}
      disableElevation={disableElevation}
      className={mergeClasses([layoutClasses.header, className])}
      sx={[
        (theme) => ({
          ...(isOffset && {
            "--color": `var(--offset-color, ${theme.vars.palette.text.primary})`,
          }),
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      {slots?.topArea}

      <HeaderContainer layoutQuery={layoutQuery} {...slotProps?.container}>
        {slots?.leftArea}

        <HeaderCenterArea {...slotProps?.centerArea}>
          {slots?.centerArea}
        </HeaderCenterArea>

        {slots?.rightArea}
      </HeaderContainer>

      {slots?.bottomArea}
    </HeaderRoot>
  )
}

// ----------------------------------------------------------------------

interface HeaderRootProps {
  isOffset: boolean
  disableOffset?: boolean
  disableElevation?: boolean
  sx?: SxProps<Theme>
}

const HeaderRoot = styled(AppBar, {
  shouldForwardProp: (prop) =>
    !["isOffset", "disableOffset", "disableElevation", "sx"].includes(prop as string),
})<HeaderRootProps>(({ isOffset, disableOffset, disableElevation, theme }) => {
  const pauseZindex = { top: -1, bottom: -2 }

  const pauseStyles = {
    opacity: 0,
    content: '""',
    visibility: "hidden",
    position: "absolute",
    transition: theme.transitions.create(["opacity", "visibility"], {
      easing: theme.transitions.easing.easeInOut,
      duration: theme.transitions.duration.shorter,
    }),
  }

  const bgStyles = {
    ...(theme as any).mixins.bgBlur({
      color: varAlpha(theme.vars.palette.background.defaultChannel, 0.8),
    }),
    ...pauseStyles,
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: pauseZindex.top,
    ...(isOffset && { opacity: 1, visibility: "visible" }),
  }

  const shadowStyles = {
    ...pauseStyles,
    left: 0,
    right: 0,
    bottom: 0,
    height: 24,
    margin: "auto",
    borderRadius: "50%",
    width: `calc(100% - 48px)`,
    zIndex: pauseZindex.bottom,
    boxShadow: theme.vars.customShadows.z8,
    ...(isOffset && { opacity: 0.48, visibility: "visible" }),
  }

  return {
    zIndex: "var(--layout-header-zIndex)",
    ...(!disableOffset && { "&::before": bgStyles }),
    ...(!disableElevation && { "&::after": shadowStyles }),
  }
})

interface HeaderContainerProps {
  layoutQuery?: Breakpoint
  sx?: SxProps<Theme>
  [key: string]: any
}

const HeaderContainer = styled(Container, {
  shouldForwardProp: (prop) => !["layoutQuery", "sx"].includes(prop as string),
})<HeaderContainerProps>(({ layoutQuery = "md", theme }) => ({
  display: "flex",
  alignItems: "center",
  color: "var(--color)",
  height: "var(--layout-header-mobile-height)",
  [theme.breakpoints.up(layoutQuery)]: {
    height: "var(--layout-header-desktop-height)",
  },
}))

const HeaderCenterArea = styled("div")(() => ({
  display: "flex",
  flex: "1 1 auto",
  justifyContent: "center",
}))
