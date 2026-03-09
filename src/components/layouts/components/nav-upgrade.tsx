import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { varAlpha } from 'minimal-shared/utils'
import { CONFIG } from '../../../global-config'
import { useTranslation } from 'next-i18next'
import NextLink from 'next/link'
import { SxProps, Theme } from '@mui/material'

// ----------------------------------------------------------------------

interface UpgradeBlockProps {
  sx?: SxProps<Theme>
  [key: string]: any
}

export function UpgradeBlock({ sx, ...other }: UpgradeBlockProps) {
  const { t } = useTranslation()

  return (
    <Box
      sx={[
        (theme: any) => ({
          ...theme.mixins.bgGradient({
            images: [
              `linear-gradient(135deg, ${varAlpha(theme.vars.palette.error.lightChannel, 0.92)}, ${varAlpha(theme.vars.palette.secondary.darkChannel, 0.92)})`,
            ],
          }),
          px: 3,
          py: 4,
          borderRadius: 2,
          position: 'relative',
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <Box
        sx={(theme) => ({
          top: 0,
          left: 0,
          width: 1,
          height: 1,
          borderRadius: 2,
          position: 'absolute',
          border: `solid 3px ${varAlpha(theme.vars.palette.common.whiteChannel, 0.16)}`,
        })}
      />

      {/*
      <Box
        component={m.img}
        animate={{ y: [12, -12, 12] }}
        transition={{
          duration: 8,
          ease: "linear",
          repeat: Infinity,
          repeatDelay: 0,
        }}
        alt="Small Rocket"
        src={`${CONFIG.assetsDir}/assets/illustrations/illustration-rocket-small.webp`}
        sx={{
          right: 0,
          width: 112,
          height: 112,
          position: "absolute",
        }}
      />
      */}

      <Box
        sx={{
          display: 'flex',
          position: 'relative',
          flexDirection: 'column',
          alignItems: 'flex-start',
        }}
      >
        <Box component="span" sx={{ typography: 'h5', color: 'common.white' }}>
          {t('translation:layout.upgrade_card.title')}
        </Box>

        <Box
          component="span"
          sx={{
            mb: 2,
            mt: 0.5,
            color: 'common.white',
            typography: 'subtitle2',
          }}
        >
          {t('translation:layout.upgrade_card.subtitle')}
        </Box>

        <Button
          component={NextLink}
          href="/$lang/settings/billing"
          variant="contained"
          size="small"
          color="warning"
        >
          {t('translation:layout.upgrade_card.cta')}
        </Button>
      </Box>
    </Box>
  )
}
