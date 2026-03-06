import { SxProps, Theme } from '@mui/material'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

// ----------------------------------------------------------------------
// TODO: i18n

interface SearchNotFoundProps {
  query: string
  sx?: SxProps<Theme>
  slotProps?: {
    title?: { sx?: SxProps<Theme> }
    description?: { sx?: SxProps<Theme> }
  }
  [key: string]: any
}

export function SearchNotFound({
  query,
  sx,
  slotProps,
  ...other
}: SearchNotFoundProps) {
  if (!query) {
    return (
      <Typography variant="body2" {...slotProps?.description}>
        Please enter keywords
      </Typography>
    )
  }

  return (
    <Box
      sx={[
        {
          gap: 1,
          display: 'flex',
          borderRadius: 1.5,
          textAlign: 'center',
          flexDirection: 'column',
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <Typography
        variant="h6"
        {...slotProps?.title}
        sx={[
          { color: 'text.primary' },
          ...(Array.isArray(slotProps?.title?.sx)
            ? slotProps.title.sx
            : [slotProps?.title?.sx]),
        ]}
      >
        Not found
      </Typography>

      <Typography variant="body2" {...slotProps?.description}>
        No results found for &nbsp;
        <strong>{`"${query}"`}</strong>
        .
        <br /> Try checking for typos or using complete words.
      </Typography>
    </Box>
  )
}
