"use client";

import { useSearchParams } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useTranslations } from "next-intl";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import MuiLink from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useAuthResetPassword } from "@/api/endpoints/auth/auth";

type FormValues = {
  new_password: string;
  confirm: string;
};

export default function ResetPasswordForm() {
  const t = useTranslations("Auth");
  const tValidation = useTranslations("Validation");
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const schema = z
    .object({
      new_password: z.string().min(8, tValidation("passwordMin")),
      confirm: z.string().min(1, tValidation("required")),
    })
    .refine((data) => data.new_password === data.confirm, {
      message: t("resetPassword.mismatch"),
      path: ["confirm"],
    });

  const { control, handleSubmit } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { new_password: "", confirm: "" },
  });

  const reset = useAuthResetPassword();

  const onSubmit = (values: FormValues) => {
    if (!token) return;
    reset.mutate({ data: { token, new_password: values.new_password } });
  };

  if (!token) {
    return (
      <Box>
        <Stack spacing={2.5}>
          <Typography variant="h5" component="h1" sx={{ fontWeight: 600 }}>
            {t("resetPassword.heading")}
          </Typography>
          <Alert severity="error">{t("resetPassword.error")}</Alert>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            <MuiLink component={Link} href="/login">
              {t("resetPassword.goToLogin")}
            </MuiLink>
          </Typography>
        </Stack>
      </Box>
    );
  }

  if (reset.isSuccess) {
    return (
      <Box>
        <Stack spacing={2.5}>
          <Typography variant="h5" component="h1" sx={{ fontWeight: 600 }}>
            {t("resetPassword.heading")}
          </Typography>
          <Alert severity="success">{t("resetPassword.success")}</Alert>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            <MuiLink component={Link} href="/login">
              {t("resetPassword.goToLogin")}
            </MuiLink>
          </Typography>
        </Stack>
      </Box>
    );
  }

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={2.5}>
        <Typography variant="h5" component="h1" sx={{ fontWeight: 600 }}>
          {t("resetPassword.heading")}
        </Typography>
        {reset.isError && (
          <Alert severity="error">{t("resetPassword.error")}</Alert>
        )}
        <Controller
          name="new_password"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label={t("resetPassword.newPassword")}
              type="password"
              autoComplete="new-password"
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              fullWidth
            />
          )}
        />
        <Controller
          name="confirm"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label={t("resetPassword.confirmPassword")}
              type="password"
              autoComplete="new-password"
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              fullWidth
            />
          )}
        />
        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={reset.isPending}
          fullWidth
        >
          {reset.isPending
            ? t("resetPassword.submitting")
            : t("resetPassword.submitButton")}
        </Button>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          <MuiLink component={Link} href="/login">
            {t("resetPassword.goToLogin")}
          </MuiLink>
        </Typography>
      </Stack>
    </Box>
  );
}
