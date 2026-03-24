import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { useRouter } from 'next/router'

import { AppAgent } from './AppAgent'
import useAuth from '../../../hooks/useAuth'
import useCustomToast from '../../../hooks/useCustomToast'
import { useTranslation } from 'next-i18next'
import { CONFIG } from '../../../global-config'
import { DashboardContent } from '../../../components/layouts/dashboard'
import { Alert } from '@mui/material'

// ----------------------------------------------------------------------

export default function Page() {
  const router = useRouter()
  const { user } = useAuth()
  const { showInfoToast } = useCustomToast()
  const { t } = useTranslation()
  const title = t('translation:titles.home', '', { appName: CONFIG.appName })

  return (
    <>
      <title>{title}</title>
      <DashboardContent maxWidth="xl">
        <Alert severity="info" sx={{ mb: 3 }}>
          Esta página era la antigua página principal. De momento se conserva
          como referencia, pero los agentes no están enlazados. Será eliminada
          próximamente.
        </Alert>
        <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
          {user?.is_superuser
            ? t('translation:team.hello_admin', '', { name: user?.name })
            : t('translation:team.hello_user', '', { name: user?.name })}
        </Typography>

        <Grid container spacing={3}>
          <Grid
            id="docs-demo-step2"
            size={{ xs: 16, md: 6 }}
            onClick={() => router.push('/agents/blog-writer')}
          >
            <AppAgent
              title={t('translation:team.agents.blog.title')}
              description={t('translation:team.agents.blog.description')}
              imgSrc="/assets/images/herramienta-blog.png"
              hoverImgSrc="/assets/animations/herramienta-blog-animada.gif"
              alt="Redactor de blog"
              gradient="linear-gradient(135deg, #E3F0FF 0%, #F8FBFF 100%)"
              titleColour="#1e63ac"
              disabled={false}
            />
          </Grid>

          <Grid
            size={{ xs: 16, md: 6 }}
            onClick={() => showInfoToast(t('translation:toasts.coming_soon'))}
          >
            <AppAgent
              title={t('translation:team.agents.catalogue_organiser.title')}
              description={t(
                'translation:team.agents.catalogue_organiser.description',
              )}
              imgSrc="/assets/images/herramienta-organizadora-catalogo.png"
              hoverImgSrc="/assets/images/herramienta-organizadora-catalogo.png"
              alt="Organizadora de catálogo"
              gradient="linear-gradient(135deg, #F3E9FF 0%, #FBF8FF 100%)"
              titleColour="#55329f"
              disabled
            />
          </Grid>

          <Grid
            size={{ xs: 16, md: 6 }}
            onClick={() => showInfoToast(t('translation:toasts.coming_soon'))}
          >
            <AppAgent
              title={t('translation:team.agents.product_optimiser.title')}
              description={t(
                'translation:team.agents.product_optimiser.description',
              )}
              imgSrc="/assets/images/herramienta-optimizador-producto.png"
              hoverImgSrc="/assets/images/herramienta-optimizador-producto.png"
              alt="Optimizador de productos"
              gradient="linear-gradient(135deg, #E7FAFF 0%, #F9FEFF 100%)"
              titleColour="#0b97c6"
              disabled
            />
          </Grid>

          <Grid
            size={{ xs: 16, md: 6 }}
            onClick={() => showInfoToast(t('translation:toasts.coming_soon'))}
          >
            <AppAgent
              title={t('translation:team.agents.a/b_testing_expert.title')}
              description={t(
                'translation:team.agents.a/b_testing_expert.description',
              )}
              imgSrc="/assets/images/herramienta-a-b-testing.png"
              hoverImgSrc="/assets/images/herramienta-a-b-testing.png"
              alt="Experto en tests A/B"
              gradient="linear-gradient(135deg, #FFF3E5 0%, #FFFAF5 100%)"
              titleColour="#ef5f01"
              disabled
            />
          </Grid>
        </Grid>
      </DashboardContent>
    </>
  )
}
