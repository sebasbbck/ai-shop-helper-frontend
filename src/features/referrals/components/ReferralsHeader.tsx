import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import { Chip, SxProps, Theme } from '@mui/material'
import { useState } from 'react'

// ----------------------------------------------------------------------

interface ReferralsHeaderProps {
  title: string
  label: string
  description: string
  action?: React.ReactNode
  img?: React.ReactNode
  hoverImg?: React.ReactNode
  sx?: SxProps<Theme>
}

export function ReferralsHeader({
  title,
  label,
  description,
  action,
  img,
  hoverImg,
  sx,
  ...other
}: ReferralsHeaderProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Box
      sx={[
        (theme) => ({
          ...theme.mixins.bgGradient({
            images: [`linear-gradient(to bottom, #2563eb 0%, #1e40af 75%)`],
          }),
          pt: 2,
          pb: 2,
          pr: 3,
          mb: 4,
          gap: 5,
          borderRadius: 3,
          display: 'flex',
          height: { md: 1 },
          position: 'relative',
          pl: { xs: 3, md: 5 },
          alignItems: 'center',
          color: 'common.white',
          textAlign: { xs: 'center', md: 'left' },
          flexDirection: { xs: 'column', md: 'row' },
          backdropFilter: 'blur(5px)',
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...other}
    >
      <Box
        sx={{
          display: 'flex',
          flex: '1 1 auto',
          flexDirection: 'column',
          alignItems: { xs: 'center', md: 'flex-start' },
        }}
      >
        <Chip
          label={label}
          size="small"
          sx={{
            bgcolor: 'rgba(255,255,255,0.2)',
            color: 'white',
            mb: 1,
            fontWeight: 'bold',
          }}
        />

        <Typography variant="h3" sx={{ whiteSpace: 'pre-line', mb: 1 }}>
          {title}
        </Typography>

        <Typography
          variant="h6"
          sx={{ opacity: 0.64, maxWidth: 500, ...(action && { mb: 3 }) }}
        >
          {description}
        </Typography>

        {action && action}
      </Box>

      {(img || hoverImg) && (
        <Box
          className="app-agent-img-container"
          sx={{
            position: 'relative',
            width: 240,
            height: 240,
            flexShrink: 0, // Prevents the image from squishing
          }}
        >
          {img && (
            <Box
              sx={{
                width: '100%',
                height: '100%',
                transition: 'opacity 0.3s ease-in-out',
                opacity: isHovered && hoverImg ? 0 : 1,
              }}
            >
              {img}
            </Box>
          )}

          {hoverImg && (
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                transition: 'opacity 0.3s ease-in-out',
                opacity: isHovered ? 1 : 0,
              }}
            >
              {hoverImg}
            </Box>
          )}
        </Box>
      )}
    </Box>
  )
}
