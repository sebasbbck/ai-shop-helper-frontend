"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import GoogleIcon from "@mui/icons-material/Google";
import { googleLoginWithGoogle } from "@/api/endpoints/google/google";

export default function GoogleLoginButton() {
  const t = useTranslations("Auth");
  const [isPending, setIsPending] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleClick = async () => {
    setHasError(false);
    setIsPending(true);
    try {
      const { auth_url } = await googleLoginWithGoogle();
      window.location.href = auth_url;
    } catch {
      setHasError(true);
      setIsPending(false);
    }
  };

  return (
    <>
      {hasError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {t("googleError")}
        </Alert>
      )}
      <Button
        variant="outlined"
        size="large"
        fullWidth
        startIcon={<GoogleIcon />}
        disabled={isPending}
        onClick={handleClick}
      >
        {isPending ? t("connectingGoogle") : t("continueWithGoogle")}
      </Button>
    </>
  );
}
