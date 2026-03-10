import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import { m } from 'framer-motion'
import { PageNotFoundIllustration } from '../../../assets/illustrations'
import { MotionContainer, varBounce } from '../../../components/animate'
import NextLink from 'next/link'
import { useTranslation } from 'next-i18next'

// ----------------------------------------------------------------------

export function NotFound() {
  const { t } = useTranslation()
  return (
    <Container component={MotionContainer}>
      <m.div variants={varBounce('in')}>
        <Typography variant="h3" sx={{ mb: 2 }}>
          {t('translation:404.title')}
        </Typography>
      </m.div>

      <m.div variants={varBounce('in')}>
        <Typography sx={{ color: 'text.secondary' }}>
          {t('translation:404.description')}
        </Typography>
      </m.div>

      <m.div variants={varBounce('in')}>
        <PageNotFoundIllustration
          hideBackground={false}
          sx={{ my: { xs: 5, sm: 10 } }}
        />
      </m.div>

      <Button component={NextLink} href="/" size="large" variant="contained">
        {t('translation:404.return')}
      </Button>
    </Container>
  )
}
