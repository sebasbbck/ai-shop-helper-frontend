import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { useTranslation } from 'next-i18next'

import { Form, Field, schemaUtils } from '../../../components/hook-form'
import useCustomToast from '../../../hooks/useCustomToast'
import useAuth from '../../../hooks/useAuth'
import useHandleError from '../../../hooks/useHandleError'
import { useUpdateMe } from '../../../../api/users/users'
import { UserUpdate } from '../../../../api/model'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import { Iconify } from '../../../components/iconify'
import { useBoolean } from 'minimal-shared/hooks'
import Box from '@mui/material/Box'

// ----------------------------------------------------------------------

// TODO: handle image upload when profile pictures are added
// photo_url: schemaUtils.file({ error: 'El avatar es obligatorio' }),

// ----------------------------------------------------------------------

export function SettingsGeneral() {
  const { user } = useAuth()
  const { showSuccessToast } = useCustomToast()
  const handleError = useHandleError()
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const showPassword = useBoolean()

  const UserUpdateSchema = z
    .object({
      name: z.string().optional().or(z.literal('')),
      email: schemaUtils.email().optional().or(z.literal('')),
      password: z
        .string()
        .optional()
        .or(z.literal(''))
        .refine(
          (val) => !val || val.length >= 8,
          t('translation:forms.password_minimum_characters'),
        )
        .refine(
          (val) => !val || /[A-Z]/.test(val),
          t('translation:forms.password_must_contain_uppercase'),
        )
        .refine(
          (val) => !val || /[a-z]/.test(val),
          t('translation:forms.password_must_contain_lowercase'),
        )
        .refine(
          (val) => !val || /[0-9]/.test(val),
          t('translation:forms.password_must_contain_number'),
        )
        .refine(
          (val) => !val || /[!@#$%^&*()\-_~,.:;{}<>]/.test(val),
          t('translation:forms.password_must_contain_special_character'),
        ),
      confirm_password: z.string().optional().or(z.literal('')),
    })
    .refine(
      (data) => {
        if (!data.password && !data.confirm_password) return true
        return data.password === data.confirm_password
      },
      {
        message: t('translation:forms.passwords_do_not_match'),
        path: ['confirm_password'],
      },
    )

  const methods = useForm<UserUpdate>({
    mode: 'onBlur',
    criteriaMode: 'all',
    defaultValues: {
      email: user?.email || '', // TODO: Check for the possibility of sending null values
      name: user?.name || '',
      password: '',
    },
    resolver: zodResolver(UserUpdateSchema),
  })

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods

  const updateMutation = useUpdateMe({
    mutation: {
      onSuccess: () => {
        showSuccessToast('Usuario actualizado con éxito')
        reset(undefined, { keepValues: true })
      },
      onError: (err) => {
        handleError(err)
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ['users'] })
      },
    },
  })

  const onSubmit = handleSubmit(async (data) => {
    try {
      const filteredData = Object.fromEntries(
        Object.entries(data).filter(
          ([_, value]) => value !== '' && value !== null && value !== undefined,
        ),
      )
      if (Object.keys(filteredData).length > 0) {
        updateMutation.mutate({ data: filteredData as UserUpdate })
      } else {
        showSuccessToast('No se detectaron cambios')
      }
    } catch (error) {
      console.error(error)
    }
  })

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3} justifyContent="center">
        <Grid size={{ xs: 12, md: 6 }}>
          <Card
            sx={{
              py: 5,
              px: 3,
              textAlign: 'center',
            }}
          >
            <Field.UploadAvatar
              name="photo_url"
              maxSize={5242880}
              helperText={
                (
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 3,
                      mx: 'auto',
                      display: 'block',
                      textAlign: 'center',
                      color: 'text.disabled',
                    }}
                  >
                    {t('translation:settings.general.image_upload_formats')}
                    <br />{' '}
                    {t('translation:settings.general.image_upload_max_size')}
                  </Typography>
                ) as any
              }
            />

            <Field.Text
              name="name"
              label={t('translation:settings.general.name')}
              sx={{ mt: 3 }}
            />

            <Field.Text
              name="email"
              label={t('translation:settings.general.email')}
              sx={{ mt: 3 }}
            />

            <Field.Text
              name="password"
              type={showPassword.value ? 'text' : 'password'}
              label={t('translation:settings.change_password.new_password')}
              sx={{ mt: 3 }}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={showPassword.onToggle} edge="end">
                        <Iconify
                          icon={
                            showPassword.value
                              ? 'solar:eye-bold'
                              : 'solar:eye-closebold'
                          }
                        />
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />

            <Field.Text
              name="confirm_password"
              type={showPassword.value ? 'text' : 'password'}
              label={t('translation:settings.change_password.confirm_password')}
              sx={{ mt: 3 }}
              slotProps={{
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

            <Button
              type="submit"
              variant="contained"
              color="aishophelper"
              loading={isSubmitting}
              sx={{ mt: 3 }}
            >
              {t('translation:settings.general.save')}
            </Button>
          </Card>
        </Grid>

        {/* There used to be a blank page here */}
      </Grid>
    </Form>
  )
}
