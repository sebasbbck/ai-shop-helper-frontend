"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
  useOrgsCreateOrg,
  getOrgsGetMyOrgsQueryKey,
} from "@/api/endpoints/orgs/orgs";
import { useProjectsCreateProject } from "@/api/endpoints/projects/projects";
import { useProjectTypesGetProjectTypes } from "@/api/endpoints/project-types/project-types";
import { useActiveContext } from "@/features/shell/ActiveContext";

const schema = z.object({
  orgName: z.string().min(1),
  projectName: z.string().min(1),
  project_type_id: z.string().min(1),
});

type FormValues = z.infer<typeof schema>;

export default function BootstrapWizard() {
  const t = useTranslations("Bootstrap");
  const tc = useTranslations("Common");
  const tv = useTranslations("Validation");
  const router = useRouter();
  const qc = useQueryClient();
  const { selectAfterCreate } = useActiveContext();

  // An org created on a previous, partially-failed submit (project step errored):
  // retried submits reuse it instead of creating a duplicate organization.
  const [createdOrgId, setCreatedOrgId] = useState<string | null>(null);

  const { data: typesData } = useProjectTypesGetProjectTypes();
  const projectTypes = typesData?.items ?? [];

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setError,
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const createOrg = useOrgsCreateOrg();
  const createProject = useProjectsCreateProject();

  const finishOnboarding = async (orgId: string, projectId: string) => {
    await qc.invalidateQueries({ queryKey: getOrgsGetMyOrgsQueryKey() });
    selectAfterCreate(orgId, projectId);
    router.push("/billing?onboarding=1");
  };

  const createProjectForOrg = (orgId: string, values: FormValues) => {
    createProject.mutate(
      {
        orgId,
        data: {
          org_id: orgId,
          name: values.projectName,
          project_type_id: values.project_type_id,
        },
      },
      {
        onSuccess: (project) => finishOnboarding(orgId, project.id),
        onError: () => {
          setError("root", { message: t("createProjectError") });
        },
      },
    );
  };

  const onSubmit = (values: FormValues) => {
    if (createdOrgId) {
      createProjectForOrg(createdOrgId, values);
      return;
    }
    createOrg.mutate(
      { data: { name: values.orgName } },
      {
        onSuccess: (org) => {
          setCreatedOrgId(org.id);
          createProjectForOrg(org.id, values);
        },
        onError: () => {
          setError("root", { message: t("createOrgError") });
        },
      },
    );
  };

  const isPending = createOrg.isPending || createProject.isPending;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
        bgcolor: "background.default",
      }}
    >
      <Box sx={{ mb: 5, textAlign: "center" }}>
        <Typography
          variant="h6"
          sx={{ fontWeight: 700, letterSpacing: -0.5, color: "primary.main" }}
        >
          AI Shop Helper
        </Typography>
      </Box>

      <Box
        sx={{
          width: "100%",
          maxWidth: 420,
          bgcolor: "background.paper",
          borderRadius: 3,
          p: 4,
          boxShadow:
            "0 1px 3px 0 rgba(0,0,0,.08), 0 4px 16px 0 rgba(0,0,0,.06)",
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Typography variant="h5" sx={{ fontWeight: 600, mt: 0.5, mb: 3 }}>
            {t("heading")}
          </Typography>

          {errors.root && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errors.root.message}
            </Alert>
          )}

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label={t("orgNameLabel")}
              fullWidth
              autoFocus
              size="small"
              error={Boolean(errors.orgName)}
              helperText={errors.orgName ? tv("nameRequired") : undefined}
              {...register("orgName")}
            />

            <TextField
              label={t("projectNameLabel")}
              fullWidth
              size="small"
              error={Boolean(errors.projectName)}
              helperText={errors.projectName ? tv("nameRequired") : undefined}
              {...register("projectName")}
            />

            <Controller
              name="project_type_id"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <FormControl
                  size="small"
                  fullWidth
                  error={Boolean(errors.project_type_id)}
                >
                  <InputLabel>{t("projectTypeLabel")}</InputLabel>
                  <Select {...field} label={t("projectTypeLabel")}>
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

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={isPending}
            sx={{ mt: 3 }}
          >
            {isPending ? tc("creating") : t("continueButton")}
          </Button>
        </form>
      </Box>
    </Box>
  );
}
