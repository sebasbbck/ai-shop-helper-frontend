import Box from "@mui/material/Box"
import { varAlpha } from "minimal-shared/utils"

import { OptionButton } from "./styles"
import { SxProps, Theme } from "@mui/material"

// ----------------------------------------------------------------------

interface NavLayoutOptionsProps {
  sx?: SxProps<Theme>,
  value: string,
  options: {
    value: string,
    icon: React.ReactNode
  }[],
  onChangeOption: (o: string) => any
}

export function NavLayoutOptions({
  sx,
  value,
  options,
  onChangeOption,
  ...other
}: NavLayoutOptionsProps) {
  return (
    <Box
      sx={[
        {
          gap: 1.5,
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      {options.map((option) => {
        const selected = value === option.value

        return (
          <OptionButton
            key={option.value}
            selected={selected}
            onClick={() => onChangeOption(option.value)}
            sx={[
              (theme: any) => ({ // TODO: replace any with the actual type?
                height: 64,
                border: `solid 1px ${varAlpha(theme.vars.palette.grey["500Channel"], 0.08)}`,
              }),
            ]}
          >
            {option.icon}
          </OptionButton>
        )
      })}
    </Box>
  )
}

// ---------------------------------------------------------------------
// 
interface NavColorOptionsProps {
  sx?: SxProps<Theme>,
  value: string,
  options: {
    value: string,
    icon: React.ReactNode,
    label: string,
  }[],
  onChangeOption: (o: string) => any
}

export function NavColorOptions({
  sx,
  value,
  options,
  onChangeOption,
  ...other
}: NavColorOptionsProps) {
  return (
    <Box
      sx={[
        {
          gap: 1.5,
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      {options.map((option) => {
        const selected = value === option.value

        return (
          <OptionButton
            key={option.value}
            selected={selected}
            onClick={() => onChangeOption(option.value)}
            sx={{ gap: 1.5, height: 56 }}
          >
            {option.icon}
            {option.label}
          </OptionButton>
        )
      })}
    </Box>
  )
}
