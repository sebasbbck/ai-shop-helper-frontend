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
import { useOrgsCreateOrg, getOrgsGetMyOrgsQueryKey } from "@/api/endpoints/orgs/orgs";
import { useProjectsCreateProject } from "@/api/endpoints/projects/projects";
import { useProjectTypesGetProjectTypes } from "@/api/endpoints/project-types/project-types";
import { useActiveContext } from "@/features/shell/ActiveContext";

const orgSchema = z.object({
  name: z.string().min(1),
});

const projectSchema = z.object({
  name: z.string().min(1),
  project_type_id: z.string().min(1),
});

type OrgFormValues = z.infer<typeof orgSchema>;
type ProjectFormValues = z.infer<typeof projectSchema>;

export default function BootstrapWizard() {
  const t = useTranslations("Bootstrap");
  const tc = useTranslations("Common");
  const tv = useTranslations("Validation");
  const router = useRouter();
  const qc = useQueryClient();
  const { selectAfterCreate } = useActiveContext();

  const [step, setStep] = useState<1 | 2>(1);
  const [newOrgId, setNewOrgId] = useState<string | null>(null);

  const { data: typesData } = useProjectTypesGetProjectTypes(
    {},
    { query: { enabled: step === 2 } },
  );
  const projectTypes = typesData?.items ?? [];

  const {
    register: registerOrg,
    handleSubmit: handleOrgSubmit,
    formState: { errors: orgErrors },
    setError: setOrgError,
  } = useForm<OrgFormValues>({ resolver: zodResolver(orgSchema) });

  const {
    register: registerProject,
    handleSubmit: handleProjectSubmit,
    control: projectControl,
    formState: { errors: projectErrors },
    setError: setProjectError,
  } = useForm<ProjectFormValues>({ resolver: zodResolver(projectSchema) });

  const createOrg = useOrgsCreateOrg({
    mutation: {
      onSuccess: (org) => {
        setNewOrgId(org.id);
        setStep(2);
      },
      onError: () => {
        setOrgError("root", { message: t("createOrgError") });
      },
    },
  });

  const createProject = useProjectsCreateProject({
    mutation: {
      onSuccess: async (project) => {
        await qc.invalidateQueries({ queryKey: getOrgsGetMyOrgsQueryKey() });
        selectAfterCreate(newOrgId!, project.id);
        router.push("/project");
      },
      onError: () => {
        setProjectError("root", { message: t("createProjectError") });
      },
    },
  });

  const onOrgSubmit = (values: OrgFormValues) => {
    createOrg.mutate({ data: { name: values.name } });
  };

  const onProjectSubmit = (values: ProjectFormValues) => {
    if (!newOrgId) return;
    createProject.mutate({
      orgId: newOrgId,
      data: {
        org_id: newOrgId,
        name: values.name,
        project_type_id: values.project_type_id,
      },
    });
  };

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
          boxShadow: "0 1px 3px 0 rgba(0,0,0,.08), 0 4px 16px 0 rgba(0,0,0,.06)",
        }}
      >
        <Typography
          variant="caption"
          sx={{ color: "text.disabled", textTransform: "none", letterSpacing: 0 }}
        >
          {t("stepOf", { step, total: 2 })}
        </Typography>

        {step === 1 ? (
          <form onSubmit={handleOrgSubmit(onOrgSubmit)} noValidate>
            <Typography variant="h5" sx={{ fontWeight: 600, mt: 0.5, mb: 3 }}>
              {t("orgHeading")}
            </Typography>

            {orgErrors.root && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {orgErrors.root.message}
              </Alert>
            )}

            <TextField
              label={tc("name")}
              fullWidth
              autoFocus
              size="small"
              error={Boolean(orgErrors.name)}
              helperText={orgErrors.name ? tv("nameRequired") : undefined}
              {...registerOrg("name")}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={createOrg.isPending}
              sx={{ mt: 3 }}
            >
              {createOrg.isPending ? tc("creating") : t("continueButton")}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleProjectSubmit(onProjectSubmit)} noValidate>
            <Typography variant="h5" sx={{ fontWeight: 600, mt: 0.5, mb: 3 }}>
              {t("projectHeading")}
            </Typography>

            {projectErrors.root && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {projectErrors.root.message}
              </Alert>
            )}

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                label={tc("name")}
                fullWidth
                autoFocus
                size="small"
                error={Boolean(projectErrors.name)}
                helperText={projectErrors.name ? tv("nameRequired") : undefined}
                {...registerProject("name")}
              />

              <Controller
                name="project_type_id"
                control={projectControl}
                defaultValue=""
                render={({ field }) => (
                  <FormControl
                    size="small"
                    fullWidth
                    error={Boolean(projectErrors.project_type_id)}
                  >
                    <InputLabel>{t("projectTypeLabel")}</InputLabel>
                    <Select {...field} label={t("projectTypeLabel")}>
                      {projectTypes.map((pt) => (
                        <MenuItem key={pt.id} value={pt.id}>
                          {pt.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {projectErrors.project_type_id && (
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
              disabled={createProject.isPending}
              sx={{ mt: 3 }}
            >
              {createProject.isPending ? tc("creating") : t("finishButton")}
            </Button>
          </form>
        )}
      </Box>
    </Box>
  );
}
