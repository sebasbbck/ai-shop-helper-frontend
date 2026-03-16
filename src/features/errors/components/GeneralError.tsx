import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import { m } from 'framer-motion'
import { ServerErrorIllustration } from '../../../assets/illustrations'
import { MotionContainer, varBounce } from '../../../components/animate'
import { useTranslation } from 'next-i18next'
import { Box } from '@mui/material'
import NextLink from 'next/link'

// ----------------------------------------------------------------------

export function GeneralError(statusCode: any) {
  const { t } = useTranslation()

  return (
    <Container component={MotionContainer}>
      <m.div variants={varBounce('in')}>
        <Typography variant="h3" sx={{ mb: 2 }}>
          {t('translation:errors.fallbacks.default')}
        </Typography>
      </m.div>

      <m.div variants={varBounce('in')}>
        <Typography sx={{ color: 'text.secondary' }}>Error 500</Typography>
      </m.div>

      <m.div variants={varBounce('in')}>
        <ServerErrorIllustration
          hideBackground={false}
          sx={{ my: { xs: 5, sm: 10 } }}
        />
      </m.div>

      <Box
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <Button
          component={NextLink}
          href="/$lang"
          size="large"
          variant="contained"
          sx={{ mr: 2 }}
        >
          {t('translation:404.return')}
        </Button>
      </Box>
    </Container>
  )
}
