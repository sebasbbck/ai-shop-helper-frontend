"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";

function ReturnBounce() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations("Billing");

  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    const dest = sessionId ? `/billing?session_id=${sessionId}` : "/billing";
    router.replace(dest);
  }, [sessionId, router]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
      }}
    >
      <CircularProgress size={32} />
      <Typography variant="body1" color="text.secondary">
        {t("finishing")}
      </Typography>
    </Box>
  );
}

const Spinner = (
  <Box
    sx={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <CircularProgress size={32} />
  </Box>
);

export default function BillingReturnPage() {
  return <Suspense fallback={Spinner}><ReturnBounce /></Suspense>;
}
