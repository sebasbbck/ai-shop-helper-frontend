import { Iconify } from '../../../components/iconify'
import { CONFIG } from '../../../global-config'
import Alert from '@mui/material/Alert'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import { useTranslation } from 'next-i18next'

// ----------------------------------------------------------------------

interface Notification {
  id: string
  type: 'blog' | 'catalog' | 'system'
  title: string
  description: string
  time: string
  read: boolean
  ctaLabel: string
  targetTab: string
}

const NotificationCard = styled(Paper)<{ read?: boolean }>(
  ({ theme, read }) => ({
    padding: theme.spacing(3),
    borderRadius: (theme.shape.borderRadius as number) * 1.5,
    border: read
      ? `1px solid ${theme.palette.divider}`
      : `1px solid ${theme.palette.primary.light}`,
    backgroundColor: read ? theme.palette.background.paper : '#FFFFFF',
    opacity: read ? 0.8 : 1,
    boxShadow: read ? 'none' : `0 0 0 2px ${theme.palette.primary.main}10`,
    display: 'flex',
    alignItems: 'flex-start',
    gap: theme.spacing(2.5),
    marginBottom: theme.spacing(2),
  }),
)

const NotificationIconBox = styled(Box)<{ notiftype: string }>(({
  theme,
  notiftype,
}) => {
  let bgcolor = theme.palette.grey[100]
  let color = theme.palette.grey[600]

  if (notiftype === 'blog') {
    bgcolor = theme.palette.secondary.light
    color = theme.palette.secondary.dark
  } else if (notiftype === 'catalog') {
    bgcolor = theme.palette.primary.light
    color = theme.palette.primary.dark
  }

  return {
    padding: theme.spacing(1.5),
    borderRadius: theme.shape.borderRadius,
    backgroundColor: bgcolor,
    color: color,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  }
})

export default function Inbox() {
  const { t } = useTranslation()
  const title = t('translatiion:titles.inbox', '', { appName: CONFIG.appName })

  const mockNotifications: Notification[] = [
    {
      id: 'n1',
      type: 'blog',
      title: 'Nuevo post listo para tu blog',
      description:
        'El Redactor de blog ha terminado el artículo "Coworking vs Home Office: Optimizando productividad en 2026". Contiene 1.200 palabras y 3 imágenes optimizadas.',
      time: 'hace 5 minutos',
      read: false,
      ctaLabel: 'Revisar',
      targetTab: 'blog',
    },
    {
      id: 'n2',
      type: 'catalog',
      title: 'Análisis de catálogo finalizado',
      description:
        'Se han procesado 45 nuevas fichas de producto de la categoría "Calzado". Se detectaron 12 errores críticos.',
      time: 'hace 2 horas',
      read: true,
      ctaLabel: 'Revisar fichas',
      targetTab: 'revision',
    },
  ]

  return (
    <>
      <title>{title}</title>

      {/* <Fade in={true} timeout={500}> */}
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ mb: 4 }}
        >
          <Typography variant="h4" color="text.primary">
            Buzón de notificaciones
          </Typography>
          <Button
            variant="text"
            size="small"
            sx={{
              color: 'primary.main',
              fontWeight: 'bold',
              '&:hover': {
                color: 'primary.dark',
                backgroundColor: 'transparent',
              },
            }}
          >
            Marcar todo como leído
          </Button>
        </Stack>

        <Alert severity="info" sx={{ mb: 3 }}>
          Esta es una funcionalidad en desarrollo. Las notificaciones mostradas
          son de ejemplo y no representan avisos reales sobre acciones en tus
          proyectos.
        </Alert>

        <Stack spacing={2}>
          {mockNotifications.map((notif) => (
            <NotificationCard key={notif.id} read={notif.read} elevation={0}>
              <NotificationIconBox notiftype={notif.type}>
                {notif.type === 'blog' ? (
                  <Iconify icon="lucide:file-text" size={22} />
                ) : notif.type === 'catalog' ? (
                  <Iconify icon="lucide:bar-chart" size={22} />
                ) : (
                  <Iconify icon="lucide:zap" size={22} />
                )}
              </NotificationIconBox>

              <Box sx={{ flex: 1 }}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ mb: 0.5 }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                  >
                    {notif.title}
                    {!notif.read && (
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          bgcolor: 'primary.light',
                          borderRadius: '50%',
                        }}
                      />
                    )}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: 'text.secondary', fontWeight: 700 }}
                  >
                    {notif.time}
                  </Typography>
                </Stack>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2.5, lineHeight: 1.6 }}
                >
                  {notif.description}
                </Typography>

                <Button
                  onClick={() => console.log('click')}
                  color="primary"
                  variant="contained"
                  endIcon={<Iconify icon="lucide:chevron-right" size={16} />}
                  sx={{
                    px: 3,
                    py: 1,
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  {notif.ctaLabel}
                </Button>
              </Box>
            </NotificationCard>
          ))}
        </Stack>
      </Container>
      {/* </Fade> */}
    </>
  )
}
