"use client";

import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import ErrorOutlinedIcon from "@mui/icons-material/ErrorOutlined";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import {
  useAgentRunsGetRun,
  useAgentRunsSubmitRunInputs,
} from "@/api/endpoints/agent-runs/agent-runs";
import { RunStatus } from "@/api/model/runStatus";
import type { AgentRunPublic } from "@/api/model/agentRunPublic";
import type { AgentRunStepPublic } from "@/api/model/agentRunStepPublic";
import type { AgentStepSchema } from "@/api/model/agentStepSchema";
import type { AgentInputSchema } from "@/api/model/agentInputSchema";
import SchemaInputField from "@/features/agents/SchemaInputField";

const POLL_INTERVAL_MS = 3000;
const TERMINAL = new Set<string>([RunStatus.success, RunStatus.failed]);

function isPolling(status: string) {
  return !TERMINAL.has(status);
}

function stepDynamicOptions(
  input: AgentInputSchema,
  run: AgentRunPublic,
  schema: AgentStepSchema[],
): string[] | undefined {
  const slug = input.options_from_step_slug;
  if (!slug) return undefined;

  const sourceStep = schema.find((s) => s.slug === slug);
  if (!sourceStep) return undefined;

  const runStep = run.steps.find((rs) => rs.step_id === sourceStep.id);

  if (!runStep?.output) return undefined;

  const output = runStep.output as Record<string, unknown>;
  const candidates = Object.values(output).find((v) => Array.isArray(v)) as unknown[] | undefined;
  if (!candidates) return undefined;

  return candidates.filter((c): c is string => typeof c === "string");
}

function StepStatusIcon({ status }: { status: string }) {
  if (status === RunStatus.success) {
    return <CheckCircleOutlinedIcon fontSize="small" color="success" />;
  }
  if (status === RunStatus.failed) {
    return <ErrorOutlinedIcon fontSize="small" color="error" />;
  }
  if (status === RunStatus.running) {
    return <CircularProgress size={14} />;
  }
  return <HourglassEmptyIcon fontSize="small" color="disabled" />;
}

function StepRow({
  runStep,
  schemaStep,
}: {
  runStep: AgentRunStepPublic;
  schemaStep?: AgentStepSchema;
}) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        py: 0.75,
      }}
    >
      <StepStatusIcon status={runStep.status} />
      <Typography variant="body2" sx={{ flexGrow: 1 }}>
        {schemaStep?.slug ?? runStep.step_id}
      </Typography>
      <Chip
        label={runStep.status.replace("_", " ")}
        size="small"
        variant="outlined"
        color={
          runStep.status === RunStatus.success
            ? "success"
            : runStep.status === RunStatus.failed
              ? "error"
              : "default"
        }
      />
    </Box>
  );
}

type AwaitingFormValues = Record<string, string>;

function AwaitingInputForm({
  runId,
  run,
  schema,
  awaitedStep,
}: {
  runId: string;
  run: AgentRunPublic;
  schema: AgentStepSchema[];
  awaitedStep: AgentStepSchema;
}) {
  const t = useTranslations("AgentRun");
  const submit = useAgentRunsSubmitRunInputs();

  const runInputs = awaitedStep.inputs.filter((i) => i.scope === "run");

  const { control, handleSubmit } = useForm<AwaitingFormValues>({
    defaultValues: Object.fromEntries(runInputs.map((i) => [i.key, ""])),
  });

  const onSubmit = (values: AwaitingFormValues) => {
    submit.mutate({ runId, data: { inputs: values } });
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{ display: "flex", flexDirection: "column", gap: 2 }}
    >
      <Typography variant="subtitle2">{t("awaitingInputHeading")}</Typography>
      {runInputs.map((input) => (
        <SchemaInputField
          key={input.id}
          input={input}
          control={control}
          name={input.key as keyof AwaitingFormValues & string}
          disabled={submit.isPending}
          dynamicOptions={stepDynamicOptions(input, run, schema)}
        />
      ))}
      {submit.isError && (
        <Alert severity="error" sx={{ py: 0.5 }}>
          {t("runError")}
        </Alert>
      )}
      <Box>
        <Button type="submit" variant="contained" size="small" disabled={submit.isPending}>
          {submit.isPending ? t("submitting") : t("continueRun")}
        </Button>
      </Box>
    </Box>
  );
}

function TerminalSuccess({ run }: { run: AgentRunPublic }) {
  const t = useTranslations("AgentRun");

  const lastStep = [...run.steps].reverse().find((s) => s.status === RunStatus.success);
  const output = lastStep?.output as Record<string, unknown> | null | undefined;
  const urlPost = typeof output?.url_post === "string" ? output.url_post : null;
  const title = typeof output?.title === "string" ? output.title : null;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
      <Alert severity="success" icon={<CheckCircleOutlinedIcon />} sx={{ alignItems: "center" }}>
        {t("runSuccess")}
      </Alert>
      {title && (
        <Typography variant="body2" color="text.secondary">
          {title}
        </Typography>
      )}
      {urlPost && (
        <Box>
          <Link
            href={urlPost}
            target="_blank"
            rel="noopener noreferrer"
            sx={{ display: "inline-flex", alignItems: "center", gap: 0.5 }}
          >
            {t("viewPost")}
            <OpenInNewIcon fontSize="inherit" />
          </Link>
        </Box>
      )}
      {!urlPost && output && (
        <Box
          component="pre"
          sx={{
            fontSize: "0.75rem",
            overflow: "auto",
            bgcolor: "action.hover",
            p: 1.5,
            borderRadius: 1,
            maxHeight: 200,
          }}
        >
          {JSON.stringify(output, null, 2)}
        </Box>
      )}
    </Box>
  );
}

interface Props {
  runId: string;
  schema: AgentStepSchema[];
  onReset: () => void;
}

export default function RunProgress({ runId, schema, onReset }: Props) {
  const t = useTranslations("AgentRun");

  const { data: run } = useAgentRunsGetRun(runId, {
    query: {
      refetchInterval: (query) => {
        const status = query.state.data?.status;
        if (!status || isPolling(status)) return POLL_INTERVAL_MS;
        return false;
      },
    },
  });

  if (!run) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  const awaitedStep =
    run.status === RunStatus.awaiting_input
      ? schema.find((s) => s.order === run.current_step_order) ?? null
      : null;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        {run.steps.map((runStep) => {
          const schemaStep = schema.find((s) => s.id === runStep.step_id);
          return <StepRow key={runStep.id} runStep={runStep} schemaStep={schemaStep} />;
        })}
      </Box>

      {run.status === RunStatus.awaiting_input && awaitedStep && (
        <AwaitingInputForm
          runId={runId}
          run={run}
          schema={schema}
          awaitedStep={awaitedStep}
        />
      )}

      {run.status === RunStatus.success && (
        <>
          <TerminalSuccess run={run} />
          <Box>
            <Button variant="outlined" size="small" onClick={onReset}>
              {t("runAgain")}
            </Button>
          </Box>
        </>
      )}

      {run.status === RunStatus.failed && (
        <>
          <Alert severity="error" icon={<ErrorOutlinedIcon />}>
            {run.error ?? t("runError")}
            {run.credits_debited > 0 && (
              <Typography variant="caption" sx={{ display: "block", mt: 0.5 }}>
                {t("creditsRefunded")}
              </Typography>
            )}
          </Alert>
          <Box>
            <Button variant="outlined" size="small" onClick={onReset}>
              {t("retry")}
            </Button>
          </Box>
        </>
      )}

      {(run.status === RunStatus.pending || run.status === RunStatus.running) && (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <CircularProgress size={16} />
          <Typography variant="body2" color="text.secondary">
            {t("generating")}
          </Typography>
        </Box>
      )}
    </Box>
  );
}
