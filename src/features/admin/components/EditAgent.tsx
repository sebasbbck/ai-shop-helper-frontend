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
import {
  AgentPublic,
  AgentUpdate,
  UserAdminUpdate,
  UserPublic,
} from '../../../../api/model'
import { useUpdateUser } from '../../../../api/users/users'
import MenuItem from '@mui/material/MenuItem'
import { Iconify } from '../../../components/iconify'
import { useUpdateAgent } from '../../../../api/agents/agents'

interface EditUserProps {
  user: UserPublic
}

export default function EditAgent({
  agent,
  closeParent,
}: {
  agent: AgentPublic
  closeParent?: any
}) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <MenuItem onClick={() => setIsOpen(true)} sx={{ color: 'text.primary' }}>
        <Iconify icon="solar:pen-bold" sx={{ mr: 1 }} />
        Editar agente
      </MenuItem>

      {isOpen && (
        <EditAgentForm
          agent={agent}
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

function EditAgentForm({
  agent,
  open,
  onClose,
}: {
  agent: AgentPublic
  open: boolean
  onClose: () => void
}) {
  const queryClient = useQueryClient()
  const { showSuccessToast } = useCustomToast()
  const handleError = useHandleError()

  const methods = useForm<AgentUpdate>({
    mode: 'onBlur',
    criteriaMode: 'all',
    defaultValues: {
      name: agent.name,
      description: agent.description,
    },
  })

  const {
    handleSubmit,
    setError,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = methods

  const updateMutation = useUpdateAgent({
    mutation: {
      onSuccess: () => {
        showSuccessToast('Agente actualizado con éxito')
        onClose()
        reset(undefined, { keepValues: true })
      },
      onError: (err) => {
        handleError(err)
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ['agents'] })
      },
    },
  })

  const onSubmit: SubmitHandler<AgentUpdate> = (data) => {
    const payload: AgentUpdate = {
      name: data.name,
      description: data.description,
    }

    updateMutation.mutate({ agentId: agent.id, data: payload })
  }

  return (
    <Dialog fullWidth={true} maxWidth="sm" open={open} onClose={onClose}>
      <DialogTitle>Editar usuario</DialogTitle>
      <Form methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <DialogContentText mb={4}>
            Introduce el nombre y la descripción del agente.
          </DialogContentText>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <Field.Text
              required
              invalid={!!errors.name}
              errorText={errors.name?.message}
              name="name"
              label="Nombre"
              placeholder="Nombre"
              type="text"
            />

            <Field.Text
              invalid={!!errors.description}
              errorText={errors.description?.message}
              name="description"
              label="Descripción"
              placeholder="Descripción"
              type="text"
            />
          </Box>

          <DialogActions sx={{ px: 0 }}>
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
        </DialogContent>
      </Form>
    </Dialog>
  )
}
