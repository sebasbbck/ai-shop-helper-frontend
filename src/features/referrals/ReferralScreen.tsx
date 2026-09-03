"use client";

import { useTranslations } from "next-intl";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import { useReferralsGetReferralOverview } from "@/api/endpoints/referrals/referrals";
import { useActiveContext } from "@/features/shell/ActiveContext";
import ReferralOverviewCard from "./ReferralOverviewCard";
import ReferralsTable from "./ReferralsTable";

export default function ReferralScreen() {
  const t = useTranslations("Referrals");
  const { activeOrgId } = useActiveContext();
  const { data, isLoading } = useReferralsGetReferralOverview(
    activeOrgId ?? "",
    {
      query: { enabled: !!activeOrgId },
    },
  );

  if (!activeOrgId) return null;

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", px: 2, py: 4 }}>
      <Typography
        variant="h4"
        sx={{ fontWeight: 700, letterSpacing: -0.5, mb: 1 }}
      >
        {t("heading")}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 5 }}>
        {t("subheading")}
      </Typography>

      {isLoading || !data ? (
        <CircularProgress size={24} />
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 5 }}>
          <ReferralOverviewCard overview={data} />
          <ReferralsTable referrals={data.referrals} />
        </Box>
      )}
    </Box>
  );
}
