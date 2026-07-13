"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import MuiLink from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useAuthVerifyEmail } from "@/api/endpoints/auth/auth";

export default function VerifyEmail() {
  const t = useTranslations("Auth");
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const called = useRef(false);
  const [noToken, setNoToken] = useState(false);

  const verify = useAuthVerifyEmail();
  const { mutate } = verify;

  useEffect(() => {
    if (called.current) return;
    called.current = true;
    if (token) {
      mutate({ data: { token } });
    } else {
      setNoToken(true);
    }
  }, [token, mutate]);

  const isSuccess = verify.isSuccess;
  const isError = verify.isError || noToken;
  const isVerifying = !isSuccess && !isError;

  return (
    <Box>
      <Stack spacing={2.5}>
        <Typography variant="h5" component="h1" sx={{ fontWeight: 600 }}>
          {t("verifyEmail.heading")}
        </Typography>
        {isVerifying && !isError && !isSuccess && (
          <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
            <CircularProgress size={18} />
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {t("verifyEmail.verifying")}
            </Typography>
          </Stack>
        )}
        {isSuccess && (
          <Alert severity="success">{t("verifyEmail.success")}</Alert>
        )}
        {isError && (
          <Alert severity="error">{t("verifyEmail.error")}</Alert>
        )}
        {(isSuccess || isError) && (
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            <MuiLink component={Link} href="/login">
              {t("verifyEmail.goToLogin")}
            </MuiLink>
          </Typography>
        )}
      </Stack>
    </Box>
  );
}
