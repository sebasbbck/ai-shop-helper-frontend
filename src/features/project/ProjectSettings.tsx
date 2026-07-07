"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import {
  useProjectsUpdateProject,
} from "@/api/endpoints/projects/projects";
import { useProjectTypesGetProjectTypes } from "@/api/endpoints/project-types/project-types";
import { getOrgsGetMyOrgsQueryKey } from "@/api/endpoints/orgs/orgs";
import { useActiveContext } from "@/features/shell/ActiveContext";
import WordpressConnectionSection from "@/features/project/WordpressConnectionSection";

const schema = z.object({
  name: z.string().min(1),
  project_type_id: z.string().min(1),
});

type FormValues = z.infer<typeof schema>;

export default function ProjectSettings() {
  const t = useTranslations("Project");
  const ts = useTranslations("Shell");
  const tc = useTranslations("Common");
  const tv = useTranslations("Validation");
  const qc = useQueryClient();
  const { activeProject, activeProjectId, activeOrgId } = useActiveContext();

  const { data: typesData } = useProjectTypesGetProjectTypes({});
  const projectTypes = typesData?.items ?? [];

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitSuccessful },
    setError,
    clearErrors,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: activeProject?.name ?? "",
      project_type_id: activeProject?.project_type_id ?? "",
    },
  });

  useEffect(() => {
    if (activeProject) {
      reset({
        name: activeProject.name,
        project_type_id: activeProject.project_type_id,
      });
    }
  }, [activeProject, reset]);

  const updateProject = useProjectsUpdateProject({
    mutation: {
      onSuccess: async () => {
        await qc.invalidateQueries({ queryKey: getOrgsGetMyOrgsQueryKey() });
        clearErrors();
      },
      onError: () => {
        setError("root", { message: t("saveError") });
      },
    },
  });

  const onSubmit = (values: FormValues) => {
    if (!activeOrgId || !activeProjectId) return;
    updateProject.mutate({
      orgId: activeOrgId,
      projectId: activeProjectId,
      data: { name: values.name, project_type_id: values.project_type_id },
    });
  };

  return (
    <Box sx={{ maxWidth: 480 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, letterSpacing: -0.5, mb: 5 }}>
        {t("settingsHeading")}
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {errors.root && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {errors.root.message}
          </Alert>
        )}

        {isSubmitSuccessful && !errors.root && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {t("saved")}
          </Alert>
        )}

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
          <TextField
            label={tc("name")}
            fullWidth
            size="small"
            error={Boolean(errors.name)}
            helperText={errors.name ? tv("nameRequired") : undefined}
            {...register("name")}
          />

          <Controller
            name="project_type_id"
            control={control}
            render={({ field }) => (
              <FormControl
                size="small"
                fullWidth
                error={Boolean(errors.project_type_id)}
              >
                <InputLabel>{ts("projectType")}</InputLabel>
                <Select {...field} label={ts("projectType")}>
                  {projectTypes.map((pt) => (
                    <MenuItem key={pt.id} value={pt.id}>
                      {pt.name}
                    </MenuItem>
                  ))}
                </Select>
                {errors.project_type_id && (
                  <FormHelperText>{tv("required")}</FormHelperText>
                )}
              </FormControl>
            )}
          />
        </Box>

        <Box sx={{ mt: 3 }}>
          <Button
            type="submit"
            variant="contained"
            disabled={updateProject.isPending}
          >
            {updateProject.isPending ? tc("saving") : tc("save")}
          </Button>
        </Box>
      </form>

      {activeProjectId && (
        <WordpressConnectionSection projectId={activeProjectId} />
      )}
    </Box>
  );
}
