"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import {
  useAgentRunsGetProjectAgentInputs,
  useAgentRunsPutProjectAgentInputs,
} from "@/api/endpoints/agent-runs/agent-runs";
import type { AgentInputSchema } from "@/api/model/agentInputSchema";
import SchemaInputField from "@/features/agents/SchemaInputField";

interface Props {
  projectId: string;
  inputs: AgentInputSchema[];
}

type FormValues = Record<string, string>;

export default function ProjectConfigSection({ projectId, inputs }: Props) {
  const t = useTranslations("AgentRun");
  const tCommon = useTranslations("Common");

  const { data: saved, isLoading } = useAgentRunsGetProjectAgentInputs(projectId);

  const { control, handleSubmit, reset, formState } = useForm<FormValues>({
    defaultValues: {},
  });

  useEffect(() => {
    if (!saved) return;
    const vals: FormValues = {};
    for (const item of saved.inputs) {
      vals[item.input_key] = item.value;
    }
    reset(vals);
  }, [saved, reset]);

  const put = useAgentRunsPutProjectAgentInputs();

  const onSubmit = (values: FormValues) => {
    put.mutate({ projectId, data: { values } });
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
        <Skeleton variant="rounded" height={40} />
        <Skeleton variant="rounded" height={40} />
      </Box>
    );
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{ display: "flex", flexDirection: "column", gap: 2 }}
    >
      <Typography variant="subtitle2" color="text.secondary">
        {t("projectConfigHeading")}
      </Typography>

      {inputs.map((input) => (
        <SchemaInputField
          key={input.id}
          input={input}
          control={control}
          name={input.key as keyof FormValues & string}
          disabled={put.isPending}
        />
      ))}

      {put.isSuccess && (
        <Alert severity="success" sx={{ py: 0.5 }}>
          {t("configSaved")}
        </Alert>
      )}
      {put.isError && (
        <Alert severity="error" sx={{ py: 0.5 }}>
          {t("runError")}
        </Alert>
      )}

      <Box>
        <Button
          type="submit"
          variant="outlined"
          size="small"
          disabled={put.isPending || !formState.isDirty}
        >
          {put.isPending ? tCommon("saving") : tCommon("save")}
        </Button>
      </Box>
    </Box>
  );
}
