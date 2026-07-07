"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useOrgsUpdateOrg, getOrgsGetMyOrgsQueryKey } from "@/api/endpoints/orgs/orgs";
import { useActiveContext } from "@/features/shell/ActiveContext";

const schema = z.object({
  name: z.string().min(1),
});

type FormValues = z.infer<typeof schema>;

export default function OrgSettings() {
  const t = useTranslations("Org");
  const tc = useTranslations("Common");
  const tv = useTranslations("Validation");
  const qc = useQueryClient();
  const { activeOrg, activeOrgId } = useActiveContext();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
    setError,
    clearErrors,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: activeOrg?.name ?? "" },
  });

  useEffect(() => {
    if (activeOrg) {
      reset({ name: activeOrg.name });
    }
  }, [activeOrg, reset]);

  const updateOrg = useOrgsUpdateOrg({
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
    if (!activeOrgId) return;
    updateOrg.mutate({ orgId: activeOrgId, data: { name: values.name } });
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

        <TextField
          label={tc("name")}
          fullWidth
          size="small"
          error={Boolean(errors.name)}
          helperText={errors.name ? tv("nameRequired") : undefined}
          {...register("name")}
        />

        <Box sx={{ mt: 3 }}>
          <Button
            type="submit"
            variant="contained"
            disabled={updateOrg.isPending}
          >
            {updateOrg.isPending ? tc("saving") : tc("save")}
          </Button>
        </Box>
      </form>
    </Box>
  );
}
