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
import { AgentPublic } from '../../../../api/model'
import { Iconify } from '../../../components/iconify'
import {
  getGetAgentsQueryKey,
  useDeleteAgent,
} from '../../../../api/agents/agents'
import { themeConfig } from '../../../theme'

export default function DeleteAgent({
  agent,
  closeParent,
}: {
  agent: AgentPublic
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
        Eliminar agente
      </MenuItem>

      {/* Only render the form logic when the dialog is actually open */}
      {isOpen && (
        <DeleteAgentForm
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

function DeleteAgentForm({
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

  const methods = useForm({
    mode: 'onBlur',
    criteriaMode: 'all',
  })

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods

  const deleteMutation = useDeleteAgent({
    mutation: {
      onSuccess: () => {
        showSuccessToast('Agente eliminado con éxito')
        onClose()
        reset(undefined, { keepValues: true })
      },
      onError: (err) => {
        handleError(err)
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: getGetAgentsQueryKey() })
      },
    },
  })

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    deleteMutation.mutate({ agentId: agent.id })
  }

  return (
    <Dialog fullWidth={true} maxWidth="sm" open={open} onClose={onClose}>
      <DialogTitle>Eliminar agente</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <DialogContentText mb={4}>
            Todos los pasos y las acciones del agente también serán{' '}
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
