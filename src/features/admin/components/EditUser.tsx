import { useState } from 'react'
import { type SubmitHandler, useForm } from 'react-hook-form'
import { useQueryClient } from '@tanstack/react-query'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'

import useCustomToast from '../../../hooks/useCustomToast'
import useHandleError from '../../../hooks/useHandleError'
import { Field, Form } from '../../../components/hook-form'
import { UserAdminUpdate, UserPublic } from '../../../../api/model'
import { useUpdateUser } from '../../../../api/users/users'
import MenuItem from '@mui/material/MenuItem'
import { Iconify } from '../../../components/iconify'

interface UserAdminUpdateForm extends UserAdminUpdate {
  confirm_password?: string
}

interface EditUserProps {
  user: UserPublic
}

export default function EditUser({
  user,
  closeParent,
}: {
  user: UserPublic
  closeParent?: any
}) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <MenuItem onClick={() => setIsOpen(true)} sx={{ color: 'text.primary' }}>
        <Iconify icon="solar:pen-bold" sx={{ mr: 2 }} />
        Editar usuario
      </MenuItem>

      {/* Only render the form logic when the dialog is actually open */}
      {isOpen && (
        <EditUserForm
          user={user}
          open={isOpen}
          onClose={() => {
            setIsOpen(false)
            closeParent()
          }}
        />
      )}
    </>
  )
}

function EditUserForm({
  user,
  open,
  onClose,
}: {
  user: UserPublic
  open: boolean
  onClose: () => void
}) {
  const queryClient = useQueryClient()
  const { showSuccessToast } = useCustomToast()
  const handleError = useHandleError()

  const methods = useForm<UserAdminUpdateForm>({
    mode: 'onBlur',
    criteriaMode: 'all',
    defaultValues: {
      email: user.email,
      name: user.name || '',
      password: '',
      confirm_password: '',
      is_superuser: user.is_superuser,
      is_active: user.is_active,
    },
  })

  const {
    handleSubmit,
    setError,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = methods

  const updateMutation = useUpdateUser({
    mutation: {
      onSuccess: () => {
        showSuccessToast('Usuario actualizado con éxito')
        onClose()
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

  const onSubmit: SubmitHandler<UserAdminUpdateForm> = (data) => {
    // Validate passwords match if the admin is trying to change it
    if (data.password !== data.confirm_password) {
      setError('confirm_password', {
        type: 'manual',
        message: 'Las contraseñas no coinciden',
      })
      return
    }

    const payload: UserAdminUpdate = {
      email: data.email,
      name: data.name,
      is_active: data.is_active,
      is_superuser: data.is_superuser,
    }

    if (data.password && data.password.trim() !== '') {
      payload.password = data.password
    }

    updateMutation.mutate({ userId: user.id, data: payload })
  }

  return (
    <Dialog fullWidth={true} maxWidth="sm" open={open} onClose={onClose}>
      <DialogTitle>Editar usuario</DialogTitle>
      <Form methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <DialogContentText mb={4}>
            Actualiza los datos del usuario. Deja los campos de contraseña en
            blanco si no deseas cambiarla.
          </DialogContentText>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <Field.Text
              required
              invalid={!!errors.email}
              errorText={errors.email?.message}
              name="email"
              label="Email"
              placeholder="Email"
              type="email"
            />

            <Field.Text
              invalid={!!errors.name}
              errorText={errors.name?.message}
              name="name"
              label="Nombre"
              placeholder="Nombre"
              type="text"
            />

            {/* Notice `required` is removed here */}
            <Field.Text
              invalid={!!errors.password}
              errorText={errors.password?.message}
              name="password"
              label="Nueva Contraseña"
              placeholder="Dejar en blanco para no cambiar"
              type="password"
            />

            <Field.Text
              invalid={!!errors.confirm_password}
              errorText={errors.confirm_password?.message}
              name="confirm_password"
              label="Confirmar nueva contraseña"
              placeholder="Dejar en blanco para no cambiar"
              type="password"
            />

            <Field.Checkbox name="is_superuser" label="¿Superusuario?" />
            <Field.Checkbox name="is_active" label="¿Activo?" />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button
            variant="soft"
            disabled={isSubmitting || updateMutation.isPending}
            onClick={onClose}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            type="submit"
            disabled={!isValid}
            loading={isSubmitting || updateMutation.isPending}
          >
            Guardar
          </Button>
        </DialogActions>
      </Form>
    </Dialog>
  )
}
