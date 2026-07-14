"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import HistoryIcon from "@mui/icons-material/History";
import {
  useAgentRunsGetAgentSchema,
  useAgentRunsCreateRun,
} from "@/api/endpoints/agent-runs/agent-runs";
import { InputScope } from "@/api/model/inputScope";
import type { AgentInputSchema } from "@/api/model/agentInputSchema";
import type { AgentStepSchema } from "@/api/model/agentStepSchema";
import { useActiveContext } from "@/features/shell/ActiveContext";
import SchemaInputField from "@/features/agents/SchemaInputField";
import ProjectConfigSection from "@/features/agents/ProjectConfigSection";
import RunProgress from "@/features/agents/RunProgress";
import RunHistory from "@/features/agents/RunHistory";

interface Props {
  agentId: string;
}

function isInsufficientCredits(err: unknown): boolean {
  const e = err as { response?: { status?: number }; status?: number };
  return e?.response?.status === 402 || e?.status === 402;
}

function firstStepRunInputs(schema: AgentStepSchema[]): AgentInputSchema[] {
  if (schema.length === 0) return [];
  return schema[0].inputs.filter((i) => i.scope === InputScope.run);
}

function allProjectInputs(schema: AgentStepSchema[]): AgentInputSchema[] {
  return schema.flatMap((s) => s.inputs).filter((i) => i.scope === InputScope.project);
}

type RunFormValues = Record<string, string>;

interface RunFormProps {
  agentId: string;
  projectId: string;
  schema: AgentStepSchema[];
  onRunStarted: (runId: string) => void;
}

function RunForm({ agentId, projectId, schema, onRunStarted }: RunFormProps) {
  const t = useTranslations("AgentRun");
  const [creditsError, setCreditsError] = useState(false);
  const [generalError, setGeneralError] = useState(false);

  const runInputs = firstStepRunInputs(schema);

  const { control, handleSubmit } = useForm<RunFormValues>({
    defaultValues: Object.fromEntries(runInputs.map((i) => [i.key, ""])),
  });

  const createRun = useAgentRunsCreateRun();

  const onSubmit = (values: RunFormValues) => {
    setCreditsError(false);
    setGeneralError(false);
    const run_inputs = runInputs.length > 0 ? values : undefined;
    createRun.mutate(
      { projectId, agentId, data: { run_inputs } },
      {
        onSuccess: (run) => onRunStarted(run.id),
        onError: (err) => {
          if (isInsufficientCredits(err)) {
            setCreditsError(true);
          } else {
            setGeneralError(true);
          }
        },
      },
    );
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{ display: "flex", flexDirection: "column", gap: 2 }}
    >
      {runInputs.map((input) => (
        <SchemaInputField
          key={input.id}
          input={input}
          control={control}
          name={input.key as keyof RunFormValues & string}
          disabled={createRun.isPending}
        />
      ))}

      {creditsError && (
        <Alert severity="warning">{t("insufficientCredits")}</Alert>
      )}
      {generalError && (
        <Alert severity="error">{t("runError")}</Alert>
      )}

      <Box>
        <Button
          type="submit"
          variant="contained"
          size="small"
          disabled={createRun.isPending}
          startIcon={
            createRun.isPending ? (
              <CircularProgress size={14} color="inherit" />
            ) : (
              <PlayArrowIcon />
            )
          }
        >
          {createRun.isPending ? t("generating") : t("runAgent")}
        </Button>
      </Box>
    </Box>
  );
}

export default function AgentRun({ agentId }: Props) {
  const t = useTranslations("AgentRun");
  const { activeProject, isLoading: contextLoading } = useActiveContext();
  const projectId = activeProject?.id ?? null;

  const [activeRunId, setActiveRunId] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  const { data: schema, isLoading: schemaLoading } = useAgentRunsGetAgentSchema(
    projectId ?? "",
    agentId,
    { query: { enabled: !!projectId } },
  );

  const isLoading = contextLoading || schemaLoading;

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Skeleton variant="rounded" height={40} />
        <Skeleton variant="rounded" height={80} />
        <Skeleton variant="rounded" height={36} />
      </Box>
    );
  }

  if (!projectId) {
    return <Alert severity="info">{t("notFoundBody")}</Alert>;
  }

  if (!schema) {
    return (
      <Alert severity="info">
        <Typography variant="subtitle2">{t("notAvailableHeading")}</Typography>
        <Typography variant="body2">{t("notAvailableBody")}</Typography>
      </Alert>
    );
  }

  const projectInputs = allProjectInputs(schema.steps);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {projectInputs.length > 0 && (
        <ProjectConfigSection projectId={projectId} inputs={projectInputs} />
      )}

      {activeRunId ? (
        <RunProgress
          runId={activeRunId}
          schema={schema.steps}
          onReset={() => setActiveRunId(null)}
        />
      ) : (
        <RunForm
          agentId={agentId}
          projectId={projectId}
          schema={schema.steps}
          onRunStarted={(id) => {
            setActiveRunId(id);
            setShowHistory(false);
          }}
        />
      )}

      <Box>
        <Button
          variant="text"
          size="small"
          startIcon={<HistoryIcon />}
          onClick={() => setShowHistory((v) => !v)}
          sx={{ mb: 1 }}
        >
          {t("executionsHeading")}
        </Button>
        {showHistory && <RunHistory projectId={projectId} />}
      </Box>
    </Box>
  );
}
