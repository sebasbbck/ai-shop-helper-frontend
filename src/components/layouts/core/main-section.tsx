import { styled, SxProps, Theme } from "@mui/material/styles"
import { mergeClasses } from "minimal-shared/utils"

import { layoutClasses } from "./classes"

// ----------------------------------------------------------------------

interface MainSectionProps {
  children: React.ReactNode
  className?: string
  sx?: SxProps<Theme>
  [key: string]: any
}

export function MainSection({ children, className, sx, ...other }: MainSectionProps) {
  return (
    <MainRoot
      className={mergeClasses([layoutClasses.main, className])}
      sx={sx}
      {...other}
    >
      {children}
    </MainRoot>
  )
}

// ----------------------------------------------------------------------

const MainRoot = styled("main")({
  display: "flex",
  flex: "1 1 auto",
  flexDirection: "column",
})
