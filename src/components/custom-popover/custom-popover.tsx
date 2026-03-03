import { listClasses } from "@mui/material/List"
import { menuItemClasses } from "@mui/material/MenuItem"

import Popover from "@mui/material/Popover"
import { SxProps, Theme, useTheme } from "@mui/material/styles"
import { mergeRefs } from "minimal-shared/utils"
import { useRef } from "react"

import { useElementRect } from "./hooks"
import { Arrow, getPaperOffsetStyles } from "./styles"
import { getPopoverOrigin } from "./utils"

// ----------------------------------------------------------------------

type PopoverPlacement = 
  | "top-left" | "top-center" | "top-right"
  | "bottom-left" | "bottom-center" | "bottom-right"
  | "left-top" | "left-center" | "left-bottom"
  | "right-top" | "right-center" | "right-bottom"

const DEFAULT_ARROW_SIZE = 14
const DEFAULT_ARROW_PLACEMENT = "top-right"
const DEFAULT_PAPER_OFFSET = [8, 2] as const

interface CustomPopoverProps {
  open: boolean
  onClose: () => void
  children: React.ReactNode
  anchorEl: HTMLElement | null
  slotProps?: {
    arrow?: {
      size?: number
      placement?: PopoverPlacement
      hide?: boolean
      sx?: SxProps<Theme>
    }
    paper?: {
      offset?: readonly [number, number]
      sx?: SxProps<Theme>
      ref?: React.Ref<any>
      onClick?: (e: any) => any
    }
  }
  [key: string]: any
}

export function CustomPopover({
  open,
  onClose,
  children,
  anchorEl,
  slotProps,
  ...other
}: CustomPopoverProps) {
  const theme = useTheme()
  const isRtl = theme.direction === "rtl"

  const {
    arrow: arrowProps,
    paper: paperProps,
    ...otherSlotProps
  } = slotProps ?? {}

  const arrowSize = arrowProps?.size ?? DEFAULT_ARROW_SIZE
  const arrowPlacement = arrowProps?.placement ?? DEFAULT_ARROW_PLACEMENT
  const paperOffset = paperProps?.offset ?? DEFAULT_PAPER_OFFSET

  const { anchorOrigin, transformOrigin } = getPopoverOrigin(arrowPlacement, isRtl)

  const paperRef = useRef(null)
  const paperRect = useElementRect(paperRef.current, "popoverPaper", open)
  const anchorRect = useElementRect(anchorEl, "anchor", open)

  const isArrowVisible = !arrowProps?.hide && !!paperRect && !!anchorRect

  const paperStyles = {
    ...getPaperOffsetStyles(arrowPlacement, paperOffset, isRtl),
    overflow: "inherit",
    [`& .${listClasses.root}`]: { minWidth: 140 },
    [`& .${menuItemClasses.root}`]: { gap: 2 },
  }

  return (
    <Popover
      aria-hidden={!open}
      open={!!open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={anchorOrigin}
      transformOrigin={transformOrigin}
      slotProps={{
        ...otherSlotProps,
        paper: {
          ...paperProps,
          ref: mergeRefs([paperRef, paperProps?.ref]),
          sx: [
            paperStyles,
            ...(Array.isArray(paperProps?.sx)
              ? paperProps.sx
              : [paperProps?.sx]),
          ],
        },
      }}
      {...other}
    >
      {isArrowVisible && (
        <Arrow
          size={arrowSize}
          placement={arrowPlacement}
          paperRect={paperRect}
          anchorRect={anchorRect}
          sx={arrowProps?.sx}
        />
      )}

      {children}
    </Popover>
  )
}
