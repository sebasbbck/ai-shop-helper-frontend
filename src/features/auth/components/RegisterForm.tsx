"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import MuiLink from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useAuthRegister } from "@/api/endpoints/auth/auth";

type FormValues = {
  name: string;
  email: string;
  password: string;
};

export default function RegisterForm() {
  const t = useTranslations("Auth");
  const tCommon = useTranslations("Common");
  const tValidation = useTranslations("Validation");
  const router = useRouter();

  const schema = z.object({
    name: z.string().min(1, tValidation("nameRequired")),
    email: z.string().email(tValidation("emailInvalid")),
    password: z.string().min(8, tValidation("passwordMin")).max(128),
  });

  const { control, handleSubmit } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", password: "" },
  });

  const register = useAuthRegister({
    mutation: {
      onSuccess: () => router.replace("/login?registered=1"),
    },
  });

  const errorMessage =
    register.error?.response?.status === 409
      ? t("register.emailTaken")
      : t("register.createError");

  const onSubmit = (values: FormValues) => register.mutate({ data: values });

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={2.5}>
        <Typography variant="h5" component="h1" sx={{ fontWeight: 600 }}>
          {t("register.heading")}
        </Typography>
        {register.isError && <Alert severity="error">{errorMessage}</Alert>}
        <Controller
          name="name"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label={tCommon("name")}
              autoComplete="name"
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              fullWidth
            />
          )}
        />
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
        <Controller
          name="password"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label={tCommon("password")}
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
          disabled={register.isPending}
          fullWidth
        >
          {register.isPending
            ? t("register.submitting")
            : t("register.submitButton")}
        </Button>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {t("register.haveAccount")}{" "}
          <MuiLink component={Link} href="/login">
            {t("register.signIn")}
          </MuiLink>
        </Typography>
      </Stack>
    </Box>
  );
}
