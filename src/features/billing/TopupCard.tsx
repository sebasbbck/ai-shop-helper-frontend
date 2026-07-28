"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import {
  useBillingCreateCheckout,
  useBillingGetCatalog,
} from "@/api/endpoints/billing/billing";

interface TopupCardProps {
  orgId: string;
}

export default function TopupCard({ orgId }: TopupCardProps) {
  const t = useTranslations("Billing");
  const { data, isLoading } = useBillingGetCatalog();
  const [euros, setEuros] = useState<string>("");

  const checkout = useBillingCreateCheckout({
    mutation: {
      onSuccess: (res) => {
        window.location.href = res.url;
      },
    },
  });

  if (isLoading) {
    return <CircularProgress size={24} />;
  }

  if (!data) return null;

  const { topup } = data;
  const minEuros = topup.min_amount / 100;
  const maxEuros = topup.max_amount / 100;
  const parsedEuros = parseFloat(euros);
  const creditsPreview =
    euros && !isNaN(parsedEuros)
      ? Math.floor(parsedEuros * (100 / topup.cents_per_credit))
      : 0;

  return (
    <Box sx={{ maxWidth: 320 }}>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
        {t("topupTitle")}
      </Typography>
      <TextField
        label={`€ (${minEuros}–${maxEuros})`}
        type="number"
        size="small"
        value={euros}
        onChange={(e) => setEuros(e.target.value)}
        slotProps={{ htmlInput: { min: minEuros, max: maxEuros, step: 1 } }}
        fullWidth
        helperText={
          creditsPreview > 0
            ? t("topupHelper", { credits: creditsPreview.toLocaleString() })
            : undefined
        }
        sx={{ mb: 2 }}
      />
      <Button
        variant="outlined"
        size="small"
        disabled={checkout.isPending || !euros}
        onClick={() => checkout.mutate({ orgId, data: { plan_key: "topup" } })}
      >
        {t("buyCredits")}
      </Button>
    </Box>
  );
}
