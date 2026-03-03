// ----------------------------------------------------------------------

import { PopoverOrigin } from "@mui/material/Popover"

type PopoverPlacement = keyof typeof ORIGIN_MAP

const ORIGIN_MAP = {
  "top-left": {
    anchorOrigin: { vertical: "bottom", horizontal: "left" },
    transformOrigin: { vertical: "top", horizontal: "left" },
  },
  "top-center": {
    anchorOrigin: { vertical: "bottom", horizontal: "center" },
    transformOrigin: { vertical: "top", horizontal: "center" },
  },
  "top-right": {
    anchorOrigin: { vertical: "bottom", horizontal: "right" },
    transformOrigin: { vertical: "top", horizontal: "right" },
  },
  "bottom-left": {
    anchorOrigin: { vertical: "top", horizontal: "left" },
    transformOrigin: { vertical: "bottom", horizontal: "left" },
  },
  "bottom-center": {
    anchorOrigin: { vertical: "top", horizontal: "center" },
    transformOrigin: { vertical: "bottom", horizontal: "center" },
  },
  "bottom-right": {
    anchorOrigin: { vertical: "top", horizontal: "right" },
    transformOrigin: { vertical: "bottom", horizontal: "right" },
  },
  "left-top": {
    anchorOrigin: { vertical: "top", horizontal: "right" },
    transformOrigin: { vertical: "top", horizontal: "left" },
  },
  "left-center": {
    anchorOrigin: { vertical: "center", horizontal: "right" },
    transformOrigin: { vertical: "center", horizontal: "left" },
  },
  "left-bottom": {
    anchorOrigin: { vertical: "bottom", horizontal: "right" },
    transformOrigin: { vertical: "bottom", horizontal: "left" },
  },
  "right-top": {
    anchorOrigin: { vertical: "top", horizontal: "left" },
    transformOrigin: { vertical: "top", horizontal: "right" },
  },
  "right-center": {
    anchorOrigin: { vertical: "center", horizontal: "left" },
    transformOrigin: { vertical: "center", horizontal: "right" },
  },
  "right-bottom": {
    anchorOrigin: { vertical: "bottom", horizontal: "left" },
    transformOrigin: { vertical: "bottom", horizontal: "right" },
  },
}

/**
 * Flips the horizontal position of a PopoverOrigin for RTL support.
 */
function flipHorizontal(origin: { horizontal: string }) {
  if (origin.horizontal === "left") return { ...origin, horizontal: "right" }
  if (origin.horizontal === "right") return { ...origin, horizontal: "left" }
  return origin
}

/**
 * Gets the popover origin pair for a given placement, with optional RTL flipping.
 */
export function getPopoverOrigin(placement: PopoverPlacement, isRtl: boolean) {
  const originPair = ORIGIN_MAP[placement];

  if (isRtl) {
    return {
      anchorOrigin: flipHorizontal(originPair.anchorOrigin) as PopoverOrigin,
      transformOrigin: flipHorizontal(originPair.transformOrigin) as PopoverOrigin,
    };
  }

  // Cast the static map values to the official MUI Type
  return originPair as { anchorOrigin: PopoverOrigin; transformOrigin: PopoverOrigin };
}

// ----------------------------------------------------------------------

/**
 * Calculates the arrow offset to center it on the anchor while clamping within the paper bounds.
 */
export function getArrowOffset(
  anchorRect: { left: number; width: number; top: number; height: number }, 
  paperRect: { left: number; top: number; width: number; height: number }, 
  arrowSize: number
) {
  // Calculate the center of the anchor relative to the paper
  const anchorCenterX = anchorRect.left - paperRect.left + anchorRect.width / 2
  const anchorCenterY = anchorRect.top - paperRect.top + anchorRect.height / 2

  // Initial offset so arrow is centered on anchor
  let offsetX = anchorCenterX - arrowSize / 2
  let offsetY = anchorCenterY - arrowSize / 2

  // Clamp the arrow position so it doesn't overflow the paper
  const minOffset = arrowSize / 2
  const maxOffsetX = paperRect.width - arrowSize * 2
  const maxOffsetY = paperRect.height - arrowSize * 2

  offsetX = Math.max(minOffset, Math.min(offsetX, maxOffsetX))
  offsetY = Math.max(minOffset, Math.min(offsetY, maxOffsetY))

  return { offsetX, offsetY }
}
