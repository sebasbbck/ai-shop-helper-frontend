import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { type SubmitHandler, useForm } from 'react-hook-form'
import useCustomToast from '../../../hooks/useCustomToast'
import useHandleError from '../../../hooks/useHandleError'
import { RoleCreate, RolePublic, RoleUpdate } from '../../../../api/model' // Ensure this is imported
import {
  useCreateRole,
  getGetRolesQueryKey,
  useUpdateRole,
} from '../../../../api/roles/roles'
import { Iconify } from '../../../components/iconify'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import { Field, Form } from '../../../components/hook-form'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import MenuItem from '@mui/material/MenuItem'

export default function EditRole({
  role,
  closeParent,
}: {
  role: RolePublic
  closeParent?: any
}) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <MenuItem onClick={() => setIsOpen(true)} sx={{ color: 'text.primary' }}>
        <Iconify icon="solar:pen-bold" sx={{ mr: 1 }} />
        Editar rol
      </MenuItem>

      {isOpen && (
        <EditRoleForm
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

function EditRoleForm({
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

  const options = [
    { label: 'Owner', value: '0' },
    { label: 'Admin', value: '10' },
    { label: 'Member', value: '50' },
    { label: 'Viewer', value: '100' },
  ]

  const methods = useForm<RoleCreate>({
    mode: 'onBlur',
    criteriaMode: 'all',
    defaultValues: {
      name: role.name,
      description: role.description,
      access_level: role.access_level,
    },
  })

  const {
    handleSubmit,
    setError,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = methods

  const updateMutation = useUpdateRole({
    mutation: {
      onSuccess: () => {
        showSuccessToast('Rol actualizado con éxito')
        reset()
        onClose()
      },
      onError: (err) => {
        handleError(err)
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: getGetRolesQueryKey() })
      },
    },
  })

  const onSubmit: SubmitHandler<RoleCreate> = (data) => {
    const payload: RoleUpdate = {
      name: data.name,
      description: data.description,
      access_level: Number(data.access_level),
    }

    updateMutation.mutate({ roleId: role.id, data: payload })
  }

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
      <DialogTitle>Editar rol</DialogTitle>
      <Form methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <DialogContentText mb={4}>
            Define el nombre y la descripción para el rol de usuario.
          </DialogContentText>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Field.Text
              required
              name="name"
              label="Nombre del rol"
              placeholder="Ej: Editor, Manager..."
              error={!!errors.name}
              helperText={errors.name?.message}
            />

            <Field.Text
              name="description"
              label="Descripción"
              placeholder="¿Qué permisos tiene este rol?"
              multiline
              rows={3}
              error={!!errors.description}
              helperText={errors.description?.message}
            />

            <Field.Select name="access_level" label="Nivel de acceso">
              {options.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Field.Select>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            variant="soft"
            color="inherit"
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
