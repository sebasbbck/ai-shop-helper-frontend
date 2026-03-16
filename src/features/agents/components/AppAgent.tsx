import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { useState } from 'react'
import { useTranslation } from 'next-i18next'

import { CONFIG } from '../../../global-config'
import { SxProps, Theme } from '@mui/material'

// ----------------------------------------------------------------------

interface AppAgentProps {
  title: string
  description: string
  imgSrc: string
  hoverImgSrc: string
  alt: string
  sx?: SxProps<Theme>
  gradient: string
  titleColour: string
  disabled: boolean
  [key: string]: any
}

export function AppAgent({
  title,
  description,
  imgSrc,
  hoverImgSrc,
  alt,
  sx,
  gradient,
  titleColour,
  disabled,
  ...other
}: AppAgentProps) {
  const [isHovered, setIsHovered] = useState(false)
  const { t } = useTranslation()

  return (
    <Box
      sx={[
        (theme) => ({
          ...(theme as any).mixins.bgGradient({
            images: [gradient],
          }),

          pt: 2,
          pb: 2,
          pr: 2,
          gap: 5,
          borderRadius: 3,
          display: 'flex',
          height: { md: 1 },
          position: 'relative',
          pl: { xs: 2, md: 3 },
          alignItems: 'center',
          textAlign: { xs: 'center', md: 'left' },
          flexDirection: { xs: 'column', md: 'row' },
          transition: 'transform 0.25s ease-in-out',

          ...(!disabled && {
            '&:hover': {
              cursor: 'pointer',
              transform: 'scale(1.05)',
            },
          }),

          ...(disabled && {
            cursor: 'not-allowed',
            '&::after': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backdropFilter: 'grayscale(75%)', // Optional: desaturates content
              zIndex: 1,
            },
          }),
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...other}
    >
      {imgSrc && (
        <Box
          className="app-agent-img"
          sx={{
            maxWidth: '200px',
            height: '200px',
            overflow: 'hidden',
            display: !isHovered ? 'block' : 'none',
          }}
        >
          <img
            src={imgSrc}
            alt={alt}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
            }}
          />
        </Box>
      )}
      {hoverImgSrc && (
        <Box
          className="app-agent-img"
          sx={{
            maxWidth: '200px',
            height: '200px',
            overflow: 'hidden',
            display: isHovered ? 'block' : 'none',
          }}
        >
          <img
            src={hoverImgSrc}
            alt={alt}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
            }}
          />
        </Box>
      )}

      <Box
        sx={{
          display: 'flex',
          flex: '1 1 auto',
          flexDirection: 'column',
          alignItems: { xs: 'center', md: 'flex-start' },
        }}
      >
        <Typography
          variant="h3"
          sx={{ whiteSpace: 'pre-line', mb: 1, color: titleColour }}
        >
          {isHovered && disabled
            ? t('translation:team.agents.coming_soon.title')
            : title}
        </Typography>

        <Typography variant="body1" sx={{ opacity: 0.64, maxWidth: 400 }}>
          {isHovered && disabled
            ? t('translation:team.agents.coming_soon.description')
            : description}
        </Typography>
      </Box>
    </Box>
  )
}
