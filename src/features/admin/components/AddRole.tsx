import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { type SubmitHandler, useForm } from 'react-hook-form'
import useCustomToast from '../../../hooks/useCustomToast'
import useHandleError from '../../../hooks/useHandleError'
import { RoleCreate } from '../../../../api/model' // Ensure this is imported
import { useCreateRole, getGetRolesQueryKey } from '../../../../api/roles/roles'
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

export default function AddRole() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button
        color="primary"
        startIcon={<Iconify icon="mingcute:add-line" />}
        onClick={() => setIsOpen(true)}
      >
        Añadir rol
      </Button>

      {isOpen && <AddRoleForm open={isOpen} onClose={() => setIsOpen(false)} />}
    </>
  )
}

function AddRoleForm({
  open,
  onClose,
}: {
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
      name: '',
      description: '',
      access_level: 100,
    },
  })

  const {
    handleSubmit,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = methods

  const mutation = useCreateRole({
    mutation: {
      onSuccess: () => {
        showSuccessToast('Rol creado con éxito')
        reset()
        onClose() // Close the dialog on success
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
    console.log(data)
    data.access_level = Number(data.access_level)
    mutation.mutate({ data })
  }

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
      <DialogTitle>Añadir nuevo rol</DialogTitle>
      <Form methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <DialogContentText mb={4}>
            Define el nombre y la descripción para el nuevo rol de usuario.
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
            disabled={isSubmitting || mutation.isPending}
            onClick={onClose}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            type="submit"
            disabled={!isValid}
            loading={isSubmitting || mutation.isPending}
          >
            Guardar
          </Button>
        </DialogActions>
      </Form>
    </Dialog>
  )
}
