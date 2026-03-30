import { Box, CircularProgress, Grid, Typography } from '@mui/material'
import { AgentPublic, StartWorkflowBody } from '../../../../api/model'
import { DashboardContent } from '../../../components/layouts/dashboard'
import { useRouter } from 'next/router'
import { AppAgent } from './AgentCard'
import { useGetAgents } from '../../../../api/agents/agents'
import useCurrentProject from '../../../hooks/useCurrentProject'
import useAuth from '../../../hooks/useAuth'
import { getAccessToken } from '../../../../api/mutator/custom-instance'

export default function AgentsPage() {
  const router = useRouter()
  const { currentProject } = useCurrentProject()
  const { user: authUser } = useAuth()
  const token = getAccessToken()

  const { data, isLoading, isError, error } = useGetAgents({
    project_type_id: currentProject?.project_type_id,
  },
  {
    query: {
      // Only fire if we have a token and user
      enabled: !!token && !!authUser?.id, 
    },
  })
  const agents = data?.items ?? []

  if (isLoading) {
    return (
      <DashboardContent maxWidth="sm">
        <CircularProgress />
      </DashboardContent>
    )
  }

  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
        Agentes
      </Typography>

      <Grid container spacing={3}>
        {agents.map((a: AgentPublic) => (
          <Grid id="docs-demo-step2" size={{ xs: 16, md: 6 }}>
            <AppAgent
              title={a.name}
              description={a.description}
              imgSrc="/assets/images/herramienta-blog.png"
              hoverImgSrc="/assets/animations/herramienta-blog-animada.gif"
              alt="Redactor de blog"
              gradient="linear-gradient(135deg, #E3F0FF 0%, #F8FBFF 100%)"
              titleColour="#1e63ac"
              disabled={false}
              onClick={() =>
                router.push({
                  pathname: `/agents/${a.id}`,
                  query: { projectTypeId: currentProject.project_type_id },
                })
              }
            />
          </Grid>
        ))}
      </Grid>
    </DashboardContent>
  )
}
