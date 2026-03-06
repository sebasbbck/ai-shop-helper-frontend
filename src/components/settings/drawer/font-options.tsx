import Box from '@mui/material/Box'
import Slider, { sliderClasses } from '@mui/material/Slider'
import { setFont } from 'minimal-shared/utils'

import { OptionButton } from './styles'
import { ReactNode } from 'react'
import { SxProps, Theme } from '@mui/material'

// ----------------------------------------------------------------------

interface FontFamilyOptionsProps {
  sx?: SxProps<Theme>
  icon: ReactNode
  value: string
  options: string[]
  onChangeOption: (o: string) => any
}

export function FontFamilyOptions({
  sx,
  icon,
  value,
  options,
  onChangeOption,
  ...other
}: FontFamilyOptionsProps) {
  return (
    <Box
      sx={[
        {
          gap: 1.5,
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      {options.map((option) => {
        const selected = value === option

        return (
          <OptionButton
            key={option}
            selected={selected}
            onClick={() => onChangeOption(option)}
            sx={(theme: any) => ({
              // TODO: replace any with the actual type?
              py: 2,
              gap: 0.75,
              flexDirection: 'column',
              fontFamily: setFont(option),
              fontSize: theme.typography.pxToRem(12),
            })}
          >
            {icon}
            {option.endsWith('Variable')
              ? option.replace(' Variable', '')
              : option}
          </OptionButton>
        )
      })}
    </Box>
  )
}

// ----------------------------------------------------------------------

interface FontSizeOptionsProps {
  sx?: SxProps<Theme>
  value: number
  options: number[]
  onChangeOption: (o: number) => any
}

export function FontSizeOptions({
  sx,
  value,
  options,
  onChangeOption,
  ...other
}: FontSizeOptionsProps) {
  return (
    <Slider
      marks
      step={1}
      size="small"
      valueLabelDisplay="on"
      aria-label="Change font size"
      valueLabelFormat={(val) => `${val}px`}
      value={value}
      min={options[0]}
      max={options[1]}
      onChange={(_event, newOption) => onChangeOption(newOption)}
      sx={[
        (theme) => ({
          [`& .${sliderClasses.rail}`]: {
            height: 12,
          },
          [`& .${sliderClasses.track}`]: {
            height: 12,
            background: `linear-gradient(135deg, ${theme.vars.palette.primary.light}, ${theme.vars.palette.primary.dark})`,
          },
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    />
  )
}
