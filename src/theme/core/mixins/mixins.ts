import { varAlpha } from 'minimal-shared/utils'
import { bgBlur, bgGradient } from './background'
import { borderGradient } from './border'
import {
  filledStyles,
  menuItemStyles,
  paperStyles,
  softStyles,
} from './global-styles-components'
import { maxLine, textGradient } from './text'

// ----------------------------------------------------------------------

/* **********************************************************************
 * 📦 Final
 * **********************************************************************/
export const mixins = {
  hideScrollX: {
    msOverflowStyle: 'none',
    scrollbarWidth: 'none',
    overflowX: 'auto',
    '&::-webkit-scrollbar': { display: 'none' },
  },
  hideScrollY: {
    msOverflowStyle: 'none',
    scrollbarWidth: 'none',
    overflowY: 'auto',
    '&::-webkit-scrollbar': { display: 'none' },
  },
  scrollbarStyles: (theme: any) => ({
    scrollbarWidth: 'thin',
    scrollbarColor: `${varAlpha(theme.vars.palette.text.disabledChannel, 0.4)} ${varAlpha(theme.vars.palette.text.disabledChannel, 0.08)}`,
  }),
  bgBlur,
  maxLine,
  bgGradient,
  softStyles,
  paperStyles,
  textGradient,
  filledStyles,
  borderGradient,
  menuItemStyles,
}
