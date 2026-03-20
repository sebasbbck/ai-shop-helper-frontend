import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { Controller, type SubmitHandler, useForm } from 'react-hook-form'
import useCustomToast from '../../../hooks/useCustomToast'
import useHandleError from '../../../hooks/useHandleError'
import { AgentCreate, AgentPublic, AgentUpdate } from '../../../../api/model'
import { useCreateAgent } from '../../../../api/agents/agents'
import { Iconify } from '../../../components/iconify'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import { Field, Form } from '../../../components/hook-form'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'

export default function AddAgent() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button
        color="primary"
        startIcon={<Iconify icon="mingcute:add-line" />}
        onClick={() => {
          setIsOpen(true)
        }}
      >
        Añadir agente
      </Button>

      {/* Only render the form logic when the dialog is actually open */}
      {isOpen && (
        <AddAgentForm
          open={isOpen}
          onClose={() => {
            setIsOpen(false)
          }}
        />
      )}
    </>
  )
}

function AddAgentForm({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => any
}) {
  const [isOpen, setIsOpen] = useState(false)
  const queryClient = useQueryClient()
  const { showSuccessToast } = useCustomToast()
  const handleError = useHandleError()

  const methods = useForm<AgentCreate>({
    mode: 'onBlur',
    criteriaMode: 'all',
    defaultValues: {
      name: '',
      description: '',
    },
  })

  const {
    handleSubmit,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = methods

  const mutation = useCreateAgent({
    mutation: {
      onSuccess: () => {
        showSuccessToast('Agente creado con éxito')
        reset()
        setIsOpen(false)
      },
      onError: (err) => {
        handleError(err)
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ['agents'] })
      },
    },
  })

  const onSubmit: SubmitHandler<AgentCreate> = (data) => {
    mutation.mutate({ data })
  }

  return (
    <Dialog fullWidth={true} maxWidth="sm" open={open} onClose={onClose}>
      <DialogTitle>Añadir agente</DialogTitle>
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

          <DialogActions>
            <Button
              variant="soft"
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
        </DialogContent>
      </Form>
    </Dialog>
  )
}
