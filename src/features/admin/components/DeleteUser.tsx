import { useState } from 'react'
import { FieldValues, type SubmitHandler, useForm } from 'react-hook-form'
import { useQueryClient } from '@tanstack/react-query'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'

import useCustomToast from '../../../hooks/useCustomToast'
import useHandleError from '../../../hooks/useHandleError'
import { UserPublic } from '../../../../api/model'
import { getGetUsersQueryKey, useDeleteUser } from '../../../../api/users/users'
import { Iconify } from '../../../components/iconify'
import { themeConfig } from '../../../theme'

export default function DeleteUser({
  user,
  closeParent,
}: {
  user: UserPublic
  closeParent?: any
}) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <MenuItem
        onClick={() => setIsOpen(true)}
        sx={{ color: themeConfig.palette.error.main }}
      >
        <Iconify icon="solar:trash-bin-trash-bold" sx={{ mr: 1 }} />
        Eliminar usuario
      </MenuItem>

      {/* Only render the form logic when the dialog is actually open */}
      {isOpen && (
        <DeleteUserForm
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

function DeleteUserForm({
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

  const methods = useForm({
    mode: 'onBlur',
    criteriaMode: 'all',
  })

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods

  const deleteMutation = useDeleteUser({
    mutation: {
      onSuccess: () => {
        showSuccessToast('Usuario eliminado con éxito')
        onClose()
        reset(undefined, { keepValues: true })
      },
      onError: (err) => {
        handleError(err)
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: getGetUsersQueryKey() })
      },
    },
  })

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    deleteMutation.mutate({ userId: user.id })
  }

  return (
    <Dialog fullWidth={true} maxWidth="sm" open={open} onClose={onClose}>
      <DialogTitle>Eliminar usuario</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <DialogContentText mb={4}>
            Todos los ítems asociados con este usuario también serán{' '}
            <strong>eliminados permanentemente.</strong> ¿Estás seguro? No se
            podrá deshacer esta acción.
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button
            variant="soft"
            disabled={isSubmitting || deleteMutation.isPending}
            onClick={onClose}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            type="submit"
            color="error"
            loading={isSubmitting || deleteMutation.isPending}
          >
            Eliminar
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
