"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useTranslations } from "next-intl";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Skeleton from "@mui/material/Skeleton";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import {
  useAgentRunsGetProjectContext,
  useAgentRunsPutProjectContext,
} from "@/api/endpoints/agent-runs/agent-runs";
import type { ProjectContextFieldSchema } from "@/api/model/projectContextFieldSchema";

interface Props {
  projectId: string;
}

type FormValues = Record<string, string>;

function buildDefaults(
  fields: ProjectContextFieldSchema[],
  saved: Record<string, string>,
): FormValues {
  return Object.fromEntries(fields.map((f) => [f.key, saved[f.key] ?? ""]));
}

export default function ProjectContextSection({ projectId }: Props) {
  const t = useTranslations();
  const tc = useTranslations("Common");
  const tp = useTranslations("Project");

  const { data, isLoading } = useAgentRunsGetProjectContext(projectId);
  const putContext = useAgentRunsPutProjectContext();

  const [saveState, setSaveState] = useState<"idle" | "saved" | "error">("idle");

  const { control, handleSubmit, reset, formState } = useForm<FormValues>({
    defaultValues: {},
  });

  useEffect(() => {
    if (!data) return;
    reset(buildDefaults(data.fields, data.values));
  }, [data?.project_id, reset]);

  const onSubmit = (values: FormValues) => {
    setSaveState("idle");
    putContext.mutate(
      { projectId, data: { values } },
      {
        onSuccess: () => setSaveState("saved"),
        onError: () => setSaveState("error"),
      },
    );
  };

  if (isLoading || !data) {
    return (
      <Box sx={{ mt: 5 }}>
        <Skeleton variant="text" width={160} height={28} sx={{ mb: 2 }} />
        <Skeleton variant="rounded" height={56} sx={{ mb: 2 }} />
        <Skeleton variant="rounded" height={100} />
      </Box>
    );
  }

  if (data.fields.length === 0) return null;

  const fieldLabel = (field: ProjectContextFieldSchema) => {
    try {
      return t(field.label_i18n_key as Parameters<typeof t>[0]);
    } catch {
      return field.label_i18n_key;
    }
  };

  return (
    <Box sx={{ mt: 5 }}>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
        {t("ProjectContext.heading" as Parameters<typeof t>[0])}
      </Typography>

      {saveState === "saved" && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {t("AgentRun.configSaved" as Parameters<typeof t>[0])}
        </Alert>
      )}
      {saveState === "error" && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {tp("saveError")}
        </Alert>
      )}

      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{ display: "flex", flexDirection: "column", gap: 2, maxWidth: 400 }}
      >
        {data.fields.map((field) => (
          <Controller
            key={field.key}
            name={field.key}
            control={control}
            rules={{
              required: field.required
                ? t("Validation.required" as Parameters<typeof t>[0])
                : false,
            }}
            render={({ field: f, fieldState }) => (
              <TextField
                {...f}
                label={fieldLabel(field)}
                size="small"
                fullWidth
                multiline={field.input_type === "textarea"}
                minRows={field.input_type === "textarea" ? 3 : undefined}
                required={field.required}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />
        ))}

        <Box>
          <Button
            type="submit"
            variant="contained"
            disabled={putContext.isPending || !formState.isDirty}
          >
            {putContext.isPending ? tc("saving") : tc("save")}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
