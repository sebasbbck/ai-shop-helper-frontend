"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQueryClient } from "@tanstack/react-query";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import { useProjectsCreateProject } from "@/api/endpoints/projects/projects";
import { useProjectTypesGetProjectTypes } from "@/api/endpoints/project-types/project-types";
import { getOrgsGetMyOrgsQueryKey } from "@/api/endpoints/orgs/orgs";
import { useActiveContext } from "@/features/shell/ActiveContext";

const schema = z.object({
  name: z.string().min(1),
  project_type_id: z.string().min(1),
});
type FormValues = z.infer<typeof schema>;

interface CreateProjectDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function CreateProjectDialog({ open, onClose }: CreateProjectDialogProps) {
  const t = useTranslations("Shell");
  const tc = useTranslations("Common");
  const tv = useTranslations("Validation");
  const router = useRouter();
  const qc = useQueryClient();
  const { activeOrgId, selectAfterCreate } = useActiveContext();

  const { data: typesData } = useProjectTypesGetProjectTypes(
    {},
    { query: { enabled: open } },
  );
  const projectTypes = typesData?.items ?? [];

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setError,
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const createProject = useProjectsCreateProject({
    mutation: {
      onSuccess: async (project) => {
        await qc.invalidateQueries({ queryKey: getOrgsGetMyOrgsQueryKey() });
        selectAfterCreate(activeOrgId!, project.id);
        router.push("/project");
        onClose();
        reset();
      },
      onError: () => {
        setError("root", { message: t("createProjectError") });
      },
    },
  });

  const onSubmit = (values: FormValues) => {
    if (!activeOrgId) return;
    createProject.mutate({
      orgId: activeOrgId,
      data: { org_id: activeOrgId, name: values.name, project_type_id: values.project_type_id },
    });
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <DialogTitle>{t("newProject")}</DialogTitle>
        <DialogContent
          sx={{ pt: "12px !important", display: "flex", flexDirection: "column", gap: 2 }}
        >
          {errors.root && (
            <Alert severity="error">{errors.root.message}</Alert>
          )}
          <TextField
            label={tc("name")}
            fullWidth
            autoFocus
            size="small"
            error={Boolean(errors.name)}
            helperText={errors.name ? tv("nameRequired") : undefined}
            {...register("name")}
          />
          <Controller
            name="project_type_id"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <FormControl size="small" fullWidth error={Boolean(errors.project_type_id)}>
                <InputLabel>{t("projectType")}</InputLabel>
                <Select {...field} label={t("projectType")}>
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
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleClose} color="inherit">
            {tc("cancel")}
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={createProject.isPending || !activeOrgId}
          >
            {createProject.isPending ? tc("creating") : tc("create")}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
