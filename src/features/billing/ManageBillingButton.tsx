"use client";

import { useTranslations } from "next-intl";
import Button from "@mui/material/Button";
import { useBillingCreatePortal } from "@/api/endpoints/billing/billing";

interface ManageBillingButtonProps {
  orgId: string;
}

export default function ManageBillingButton({ orgId }: ManageBillingButtonProps) {
  const t = useTranslations("Billing");

  const portal = useBillingCreatePortal({
    mutation: {
      onSuccess: (res) => {
        window.location.href = res.url;
      },
    },
  });

  return (
    <Button
      variant="text"
      size="small"
      disabled={portal.isPending}
      onClick={() => portal.mutate({ orgId })}
      sx={{ color: "text.secondary", alignSelf: "flex-start" }}
    >
      {t("manageBilling")}
    </Button>
  );
}
