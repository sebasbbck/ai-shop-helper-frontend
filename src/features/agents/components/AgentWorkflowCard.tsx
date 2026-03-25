import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import { Chip, SxProps, Theme } from '@mui/material'
import { useState } from 'react'
import { CONFIG } from '../../../global-config'

// ----------------------------------------------------------------------

interface AgentWorkflowCardProps {
  title: string
  label?: string
  description?: string
  content?: React.ReactNode
  action?: React.ReactNode
  img?: React.ReactNode
  hoverImg?: React.ReactNode
  sx?: SxProps<Theme>
}

export function AgentWorkflowCard({
  title,
  label,
  description,
  content,
  action,
  img,
  hoverImg,
  sx,
  ...other
}: AgentWorkflowCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Box
      sx={[
        (theme) => ({
          ...theme.mixins.bgGradient({
            images: [
              `linear-gradient(135deg, #F3E9FF 0%, #FBF8FF 100%)`,
              `url(${CONFIG.assetsDir}/assets/background/background-5.webp)`,
            ],
          }),
          pt: 5,
          pb: 5,
          pr: 3,
          gap: 5,
          borderRadius: 2,
          display: 'flex',
          height: '400px',
          position: 'relative',
          pl: { xs: 3, md: 5 },
          alignItems: 'center',
          color: '#55329f',
          textAlign: { xs: 'center', md: 'left' },
          flexDirection: { xs: 'column', md: 'row' },
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
          justifyContent: 'space-between',
          height: '100%',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            // gap: 1,
            alignItems: 'left',
            flexDirection: 'column',
            flexShrink: 1,
          }}
        >
          {label && (
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
          )}

          <Typography variant="h4" sx={{ whiteSpace: 'pre-line', mb: 1 }}>
            {title}
          </Typography>

          {description && (
            <Typography variant="body2" sx={{ maxWidth: 750, mb: 2 }}>
              {description}
            </Typography>
          )}
        </Box>

        {content && content}

        {action && action}
      </Box>

      {(img || hoverImg) && (
        <Box
          className="app-agent-img-container"
          sx={{
            position: 'relative',
            width: 250,
            height: 300,
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
