"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import SmartToyOutlinedIcon from "@mui/icons-material/SmartToyOutlined";
import { useAgentsGetAgents } from "@/api/endpoints/agents/agents";
import { useProjectTypesGetProjectTypes } from "@/api/endpoints/project-types/project-types";
import { useActiveContext } from "@/features/shell/ActiveContext";
import AgentCard from "@/features/project/AgentCard";
import { useAgentLabel } from "@/features/agents/use-agent-label";

export default function ProjectDashboard() {
  const t = useTranslations("Project");
  const agentLabel = useAgentLabel();
  const router = useRouter();
  const { activeProject, activeProjectTypeId, isLoading: contextLoading } = useActiveContext();

  const { data: typesData } = useProjectTypesGetProjectTypes(
    {},
    { query: { enabled: !!activeProjectTypeId } },
  );
  const typeMap = new Map(
    (typesData?.items ?? []).map((pt) => [pt.id, pt.name]),
  );
  const typeName = activeProjectTypeId ? (typeMap.get(activeProjectTypeId) ?? null) : null;

  const { data: agentsData, isLoading: agentsLoading } = useAgentsGetAgents(
    { project_type_id: activeProjectTypeId ?? undefined },
    { query: { enabled: !!activeProjectTypeId } },
  );
  const agents = agentsData?.items ?? [];

  if (contextLoading) {
    return <ProjectDashboardSkeleton />;
  }

  if (!activeProject) {
    return (
      <Box
        sx={{
          textAlign: "center",
          py: 12,
          px: 4,
          borderRadius: 3,
          bgcolor: "action.hover",
        }}
      >
        <SmartToyOutlinedIcon sx={{ fontSize: 48, color: "text.disabled", mb: 2 }} />
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
          {t("noProjectHeading")}
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {t("noProjectBody")}
        </Typography>
      </Box>
    );
  }

  return (
    <Box
    sx={{
          borderRadius: 3,
          mt:3,
          mb:3,
          p:3,
          bgcolor: "background.paper",
          
        }}
    >
      <Box sx={{ mb: 5 }}>
        <Box sx={{ display: "flex", alignItems: "baseline", gap: 1.5 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, letterSpacing: -0.5 }}>
            {activeProject.name}
          </Typography>
          {typeName && (
            <Typography
              variant="body2"
              sx={{ color: "text.secondary", fontWeight: 500, whiteSpace: "nowrap" }}
            >
              {typeName}
            </Typography>
          )}
        </Box>
        <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
          {t("agentCount", { count: agents.length })}
        </Typography>
      </Box>

      {agentsLoading ? (
        <Grid container spacing={2.5}>
          {Array.from({ length: 3 }).map((_, i) => (
            <Grid key={i} size={{ xs: 12, sm: 6, md: 4 }}>
              <Skeleton variant="rounded" height={180} sx={{ borderRadius: 3 }} />
            </Grid>
          ))}
        </Grid>
      ) : agents.length === 0 ? (
        <Box
          sx={{
            textAlign: "center",
            py: 10,
            px: 4,
            borderRadius: 3,
            bgcolor: "action.hover",
          }}
        >
          <SmartToyOutlinedIcon sx={{ fontSize: 40, color: "text.disabled", mb: 2 }} />
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
            {t("noAgentsHeading")}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {t("noAgentsBody")}
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={2.5}>
          {agents.map((agent) => {
            const label = agentLabel(agent.name, agent.description);
            return (
              <Grid key={agent.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <AgentCard
                  name={label.name}
                  description={label.description || null}
                  onOpen={() => router.push(`/agents/${agent.id}`)}
                />
              </Grid>
            );
          })}
        </Grid>
      )}
    </Box>
  );
}

function ProjectDashboardSkeleton() {
  return (
    <Box>
      <Box sx={{ mb: 5 }}>
        <Skeleton variant="text" width={220} height={40} />
        <Skeleton variant="text" width={120} height={20} sx={{ mt: 0.5 }} />
      </Box>
      <Grid container spacing={2.5}>
        {Array.from({ length: 3 }).map((_, i) => (
          <Grid key={i} size={{ xs: 12, sm: 6, md: 4 }}>
            <Skeleton variant="rounded" height={180} sx={{ borderRadius: 3 }} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
