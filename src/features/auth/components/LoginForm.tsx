import { zodResolver } from '@hookform/resolvers/zod'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
// import Divider from "@mui/material/Divider"
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Link from '@mui/material/Link'
// import Typography from "@mui/material/Typography"
import {
  createFileRoute,
  redirect,
  useNavigate,
  useParams,
} from '@tanstack/react-router'
import { useBoolean } from 'minimal-shared/hooks'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { FormHead } from './FormHead'
// import { FormSocials } from "./FormSocials"
// import { signInWithPassword } from "@/auth/context/jwt"
// import { UsersService } from "@/client"
import { Field, Form, schemaUtils } from '../../../components/hook-form'
import { Iconify } from '../../../components/iconify'
// import { getErrorMessage } from "@/utils"
// import useCustomToast from "@/hooks/useCustomToast"
import { useTranslation } from 'next-i18next'
// import { SimpleLayout } from "@/layouts/simple"
import CircularProgress from '@mui/material/CircularProgress'
import { useRouter } from 'next/router'
import NextLink from 'next/link'
import { login } from '../../../../api/auth/auth'
import { getMe } from '../../../../api/users/users'
import { getErrorMessage } from '../../../hooks/useHandleError'

// SignInSchema moved into the field-level validation via schemaUtils where needed

export default function LoginForm() {
  const router = useRouter()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const showPassword = useBoolean()
  // const { showInfoToast } = useCustomToast()
  const { t } = useTranslation()
  // const params = useParams({ from: '/$lang' })

  const defaultValues = {
    username: '', // usuario@example.com
    password: '', // multiplicalia
  }

  const SignInSchema = z.object({
    username: z.email(),
    password: z
      .string()
      .min(8, { message: t('translation:forms.password_minimum_characters') }),
  })

  const methods = useForm({
    resolver: zodResolver(SignInSchema),
    defaultValues,
  })

  const onSubmit = async (data: any) => {
    try {
      setIsSubmitting(true)

      await login({
        username: data.username,
        password: data.password,
        grant_type: 'password',
      }).then((data) => localStorage.setItem('token', data.access_token))

      // optionally refresh user
      try {
        await getMe()
      } catch {
        // ignore
      }
      router.replace('/')
    } catch (err) {
      console.error(err)
      setErrorMessage(getErrorMessage(err, t))
    }
    setIsSubmitting(false)
  }

  const renderForm = () => (
    <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column' }}>
      <Field.Text
        name="username"
        label={t('translation:forms.email')}
        slotProps={{ inputLabel: { shrink: true } }}
      />

      <Box sx={{ gap: 1.5, display: 'flex', flexDirection: 'column' }}>
        <Link
          component={NextLink}
          href={'/recover-password'}
          variant="subtitle2"
          sx={{ alignSelf: 'flex-end' }}
        >
          {t('translation:login.forgot_password')}
        </Link>
        <Field.Text
          name="password"
          label={t('translation:forms.password')}
          placeholder=""
          type={showPassword.value ? 'text' : 'password'}
          slotProps={{
            inputLabel: { shrink: true },
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={showPassword.onToggle} edge="end">
                    <Iconify
                      icon={
                        showPassword.value
                          ? 'solar:eye-bold'
                          : 'solar:eye-closed-bold'
                      }
                    />
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
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
          : t('translation:login.login')}
      </Button>

      {/*
      <Divider>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {t("login.alternative_login")}
        </Typography>
      </Divider>

      <FormSocials sx={undefined} signInWithGoogle={() => showInfoToast(t("toasts.coming_soon"), null)} signInWithFacebook={() => showInfoToast(t("toasts.coming_soon"), null)} signInWithTwitter={undefined} />
      */}
    </Box>
  )

  return (
    <>
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
              title={t('translation:login.title')}
              description={
                <>
                  {t('translation:login.no_account')}
                  <Link
                    component={NextLink}
                    href={'/signup'}
                    variant="subtitle2"
                  >
                    {t('translation:login.signup_link')}
                  </Link>
                </>
              }
              sx={{ textAlign: { xs: 'center', md: 'left' } }}
            />

            {/*
            <Alert severity="info" sx={{ mb: 3 }}>
              Prueba a usar <strong>{defaultValues.email}</strong>
              {" con la contraseña "}
              <strong>{defaultValues.password}</strong>
            </Alert>
            */}

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
    </>
  )
}
