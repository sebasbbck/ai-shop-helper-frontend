import { styled, SxProps, Theme } from '@mui/material/styles'
import { mergeClasses } from 'minimal-shared/utils'
import SimpleBar from 'simplebar-react'

import { scrollbarClasses } from './classes'

// ----------------------------------------------------------------------

interface ScrollbarProps {
  sx?: SxProps<Theme>
  children: React.ReactNode
  className?: string
  fillContent?: boolean
  ref?: React.Ref<HTMLElement>
  slotProps?: {
    wrapperSx?: SxProps<Theme>
    contentWrapperSx?: SxProps<Theme>
    contentSx?: SxProps<Theme>
  }
  [key: string]: any
}

export function Scrollbar({
  sx,
  ref,
  children,
  className,
  slotProps,
  fillContent = true,
  ...other
}: ScrollbarProps) {
  return (
    <ScrollbarRoot
      scrollableNodeProps={{ ref }}
      clickOnTrack={false}
      fillContent={fillContent}
      className={mergeClasses([scrollbarClasses.root, className])}
      sx={[
        {
          '& .simplebar-wrapper': slotProps?.wrapperSx,
          '& .simplebar-content-wrapper': slotProps?.contentWrapperSx,
          '& .simplebar-content': slotProps?.contentSx,
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      {children}
    </ScrollbarRoot>
  )
}

// ----------------------------------------------------------------------

const ScrollbarRoot = styled(SimpleBar, {
  shouldForwardProp: (prop) => !['fillContent', 'sx'].includes(prop as string),
})(({ fillContent }: { fillContent: boolean }) => ({
  minWidth: 0,
  minHeight: 0,
  flexGrow: 0,
  display: 'flex',
  flexDirection: 'column',
  ...(fillContent && {
    '& .simplebar-content': {
      display: 'flex',
      flex: '1 1 auto',
      minHeight: 'auto',
      flexDirection: 'column',
    },
  }),
  '& .simplebar-wrapper': {
    height: 'auto',
    maxHeight: 'inherit',
  },
  '& .simplebar-mask': {
    height: 'auto',
    maxHeight: 'inherit',
  },
  '& .simplebar-offset': {
    height: 'auto',
    maxHeight: 'inherit',
  },
  '& .simplebar-content-wrapper': {
    height: 'auto',
    maxHeight: 'inherit',
    overflow: 'auto !important',
  },

  '& .simplebar-placeholder': {
    display: 'none',
  },
}))
