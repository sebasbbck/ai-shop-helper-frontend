import Box from '@mui/material/Box'
import { alpha as hexAlpha, SxProps, Theme } from '@mui/material/styles'

import { OptionButton } from './styles'
import Tooltip from '@mui/material/Tooltip'

// ----------------------------------------------------------------------

interface PresetsOptionsProps {
  sx?: SxProps<Theme>
  value: string
  icon: React.ReactNode
  options: {
    name: string
    value: string
    icon: React.ReactNode
    tooltip?: string
  }[]
  onChangeOption: (o: string) => any
}

export function PresetsOptions({
  sx,
  icon,
  value,
  options,
  onChangeOption,
  ...other
}: PresetsOptionsProps) {
  return (
    <Box
      sx={[
        {
          gap: 1.5,
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      {options.map((option) => {
        const selected = value === option.name

        return (
          <>
            {option.tooltip ? (
              <Tooltip
                arrow
                title={option.tooltip}
                slotProps={{ tooltip: { sx: { maxWidth: 240, mr: 0.5 } } }}
              >
                <OptionButton
                  key={option.name}
                  onClick={() => onChangeOption(option.name)}
                  sx={{
                    height: 64,
                    color: option.value,

                    ...(selected && {
                      bgcolor: hexAlpha(option.value, 0.08),
                    }),
                  }}
                  selected={undefined}
                >
                  {option.icon ? option.icon : icon}
                </OptionButton>
              </Tooltip>
            ) : (
              <OptionButton
                key={option.name}
                onClick={() => onChangeOption(option.name)}
                sx={{
                  height: 64,
                  color: option.value,

                  ...(selected && {
                    bgcolor: hexAlpha(option.value, 0.08),
                  }),
                }}
                selected={undefined}
              >
                {option.icon ? option.icon : icon}
              </OptionButton>
            )}
          </>
        )
      })}
    </Box>
  )
}
