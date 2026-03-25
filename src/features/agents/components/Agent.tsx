import {
  Box,
  Button,
  CircularProgress,
  Grid,
  Stack,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from '@mui/material'
import { useGetTask, useStartWorkflow } from '../../../../api/n8n-test/n8n-test'
import useCustomToast from '../../../hooks/useCustomToast'
import useHandleError from '../../../hooks/useHandleError'
import { AgentPublic, StartWorkflowBody } from '../../../../api/model'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { useGetAgents } from '../../../../api/agents/agents'
import { DashboardContent } from '../../../components/layouts/dashboard'
import { AgentWorkflowCard } from './AgentWorkflowCard'

export default function Agent({
  agentId,
  projectTypeId,
}: {
  agentId: string
  projectTypeId: string
}) {
  const { showSuccessToast } = useCustomToast()
  const handleError = useHandleError()
  const [taskId, setTaskId] = useState<string | null>(null)
  const [status, setStatus] = useState(null)
  const [activeStep, setActiveStep] = useState<number | null>(null)
  const router = useRouter()
  const { id } = router.query

  // Only superusers can obtain an agent directly by its ID
  const { data: agents } = useGetAgents({ project_type_id: projectTypeId })
  const agent = agents?.items.find(
    (a: AgentPublic) => a.id === agentId,
  ) as AgentPublic

  const mutation = useStartWorkflow({
    mutation: {
      onSuccess: (res) => {
        setTaskId(res.task_id as string)
        showSuccessToast('Workflow lanzado con éxito')
      },
      onError: (err) => {
        handleError(err)
      },
    },
  })

  const startWorkflow = (data: StartWorkflowBody) => {
    mutation.mutate({ data })
  }

  const { data, isLoading, refetch } = useGetTask(taskId, {
    query: {
      // Only fetch if we actually have a taskId
      enabled: !!taskId,
      // Polling interval in milliseconds (e.g., 3000ms = 3 seconds)
      refetchInterval: (query) => {
        const currentData = query.state.data as any
        // Logic: stop polling if the status is 'completed' or 'failed'
        if (
          currentData?.status === 'completed' ||
          currentData?.status === 'failed'
        ) {
          return false
        }
        return 3000
      },
    },
  })

  const mockSteps = [
    {
      title: 'Este paso es de ejemplo',
      summarisedTitle: 'Lorem ipsum',
      description: 'Para continuar, activa el workflow.',
      content: <></>,
      action: (
        <>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              startWorkflow({
                workflow_id: agent.name,
                aws: false,
                n8n_url: 'https://iadmin.aishophelper.ai/webhook',
                data: {
                  message: 'test',
                },
              })
              setActiveStep(1)
            }}
          >
            Lanzar workflow
          </Button>
        </>
      ),
    },
    {
      title: `Estado del workflow ${agent?.name}`,
      summarisedTitle: 'dolor sit amet,',
      description: `Has ejecutado la tarea con ID ${taskId}. Su estado es: ${data?.status as any}`,
      content: <></>,
      action: (
        <Button variant="outlined" onClick={() => refetch()}>
          Comprobar estado
        </Button>
      ),
    },
    {
      title: 'Revisa tus ajustes de organización',
      summarisedTitle: 'consectetur adipiscing elit,',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      content: <></>,
      action: <></>,
    },
    {
      title: 'Corregir errores',
      summarisedTitle: 'sed do eiusmod tempor',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      content: <></>,
      action: <></>,
    },
  ]

  if (!agent) return <CircularProgress />

  return (
    <DashboardContent maxWidth="xl">
      <Box>
        <Grid container spacing={3}>
          <Grid size={12}>
            <Stepper
              activeStep={activeStep ?? -1}
              nonLinear
              sx={{
                mb: 2,
                maxWidth: '800px',
              }}
            >
              {mockSteps.map((s, index) => {
                const isClickable =
                  activeStep === null ? index === 0 : index <= activeStep
                return (
                  <Step
                    key={s.title}
                    onClick={() => {
                      if (isClickable) {
                        setActiveStep(index)
                      }
                    }}
                    sx={{
                      cursor: isClickable ? 'pointer' : 'not-allowed',
                      opacity: isClickable ? 1 : 0.6,
                    }}
                  >
                    <StepLabel>{s.summarisedTitle}</StepLabel>
                  </Step>
                )
              })}
            </Stepper>
            <AgentWorkflowCard
              title={
                activeStep !== null
                  ? mockSteps[activeStep].title
                  : `Workflow de ${agent.name}`
              }
              description={
                activeStep !== null
                  ? mockSteps[activeStep].description
                  : 'Lorem ipsum'
              }
              img={
                <img
                  src="/assets/images/herramienta-blog.png"
                  alt="Agente"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />
              }
              content={activeStep !== null && mockSteps[activeStep].content}
              action={
                <Stack direction="row" spacing={2} sx={{ width: '100%' }}>
                  {activeStep === null ? (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => setActiveStep(0)}
                    >
                      Empezar
                    </Button>
                  ) : (
                    <>
                      {mockSteps[activeStep].action}
                      <Button
                        variant="outlined"
                        color="inherit"
                        onClick={() => setActiveStep(null)}
                      >
                        Cancelar
                      </Button>
                    </>
                  )}
                </Stack>
              }
            ></AgentWorkflowCard>
          </Grid>
        </Grid>
      </Box>
    </DashboardContent>
  )
}
