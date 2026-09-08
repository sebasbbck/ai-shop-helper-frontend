"use client";

import { useState } from "react";
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
import Divider from "@mui/material/Divider";
import MuiLink from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import {
  useAuthLogin,
  useAuthResendVerification,
} from "@/api/endpoints/auth/auth";
import { setAccessToken } from "@/lib/api/token-store";
import GoogleLoginButton from "./GoogleLoginButton";

type FormValues = {
  email: string;
  password: string;
};

function isEmailNotVerified(err: unknown): boolean {
  if (typeof err !== "object" || err === null) return false;
  const response = (
    err as { response?: { status?: number; data?: { detail?: unknown } } }
  ).response;
  return (
    response?.status === 403 && response?.data?.detail === "email_not_verified"
  );
}

export default function LoginForm() {
  const t = useTranslations("Auth");
  const tCommon = useTranslations("Common");
  const tValidation = useTranslations("Validation");
  const router = useRouter();
  const searchParams = useSearchParams();
  const justRegistered = searchParams.get("registered") === "1";

  const [needsVerification, setNeedsVerification] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [resendDone, setResendDone] = useState(false);

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
      onError: (err: unknown) => {
        if (isEmailNotVerified(err)) {
          setNeedsVerification(true);
        }
      },
    },
  });

  const resend = useAuthResendVerification({
    mutation: {
      onSuccess: () => setResendDone(true),
    },
  });

  const onSubmit = (values: FormValues) => {
    setNeedsVerification(false);
    setResendDone(false);
    setSubmittedEmail(values.email);
    login.mutate({
      data: { username: values.email, password: values.password },
    });
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={2.5}>
        <Typography variant="h5" component="h1" sx={{ fontWeight: 600 }}>
          {t("signIn.heading")}
        </Typography>
        {justRegistered && (
          <Alert severity="success">{t("signIn.registered")}</Alert>
        )}
        {login.isError && !needsVerification && (
          <Alert severity="error">{t("signIn.invalidCredentials")}</Alert>
        )}
        {needsVerification && (
          <Alert
            severity="info"
            action={
              resendDone ? undefined : (
                <Button
                  color="inherit"
                  size="small"
                  disabled={resend.isPending}
                  onClick={() =>
                    resend.mutate({ data: { email: submittedEmail } })
                  }
                >
                  {t("signIn.resend")}
                </Button>
              )
            }
          >
            {resendDone ? t("signIn.resendSent") : t("signIn.emailNotVerified")}
          </Alert>
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
        <Typography variant="body2" sx={{ textAlign: "right" }}>
          <MuiLink component={Link} href="/recover-password">
            {t("signIn.forgotPassword")}
          </MuiLink>
        </Typography>
        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={login.isPending}
          fullWidth
        >
          {login.isPending ? t("signIn.submitting") : t("signIn.submitButton")}
        </Button>
        <Divider>
          <Typography variant="body2" color="text.secondary">
            {t("orDivider")}
          </Typography>
        </Divider>
        <GoogleLoginButton />
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
