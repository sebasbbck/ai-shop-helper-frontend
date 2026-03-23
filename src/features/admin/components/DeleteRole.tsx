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
import { RolePublic } from '../../../../api/model'
import { Iconify } from '../../../components/iconify'
import { themeConfig } from '../../../theme'
import { getGetRolesQueryKey, useDeleteRole } from '../../../../api/roles/roles'

export default function DeleteRole({
  role,
  closeParent,
}: {
  role: RolePublic
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
        Eliminar rol
      </MenuItem>

      {/* Only render the form logic when the dialog is actually open */}
      {isOpen && (
        <DeleteRoleForm
          role={role}
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

function DeleteRoleForm({
  role,
  open,
  onClose,
}: {
  role: RolePublic
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

  const deleteMutation = useDeleteRole({
    mutation: {
      onSuccess: () => {
        showSuccessToast('Rol eliminado con éxito')
        onClose()
        reset(undefined, { keepValues: true })
      },
      onError: (err) => {
        handleError(err)
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: getGetRolesQueryKey() })
      },
    },
  })

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    deleteMutation.mutate({ roleId: role.id })
  }

  return (
    <Dialog fullWidth={true} maxWidth="sm" open={open} onClose={onClose}>
      <DialogTitle>Eliminar rol</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <DialogContentText mb={4}>
            Eliminar un rol afectará a todas las organizaciones en las que haya
            miembros que lo usen. ¿Estás seguro?{' '}
            <strong>Esta acción es irreversible.</strong>
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
