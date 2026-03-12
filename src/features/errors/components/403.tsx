import { m } from 'framer-motion'

import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import { ForbiddenIllustration } from '../../../assets/illustrations'
import { varBounce, MotionContainer } from '../../../components/animate'
import NextLink from 'next/link'
import { useTranslation } from 'next-i18next'
import { DashboardContent } from '../../../components/layouts/dashboard'
import Box from '@mui/material/Box'

// ----------------------------------------------------------------------

export function Forbidden() {
  const { t } = useTranslation()

  return (
    <DashboardContent maxWidth="md">
      <Container sx={{ textAlign: 'center' }} component={MotionContainer}>
        <m.div variants={varBounce('in')}>
          <Typography variant="h3" sx={{ mb: 2 }}>
            {t('translation:403.title')}
          </Typography>
        </m.div>

        <m.div variants={varBounce('in')}>
          <Typography sx={{ color: 'text.secondary' }}>
            {t('translation:403.description')}
          </Typography>
        </m.div>

        <m.div variants={varBounce('in')}>
          <ForbiddenIllustration
            sx={{ my: { xs: 5, sm: 10 } }}
            hideBackground={false}
          />
        </m.div>

        <Button component={NextLink} href="/" size="large" variant="contained">
          {t('translation:404.return')}
        </Button>
      </Container>
    </DashboardContent>
  )
}
