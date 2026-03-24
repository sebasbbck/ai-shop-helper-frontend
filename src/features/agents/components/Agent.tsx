import { Box, Button, CircularProgress, Typography } from '@mui/material'
import { useGetTask, useStartWorkflow } from '../../../../api/n8n-test/n8n-test'
import useCustomToast from '../../../hooks/useCustomToast'
import useHandleError from '../../../hooks/useHandleError'
import { AgentPublic, StartWorkflowBody } from '../../../../api/model'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { useGetAgents } from '../../../../api/agents/agents'

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
  const router = useRouter()
  const { id } = router.query

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

  if (!agent) return <CircularProgress />

  return (
    <>
      <Box>
        <Typography variant="h4">{agent.name}</Typography>
        <Button
          onClick={() =>
            startWorkflow({
              workflow_id: agent.name,
              aws: false,
              n8n_url: 'https://iadmin.aishophelper.ai/webhook',
              data: {
                message: 'test',
              },
            })
          }
        >
          Lanzar workflow
        </Button>

        <Button onClick={() => refetch()}>Comprobar estado</Button>
      </Box>

      <Typography variant="subtitle1">Task ID: {taskId}</Typography>
      <Typography variant="subtitle1">
        Estado actual:{' '}
        {isLoading ? (
          <CircularProgress size={16} />
        ) : (
          <span>{data ? (data.status as any) : 'Sin ejecutar'}</span>
        )}
      </Typography>
    </>
  )
}
