"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutlined";

const REDIRECT_DELAY_MS = 1200;

export default function ConnectionSuccessPage() {
  const t = useTranslations("Connection");
  const router = useRouter();

  useEffect(() => {
    const id = setTimeout(
      () => router.replace("/project/settings"),
      REDIRECT_DELAY_MS,
    );
    return () => clearTimeout(id);
  }, [router]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
        p: 4,
      }}
    >
      <CheckCircleOutlineIcon sx={{ fontSize: 56, color: "success.main" }} />
      <Typography variant="h4" sx={{ fontWeight: 700, textAlign: "center" }}>
        {t("successHeading")}
      </Typography>
      <Typography
        variant="body1"
        color="text.secondary"
        sx={{ textAlign: "center", maxWidth: 440 }}
      >
        {t("successBody")}
      </Typography>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
        <CircularProgress size={16} />
        <Typography variant="body2" color="text.secondary">
          {t("redirecting")}
        </Typography>
      </Box>
    </Box>
  );
}
