"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import {
  getBillingGetBalanceQueryKey,
  getBillingGetLedgerQueryKey,
  useBillingConfirmCheckout,
} from "@/api/endpoints/billing/billing";
import { useActiveContext } from "@/features/shell/ActiveContext";
import BillingOverview from "./BillingOverview";
import LedgerTable from "./LedgerTable";
import ManageBillingButton from "./ManageBillingButton";
import PlansSection from "./PlansSection";
import TopupCard from "./TopupCard";

type ConfirmState = "idle" | "success" | "pending";

export default function BillingScreen() {
  const t = useTranslations("Billing");
  const router = useRouter();
  const searchParams = useSearchParams();
  const qc = useQueryClient();
  const { activeOrgId } = useActiveContext();
  const [confirmState, setConfirmState] = useState<ConfirmState>("idle");
  const confirmedRef = useRef(false);

  const sessionId = searchParams.get("session_id");
  const isOnboarding = searchParams.get("onboarding") === "1";

  const { mutate: confirmMutate } = useBillingConfirmCheckout({
    mutation: {
      onSuccess: async (_, variables) => {
        const { orgId } = variables;
        await qc.invalidateQueries({
          queryKey: getBillingGetBalanceQueryKey(orgId),
        });
        await qc.invalidateQueries({
          queryKey: getBillingGetLedgerQueryKey(orgId),
        });
        setConfirmState("success");
        router.replace("/billing");
      },
      onError: () => {
        setConfirmState("pending");
        router.replace("/billing");
      },
    },
  });

  useEffect(() => {
    if (!sessionId || !activeOrgId || confirmedRef.current) return;
    confirmedRef.current = true;
    confirmMutate({ orgId: activeOrgId, data: { session_id: sessionId } });
  }, [sessionId, activeOrgId, confirmMutate]);

  if (!activeOrgId) return null;

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", px: 2, py: 4 }}>
      <Typography
        variant="h4"
        sx={{ fontWeight: 700, letterSpacing: -0.5, mb: 5 }}
      >
        {t("heading")}
      </Typography>

      {isOnboarding && (
        <Alert
          severity="info"
          sx={{ mb: 3, alignItems: "center" }}
          action={
            <Button
              color="inherit"
              size="small"
              onClick={() => router.push("/org")}
            >
              {t("onboardingContinue")}
            </Button>
          }
        >
          {t("onboardingBanner")}
        </Alert>
      )}

      {confirmState === "success" && (
        <Alert
          severity="success"
          sx={{ mb: 3 }}
          onClose={() => setConfirmState("idle")}
        >
          {t("confirmSuccess")}
        </Alert>
      )}

      {confirmState === "pending" && (
        <Alert
          severity="info"
          sx={{ mb: 3 }}
          onClose={() => setConfirmState("idle")}
        >
          {t("confirmPending")}
        </Alert>
      )}

      <Box sx={{ display: "flex", flexDirection: "column", gap: 5 }}>
        <BillingOverview orgId={activeOrgId} />
        <PlansSection orgId={activeOrgId} />
        <TopupCard orgId={activeOrgId} />
        <LedgerTable orgId={activeOrgId} />
        <ManageBillingButton orgId={activeOrgId} />
      </Box>
    </Box>
  );
}
