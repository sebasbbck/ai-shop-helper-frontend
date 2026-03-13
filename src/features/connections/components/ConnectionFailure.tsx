import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import SvgIcon from '@mui/material/SvgIcon'
import { m } from 'framer-motion'
import { MotionContainer, varBounce } from '../../../components/animate'
import NextLink from 'next/link'
import { useTranslation } from 'next-i18next'

// ----------------------------------------------------------------------

export function ConnectionFailure() {
  const { t } = useTranslation()

  return (
    <Container component={MotionContainer}>
      <m.div variants={varBounce('in')}>
        <Typography variant="h3" sx={{ mb: 2 }}>
          {t('translation:connection.failure_title')}
        </Typography>
      </m.div>

      <m.div variants={varBounce('in')}>
        <Typography sx={{ color: 'text.secondary' }}>
          {t('translation:connection.failure_description')}
        </Typography>
      </m.div>

      <m.div variants={varBounce('in')}>
        <SvgIcon sx={{ width: 240, height: 240, my: { xs: 5, sm: 10 } }}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 48"
            width="240px"
            height="240px"
          >
            <path
              fill="#f44336"
              d="M44,24c0,11.045-8.955,20-20,20S4,35.045,4,24S12.955,4,24,4S44,12.955,44,24z"
            />
            <path
              fill="#fff"
              d="M29.656,15.516l2.828,2.828l-14.14,14.14l-2.828-2.828L29.656,15.516z"
            />
            <path
              fill="#fff"
              d="M32.484,29.656l-2.828,2.828l-14.14-14.14l2.828-2.828L32.484,29.656z"
            />
          </svg>
        </SvgIcon>
      </m.div>

      <Button component={NextLink} href="/" size="large" variant="contained">
        {t('translation:connection.failure_button')}
      </Button>

      <Typography variant="body2" sx={{ mt: 3, color: 'text.secondary' }}>
        <a target="_blank" href="https://icons8.com/icon/63688/cancel">
          Cross Mark
        </a>{' '}
        icon by{' '}
        <a target="_blank" href="https://icons8.com">
          Icons8
        </a>
      </Typography>
    </Container>
  )
}
