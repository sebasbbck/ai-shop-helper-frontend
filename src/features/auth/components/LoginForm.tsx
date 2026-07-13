"use client";

import { useSearchParams } from "next/navigation";
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
import { useAuthLogin } from "@/api/endpoints/auth/auth";
import { setAccessToken } from "@/lib/api/token-store";

type FormValues = {
  email: string;
  password: string;
};

export default function LoginForm() {
  const t = useTranslations("Auth");
  const tCommon = useTranslations("Common");
  const tValidation = useTranslations("Validation");
  const router = useRouter();
  const searchParams = useSearchParams();
  const justRegistered = searchParams.get("registered") === "1";

  const schema = z.object({
    email: z.string().email(tValidation("emailInvalid")),
    password: z.string().min(1, tValidation("required")),
  });

  const { control, handleSubmit } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  const login = useAuthLogin({
    mutation: {
      onSuccess: (token) => {
        setAccessToken(token.access_token);
        router.push("/");
      },
    },
  });

  const onSubmit = (values: FormValues) =>
    login.mutate({ data: { username: values.email, password: values.password } });

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={2.5}>
        <Typography variant="h5" component="h1" sx={{ fontWeight: 600 }}>
          {t("signIn.heading")}
        </Typography>
        {justRegistered && (
          <Alert severity="success">{t("signIn.registered")}</Alert>
        )}
        {login.isError && (
          <Alert severity="error">{t("signIn.invalidCredentials")}</Alert>
        )}
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
              autoComplete="current-password"
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              fullWidth
            />
          )}
        />
        <Button
          type="submit"
          name="submit"
          variant="contained"
          size="large"
          disabled={login.isPending}
          fullWidth
        >
          {login.isPending ? t("signIn.submitting") : t("signIn.submitButton")}
        </Button>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {t("signIn.noAccount")}{" "}
          <MuiLink component={Link} href="/register">
            {t("signIn.createOne")}
          </MuiLink>
        </Typography>
      </Stack>
    </Box>
  );
}
