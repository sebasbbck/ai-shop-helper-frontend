import { CSSObject, styled } from "@mui/material/styles"
import { noRtlFlip, varAlpha } from "minimal-shared/utils"

import { getArrowOffset } from "./utils"

// ----------------------------------------------------------------------

const ARROW_TRANSLATE = "48%"

const ARROW_COLOR_THRESHOLDS = {
  topCyan: 0.6,
  bottomRed: 0.4,
  sideCyan: 0.6,
  sideRed: 0.4,
}

type Side = 'top' | 'bottom' | 'left' | 'right'
type Align = 'left' | 'center' | 'right' | 'top' | 'bottom'

// ----------------------------------------------------------------------

export function getPaperOffsetStyles(placement: string, paperOffsets: readonly [number, number], isRtl: boolean) {
  if (!placement) return {}

  const [primaryOffset, secondaryOffset] = paperOffsets
  const rtlDirection = isRtl ? -1 : 1

  const offsetBySide: Record<Side, Record<string, number[]>> = {
    top: {
      left: [-primaryOffset * rtlDirection, secondaryOffset],
      center: [0, secondaryOffset],
      right: [primaryOffset * rtlDirection, secondaryOffset],
    },
    bottom: {
      left: [-primaryOffset * rtlDirection, -secondaryOffset],
      center: [0, -secondaryOffset],
      right: [primaryOffset * rtlDirection, -secondaryOffset],
    },
    left: {
      top: [secondaryOffset * rtlDirection, -primaryOffset],
      center: [secondaryOffset * rtlDirection, 0],
      bottom: [secondaryOffset * rtlDirection, primaryOffset],
    },
    right: {
      top: [-secondaryOffset * rtlDirection, -primaryOffset],
      center: [-secondaryOffset * rtlDirection, 0],
      bottom: [-secondaryOffset * rtlDirection, primaryOffset],
    },
  }

  const parts = placement.split("-")
  const side = parts[0] as Side
  const align = (parts[1] || "center") as Align
  const [translateX, translateY] = offsetBySide[side]?.[align] || [0, 0]

  return { translate: `${translateX}px ${translateY}px` }
}

// ----------------------------------------------------------------------

function getArrowPlacementStyles(side: string, isRtl = false): CSSObject {
  const styleBySide: Record<string, CSSObject> = {
    top: { top: 0, rotate: "135deg", translate: `0 -${ARROW_TRANSLATE}` },
    bottom: { bottom: 0, rotate: "-45deg", translate: `0 ${ARROW_TRANSLATE}` },
    left: isRtl
      ? { left: 0, rotate: "-135deg", translate: `${ARROW_TRANSLATE} 0` }
      : { left: 0, rotate: "45deg", translate: `-${ARROW_TRANSLATE} 0` },
    right: isRtl
      ? { right: 0, rotate: "45deg", translate: `-${ARROW_TRANSLATE} 0` }
      : { right: 0, rotate: "-135deg", translate: `${ARROW_TRANSLATE} 0` },
  }

  return styleBySide[side] ?? {}
}

function getArrowColor({ isRtl, placement, xRatio, yRatio, paperRatio }: {
  isRtl: boolean
  placement: string
  xRatio: number
  yRatio: number
  paperRatio: number
}) {
  if (!placement) return null

  const isTop = placement.startsWith("top-")
  const isBottom = placement.startsWith("bottom-")
  const isLeft = placement.startsWith("left-")
  const isRight = placement.startsWith("right-")

  if (isTop && xRatio > ARROW_COLOR_THRESHOLDS.topCyan) return "cyan"
  if (isBottom && xRatio < ARROW_COLOR_THRESHOLDS.bottomRed) return "red"

  if (isLeft || isRight) {
    const useCyan = yRatio > ARROW_COLOR_THRESHOLDS.sideCyan || paperRatio >= 1.8
    const useRed = yRatio < ARROW_COLOR_THRESHOLDS.sideRed || paperRatio >= 1.8

    if (isRtl) {
      if (isRight && useCyan) return "red"
      if (isLeft && useRed) return "cyan"
    } else {
      if (isRight && useRed) return "cyan"
      if (isLeft && useCyan) return "red"
    }
  }

  return null
}

// ----------------------------------------------------------------------

export interface ArrowProps {
  size: number;
  placement: string;
  anchorRect: { left: number; width: number; top: number; height: number } | null;
  paperRect: { left: number; top: number; width: number; height: number } | null;
}

const shouldForwardProp = (prop: string) => 
  !['size', 'placement', 'anchorRect', 'paperRect'].includes(prop);

export const Arrow = styled('span', { shouldForwardProp })<ArrowProps>(
  ({ size, placement, anchorRect, paperRect, theme }) => {
    // 1. Guard against null rects
    if (!anchorRect || !paperRect) {
      return { display: 'none' };
    }

    const isRtl = theme.direction === "rtl"
    const { offsetX, offsetY } = getArrowOffset(anchorRect, paperRect, size)

    const arrowColor = getArrowColor({
      isRtl,
      placement,
      xRatio: offsetX / paperRect.width,
      yRatio: offsetY / paperRect.height,
      paperRatio: Math.round((paperRect.width / paperRect.height) * 100) / 100,
    })

    // 2. Base Style (Restored from your .jsx)
    const arrowBaseStyle: CSSObject = {
      width: size,
      height: size,
      position: "absolute",
      display: 'block',
      borderBottomLeftRadius: isRtl ? 0 : size / 4,
      borderBottomRightRadius: isRtl ? size / 4 : 0,
      clipPath: "polygon(0% 0%, 100% 100%, 0% 100%)",
      backgroundColor: theme.vars.palette.background.paper,
      border: `solid 1px ${varAlpha(theme.vars.palette.grey["500Channel"], 0.12)}`,
      ...theme.applyStyles("dark", {
        border: `solid 1px ${varAlpha(theme.vars.palette.common.blackChannel, 0.12)}`,
      }),
    }

    // 3. Color Style (Restored from your .jsx)
    const arrowBackgroundStyle: CSSObject = {
      backgroundRepeat: "no-repeat",
      backgroundSize: `${size * 3}px ${size * 3}px`,
      ...(arrowColor === "cyan" && {
        backgroundPosition: noRtlFlip("top right"),
        backgroundImage: `linear-gradient(45deg, ${varAlpha(theme.vars.palette.info.mainChannel, 0.08)}, ${varAlpha(theme.vars.palette.info.mainChannel, 0.08)})`,
      }),
      ...(arrowColor === "red" && {
        backgroundPosition: noRtlFlip("bottom left"),
        backgroundImage: `linear-gradient(45deg, ${varAlpha(theme.vars.palette.error.mainChannel, 0.08)}, ${varAlpha(theme.vars.palette.error.mainChannel, 0.08)})`,
      }),
    }

    return {
      ...arrowBaseStyle,
      ...arrowBackgroundStyle,
      variants: [
        {
          props: (p: ArrowProps) => p.placement?.startsWith("top-"),
          style: {
            ...getArrowPlacementStyles("top"),
            left: noRtlFlip(`${offsetX}px`),
          },
        },
        {
          props: (p: ArrowProps) => p.placement?.startsWith("bottom-"),
          style: {
            ...getArrowPlacementStyles("bottom"),
            left: noRtlFlip(`${offsetX}px`),
          },
        },
        {
          props: (p: ArrowProps) => p.placement?.startsWith("left-"),
          style: {
            ...getArrowPlacementStyles("left", isRtl),
            top: `${offsetY}px`,
          },
        },
        {
          props: (p: ArrowProps) => p.placement?.startsWith("right-"),
          style: {
            ...getArrowPlacementStyles("right", isRtl),
            top: `${offsetY}px`,
          },
        },
      ],
    } as CSSObject;
  }
)