import { useMutation } from '@tanstack/react-query'
import { type SubmitHandler, useForm } from 'react-hook-form'

import Button from '@mui/material/Button'
import useCustomToast from '../../../hooks/useCustomToast'
// import { handleError } from "@/utils"
import Box from '@mui/material/Box'
import { FormHead } from './FormHead'
import { useState } from 'react'
import Alert from '@mui/material/Alert'
import { Form, Field } from '../../../components/hook-form'
import { schemaUtils } from '../../../components/hook-form/schema-utils'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import useHandleError from '../../../hooks/useHandleError'
import { useTranslation } from 'next-i18next'
import CircularProgress from '@mui/material/CircularProgress'

interface FormData {
  email: string
}

export default function RecoverPasswordForm() {
  const [errorMessage] = useState<string | null>(null)
  const { showSuccessToast, showErrorToast } = useCustomToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const handleError = useHandleError()
  const { t } = useTranslation()
  const { reset } = useForm<FormData>()

  const RecoverPasswordSchema = z.object({
    email: schemaUtils.email(),
  })

  /*
  const recoverPassword = async (data: FormData) => {
    await LoginService.recoverPassword({
      email: data.email,
    })
  }

  const mutation = useMutation({
    mutationFn: recoverPassword,
    onSuccess: () => {
      showSuccessToast(t("translation:recover_password.success"))
      reset()
    },
    onError: (err) => {
      // console.log(err)
      // TODO: DEMO
      handleError(err)
    },
  })

  const isSubmitting = mutation.isPending
  */

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    showErrorToast(
      'Reestablecer la contraseña no es posible en esta versión de prueba. Si necesitas obtener una nueva contraseña, contacta con Multiplicalia. Disculpa las molestias.',
    )
  }

  const methods = useForm({
    resolver: zodResolver(RecoverPasswordSchema),
    defaultValues: {
      email: '',
    },
  })

  const renderForm = () => (
    <>
      <Box
        sx={{
          display: 'flex',
          gap: { xs: 3, sm: 2 },
          flexDirection: { xs: 'column', sm: 'row' },
          pb: 2,
        }}
      >
        <Field.Text
          name="email"
          label={t('translation:forms.email')}
          slotProps={{ inputLabel: { shrink: true } }}
        />
      </Box>

      <Button
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        disabled={isSubmitting}
      >
        {isSubmitting && (
          <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
        )}
        {isSubmitting
          ? t('translation:onboarding.processing')
          : t('translation:recover_password.send')}
      </Button>
    </>
  )

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        flex: '1 1 auto',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        height: 'calc(100vh - var(--layout-header-desktop-height))',
      }}
    >
      <Box
        sx={{
          position: 'relative',
          padding: '2rem',
          flex: '1 1 auto',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <img
          style={{ borderRadius: 12, width: 420 }}
          src="/assets/images/herramienta-ia-marketing-equipo-login.webp"
          alt="Los cuatro agentes de AI Shop Helper"
        />
      </Box>

      <Box
        sx={{
          width: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'left',
          padding: '2rem',
        }}
      >
        <Box sx={{ width: '100%', maxWidth: '420px' }}>
          <FormHead
            title={t('translation:recover_password.title')}
            description={t('translation:recover_password.instructions')}
            sx={{ textAlign: { xs: 'center', md: 'left' } }}
          />

          {!!errorMessage && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {errorMessage}
            </Alert>
          )}

          <Form methods={methods} onSubmit={methods.handleSubmit(onSubmit)}>
            {renderForm()}
          </Form>
        </Box>
      </Box>
    </Box>
  )
}
