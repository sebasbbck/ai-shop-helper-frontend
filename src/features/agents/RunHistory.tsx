"use client";

import { useTranslations } from "next-intl";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import { useAgentRunsListProjectRuns } from "@/api/endpoints/agent-runs/agent-runs";
import { RunStatus } from "@/api/model/runStatus";

interface Props {
  projectId: string;
}

function statusColor(
  status: string,
): "success" | "error" | "warning" | "default" {
  if (status === RunStatus.success) return "success";
  if (status === RunStatus.failed) return "error";
  if (status === RunStatus.running || status === RunStatus.awaiting_input)
    return "warning";
  return "default";
}

export default function RunHistory({ projectId }: Props) {
  const t = useTranslations("AgentRun");

  const { data: runs, isLoading } = useAgentRunsListProjectRuns(projectId);

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        <Skeleton variant="rounded" height={36} />
        <Skeleton variant="rounded" height={36} />
      </Box>
    );
  }

  const sorted = runs ? [...runs].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  ) : [];

  if (sorted.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        {t("noExecutions")}
      </Typography>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      {sorted.map((run) => (
        <Box
          key={run.id}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            py: 0.75,
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography variant="body2" sx={{ flexGrow: 1 }} color="text.secondary">
            {new Date(run.created_at).toLocaleString()}
          </Typography>
          <Chip
            label={run.status.replace("_", " ")}
            size="small"
            color={statusColor(run.status)}
            variant="outlined"
          />
        </Box>
      ))}
    </Box>
  );
}
