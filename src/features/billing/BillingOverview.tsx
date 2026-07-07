"use client";

import { useTranslations } from "next-intl";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import { useBillingGetBalance } from "@/api/endpoints/billing/billing";

interface BillingOverviewProps {
  orgId: string;
}

export default function BillingOverview({ orgId }: BillingOverviewProps) {
  const t = useTranslations("Billing");
  const { data, isLoading } = useBillingGetBalance(orgId);

  if (isLoading) {
    return <CircularProgress size={24} />;
  }

  if (!data) return null;

  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5, color: "text.secondary" }}>
        {t("balanceTitle")}
      </Typography>
      <Box sx={{ display: "flex", alignItems: "baseline", gap: 1 }}>
        <Typography variant="h3" sx={{ fontWeight: 700, letterSpacing: -1 }}>
          {data.total.toLocaleString()}
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 400, color: "text.secondary" }}>
          {t("credits")}
        </Typography>
      </Box>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
        {t("subscriptionCredits")}: {data.subscription_credits.toLocaleString()} ·{" "}
        {t("purchasedCredits")}: {data.purchased_credits.toLocaleString()}
      </Typography>
    </Box>
  );
}
