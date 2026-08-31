"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutlined";

const REDIRECT_DELAY_MS = 1200;

export default function GoogleLoginSuccessPage() {
  const t = useTranslations("Auth");
  const router = useRouter();

  useEffect(() => {
    const id = setTimeout(() => router.replace("/"), REDIRECT_DELAY_MS);
    return () => clearTimeout(id);
  }, [router]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
      }}
    >
      <CheckCircleOutlineIcon sx={{ fontSize: 48, color: "success.main" }} />
      <Typography variant="h6" sx={{ fontWeight: 600, textAlign: "center" }}>
        {t("loginSuccessHeading")}
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ textAlign: "center" }}
      >
        {t("loginSuccessBody")}
      </Typography>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <CircularProgress size={16} />
        <Typography variant="body2" color="text.secondary">
          {t("redirecting")}
        </Typography>
      </Box>
    </Box>
  );
}
