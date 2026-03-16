import { upperFirst } from 'es-toolkit'
import { mergeClasses } from 'minimal-shared/utils'

import { labelClasses } from './classes'
import { LabelIcon, LabelRoot } from './styles'
import { SxProps, Theme } from '@mui/system'

// ----------------------------------------------------------------------

interface LabelProps {
  sx?: SxProps<Theme>
  startIcon?: React.ReactNode
  endIcon?: React.ReactNode
  children?: React.ReactNode
  className?: string
  disabled?: boolean
  variant?: 'filled' | 'outlined' | 'soft' | 'inverted'
  color?:
    | 'default'
    | 'primary'
    | 'secondary'
    | 'info'
    | 'success'
    | 'warning'
    | 'error'
  [key: string]: any
}

export function Label({
  sx,
  endIcon,
  children,
  startIcon,
  className,
  disabled,
  variant = 'soft',
  color = 'default',
  ...other
}: LabelProps) {
  return (
    <LabelRoot
      color={color}
      variant={variant}
      disabled={disabled}
      className={mergeClasses([labelClasses.root, className])}
      sx={sx}
      {...other}
    >
      {startIcon && (
        <LabelIcon className={labelClasses.icon}>{startIcon}</LabelIcon>
      )}

      {typeof children === 'string' ? upperFirst(children) : children}

      {endIcon && (
        <LabelIcon className={labelClasses.icon}>{endIcon}</LabelIcon>
      )}
    </LabelRoot>
  )
}
