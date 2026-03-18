import { useForm, Controller } from 'react-hook-form'

import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Alert from '@mui/material/Alert'
import Switch from '@mui/material/Switch'
import Button from '@mui/material/Button'
import ListItemText from '@mui/material/ListItemText'
import FormControlLabel from '@mui/material/FormControlLabel'
import { SxProps, Theme } from '@mui/material/styles'

import useCustomToast from '../../../hooks/useCustomToast'
import { Form } from '../../../components/hook-form'

// ----------------------------------------------------------------------

const NOTIFICATIONS = [
  {
    subheader: 'Agentes',
    // caption: 'Donec mi odio, faucibus at, scelerisque quis',
    items: [
      {
        id: 'activity_comments',
        label: 'Recibir un email cuando he generado una publicación',
      },
      {
        id: 'activity_answers',
        label:
          'Recibir un email cuando se ha publicado una publicación programada',
      },
      {
        id: 'activity_answers',
        label:
          'Recibir emails de recordatorio de mis publicaciones programadas',
      },
    ],
  },
  {
    subheader: 'Proyecto',
    // caption: 'Donec mi odio, faucibus at, scelerisque quis',
    items: [
      {
        id: 'application_news',
        label: 'Recibir un email cuando un usuario se une a mis proyectos',
      },
      {
        id: 'application_product',
        label: 'Recibir un email cuando un usuario abandona mis proyectos',
      },
      {
        id: 'application_blog',
        label:
          'Recibir emails diarios con las acciones realizadas en tus proyectos',
      },
    ],
  },
  {
    subheader: 'Créditos',
    // caption: 'Donec mi odio, faucibus at, scelerisque quis',
    items: [
      {
        id: 'application_news',
        label: 'Recibir un email con una factura al final de cada mes',
      },
      {
        id: 'application_product',
        label: 'Recibir un email con un resumen de gastos al final de cada mes',
      },
    ],
  },
  {
    subheader: 'Otros',
    caption: '',
    items: [{ id: 'application_news', label: 'Recibir emails promocionales' }],
  },
]

interface AccountNotificationProps {
  sx?: SxProps<Theme>
  [key: string]: any
}

// ----------------------------------------------------------------------

export function SettingsNotifications({
  sx,
  ...other
}: AccountNotificationProps) {
  const methods = useForm({
    defaultValues: { selected: ['activity_comments', 'application_product'] },
  })

  const {
    watch,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods

  const values = watch()
  const { showSuccessToast } = useCustomToast()

  const onSubmit = handleSubmit(async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      showSuccessToast('Update success!')
      console.info('DATA', data)
    } catch (error) {
      console.error(error)
    }
  })

  const getSelected = (selectedItems: any, item: any) =>
    selectedItems.includes(item)
      ? selectedItems.filter((value: any) => value !== item)
      : [...selectedItems, item]

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Alert severity="info" sx={{ mb: 3 }}>
        Esta es una funcionalidad en desarrollo. Los ajustes mostrados son de
        ejemplo y cambiarlos no tendrá efecto en los avisos que recibes.
      </Alert>

      <Card
        sx={[
          {
            p: 3,
            gap: 3,
            display: 'flex',
            flexDirection: 'column',
          },
          ...(Array.isArray(sx) ? sx : [sx]),
        ]}
        {...other}
      >
        {NOTIFICATIONS.map((notification) => (
          <Grid key={notification.subheader} container spacing={3}>
            <Grid size={{ xs: 12, md: 4 }}>
              <ListItemText
                primary={notification.subheader}
                secondary={notification.caption}
                slotProps={{
                  primary: { sx: { typography: 'h6' } },
                  secondary: { sx: { mt: 0.5 } },
                }}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 8 }}>
              <Box
                sx={{
                  p: 3,
                  gap: 1,
                  borderRadius: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  bgcolor: 'background.neutral',
                }}
              >
                <Controller
                  name="selected"
                  control={control}
                  render={({ field }) => (
                    <>
                      {notification.items.map((item) => (
                        <FormControlLabel
                          key={item.id}
                          label={item.label}
                          labelPlacement="start"
                          control={
                            <Switch
                              checked={field.value.includes(item.id)}
                              onChange={() =>
                                field.onChange(
                                  getSelected(values.selected, item.id),
                                )
                              }
                              slotProps={{
                                input: {
                                  id: `${item.label}-switch`,
                                  'aria-label': `${item.label} switch`,
                                },
                              }}
                              color="primary"
                            />
                          }
                          sx={{
                            m: 0,
                            width: 1,
                            justifyContent: 'space-between',
                          }}
                        />
                      ))}
                    </>
                  )}
                />
              </Box>
            </Grid>
          </Grid>
        ))}

        <Button
          type="submit"
          variant="contained"
          color="aishophelper"
          loading={isSubmitting}
          sx={{ ml: 'auto' }}
        >
          Guardar cambios
        </Button>
      </Card>
    </Form>
  )
}
