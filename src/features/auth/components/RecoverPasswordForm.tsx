"use client";

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
import { useAuthForgotPassword } from "@/api/endpoints/auth/auth";

type FormValues = {
  email: string;
};

export default function RecoverPasswordForm() {
  const t = useTranslations("Auth");
  const tCommon = useTranslations("Common");
  const tValidation = useTranslations("Validation");

  const schema = z.object({
    email: z.string().email(tValidation("emailInvalid")),
  });

  const { control, handleSubmit } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  });

  const forgot = useAuthForgotPassword();

  const onSubmit = (values: FormValues) =>
    forgot.mutate({ data: { email: values.email } });

  if (forgot.isSuccess) {
    return (
      <Box>
        <Stack spacing={2.5}>
          <Typography variant="h5" component="h1" sx={{ fontWeight: 600 }}>
            {t("recoverPassword.heading")}
          </Typography>
          <Alert severity="success">{t("recoverPassword.sent")}</Alert>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            <MuiLink component={Link} href="/login">
              {t("recoverPassword.goToLogin")}
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
          {t("recoverPassword.heading")}
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {t("recoverPassword.description")}
        </Typography>
        <Controller
          name="email"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label={tCommon("email")}
              type="email"
              autoComplete="email"
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
          disabled={forgot.isPending}
          fullWidth
        >
          {forgot.isPending
            ? t("recoverPassword.submitting")
            : t("recoverPassword.submitButton")}
        </Button>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          <MuiLink component={Link} href="/login">
            {t("recoverPassword.goToLogin")}
          </MuiLink>
        </Typography>
      </Stack>
    </Box>
  );
}
