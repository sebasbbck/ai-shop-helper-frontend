"use client";

import { useLocale, useTranslations } from "next-intl";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import {
  useBillingCreateCheckout,
  useBillingGetCatalog,
} from "@/api/endpoints/billing/billing";

interface PlansSectionProps {
  orgId: string;
}

export default function PlansSection({ orgId }: PlansSectionProps) {
  const t = useTranslations("Billing");
  const locale = useLocale();
  const { data, isLoading } = useBillingGetCatalog();

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

  const formatPrice = (amount: number, currency: string) =>
    new Intl.NumberFormat(locale, { style: "currency", currency }).format(amount / 100);

  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
        {t("plansTitle")}
      </Typography>
      {data.free_credits > 0 && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {t("freeNote", { credits: data.free_credits.toLocaleString() })}
        </Typography>
      )}
      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
        {data.plans.map((plan) => (
          <Card
            key={plan.key}
            variant="outlined"
            sx={{ minWidth: 200, flex: "1 1 200px", maxWidth: 280 }}
          >
            <CardContent>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                {plan.name}
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.25 }}>
                {formatPrice(plan.unit_amount, plan.currency)}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {plan.credits.toLocaleString()} {t("credits")} / {t("perMonth")}
              </Typography>
              <Button
                variant="contained"
                fullWidth
                size="small"
                disabled={checkout.isPending}
                onClick={() => checkout.mutate({ orgId, data: { plan_key: plan.key } })}
              >
                {t("subscribe")}
              </Button>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}
