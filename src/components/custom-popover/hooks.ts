import { useCallback, useEffect, useState } from 'react'

// ----------------------------------------------------------------------

/**
 * Parses a string to a number, defaulting to 0 if invalid.
 */
function toNumber(value: string) {
  if (!value) return 0
  const parsed = parseFloat(value)
  return Number.isFinite(parsed) ? parsed : 0
}

/**
 * Extracts translate values from a CSS transform string.
 */
function extractTranslate(translate: string) {
  if (!translate || translate === 'none')
    return { translateX: 0, translateY: 0 }

  const [x, y] = translate.split(' ')

  return {
    translateX: toNumber(x),
    translateY: toNumber(y),
  }
}

// ----------------------------------------------------------------------

interface ElementRect {
  top: number
  left: number
  width: number
  height: number
}

export function useElementRect(element: any, context: string, open: boolean) {
  const [rect, setRect] = useState<ElementRect | null>(null)

  const updateRect = useCallback(() => {
    if (!element || !open) return

    let nextRect

    if (context === 'popoverPaper') {
      const { top, left, width, height, marginTop, marginLeft, translate } =
        getComputedStyle(element)
      const { translateX, translateY } = extractTranslate(translate)

      nextRect = {
        width: toNumber(width),
        height: toNumber(height),
        top: toNumber(top) + toNumber(marginTop) + translateY,
        left: toNumber(left) + toNumber(marginLeft) + translateX,
      }
    } else {
      const domRect = element.getBoundingClientRect()

      nextRect = {
        top: domRect.top,
        left: domRect.left,
        width: domRect.width,
        height: domRect.height,
      }
    }

    setRect(nextRect)
  }, [context, element, open])

  useEffect(() => {
    if (!element || !open) return

    updateRect()

    const resizeObserver = new ResizeObserver(updateRect)
    resizeObserver.observe(element)

    window.addEventListener('resize', updateRect, { passive: true })
    window.addEventListener('scroll', updateRect, { capture: true })

    // eslint-disable-next-line consistent-return
    return () => {
      resizeObserver.disconnect()
      window.removeEventListener('resize', updateRect)
      window.removeEventListener('scroll', updateRect)
    }
  }, [element, open, updateRect])

  return rect
}
