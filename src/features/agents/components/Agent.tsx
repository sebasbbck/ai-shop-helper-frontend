import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Grid,
  Paper,
  Stack,
  Step,
  StepLabel,
  Stepper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
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
import { Label } from '../../../components/label'

const TaskRow = ({
  taskId,
  agentName,
}: {
  taskId: string
  agentName: string
}) => {
  const { data } = useGetTask(taskId, {
    query: {
      enabled: !!taskId,
      refetchInterval: (query) => {
        const currentData = query.state.data as any
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success'
      case 'failed':
        return 'error'
      case 'running':
        return 'primary'
      default:
        return 'default'
    }
  }

  return (
    <TableRow>
      <TableCell>{taskId.slice(0, 12)}...</TableCell>
      <TableCell>{agentName}</TableCell>
      <TableCell>
        <Label size="small" color={getStatusColor(data?.status as string)}>
          {(data?.status as string) || 'pending'}
        </Label>
      </TableCell>
    </TableRow>
  )
}

export default function Agent({
  agentId,
  projectTypeId,
}: {
  agentId: string
  projectTypeId: string
}) {
  const { showSuccessToast } = useCustomToast()
  const handleError = useHandleError()
  const [tasks, setTasks] = useState<{ id: string; name: string }[]>([])
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
        setTasks((prev) => [
          { id: res.task_id as string, name: agent.name },
          ...prev,
        ])
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
      description: `Has ejecutado la tarea`,
      content: <></>,
      action: <></>,
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
          <Grid size={{ xs: 12, md: 8 }}>
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

          <Grid size={{ xs: 12, md: 4 }}>
            <TableContainer
              component={Paper}
              variant="outlined"
              sx={{ maxHeight: '440px' }}
            >
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: 'action.hover' }}>
                    <TableCell width="40%">ID</TableCell>
                    <TableCell width="40%">Nombre</TableCell>
                    <TableCell align="right" width="20%">
                      Estado
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tasks.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={3}
                        align="center"
                        sx={{ py: 4, color: 'text.secondary' }}
                      >
                        No hay tareas en ejecución
                      </TableCell>
                    </TableRow>
                  ) : (
                    tasks.map((task) => (
                      <TaskRow
                        key={task.id}
                        taskId={task.id}
                        agentName={task.name}
                      />
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </Box>
    </DashboardContent>
  )
}
