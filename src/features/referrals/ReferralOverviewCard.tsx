"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import type { ReferralOverview } from "@/api/model";

interface ReferralOverviewCardProps {
  overview: ReferralOverview;
}

const COPIED_RESET_MS = 2000;

export default function ReferralOverviewCard({
  overview,
}: ReferralOverviewCardProps) {
  const t = useTranslations("Referrals");
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(overview.share_url);
    setCopied(true);
    setTimeout(() => setCopied(false), COPIED_RESET_MS);
  };

  return (
    <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
        {t("rewardTitle")}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
        {t("rewardDescription", {
          referrer: overview.reward.referrer_credits,
          referee: overview.reward.referee_credits,
        })}
      </Typography>

      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        <TextField
          value={overview.share_url}
          size="small"
          fullWidth
          slotProps={{ htmlInput: { readOnly: true } }}
          onFocus={(e) => e.target.select()}
        />
        <Button
          variant="contained"
          onClick={handleCopy}
          startIcon={<ContentCopyOutlinedIcon />}
          sx={{ flexShrink: 0, whiteSpace: "nowrap" }}
        >
          {copied ? t("copied") : t("copy")}
        </Button>
      </Box>

      <Typography variant="body2" color="text.secondary" sx={{ mt: 2.5 }}>
        {t("monthlyProgress", {
          count: overview.rewarded_this_month,
          cap: overview.reward.monthly_cap,
        })}
      </Typography>
    </Paper>
  );
}
