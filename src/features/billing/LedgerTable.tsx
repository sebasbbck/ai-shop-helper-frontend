"use client";

import { useLocale, useTranslations } from "next-intl";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { useBillingGetLedger } from "@/api/endpoints/billing/billing";

interface LedgerTableProps {
  orgId: string;
}

type BillingT = ReturnType<typeof useTranslations<"Billing">>;

function reasonLabel(reason: string, t: BillingT): string {
  switch (reason) {
    case "purchase":
      return t("reasonPurchase");
    case "subscription_cycle":
      return t("reasonSubscriptionCycle");
    case "agent_run":
      return t("reasonAgentRun");
    case "signup_bonus":
      return t("reasonSignupBonus");
    case "expiry":
      return t("reasonExpiry");
    case "refund":
      return t("reasonRefund");
    case "adjustment":
      return t("reasonAdjustment");
    case "ideas":
      return t("reasonIdeas");
    case "article":
      return t("reasonArticle");
    case "image":
      return t("reasonImage");
    case "wp_upload":
      return t("reasonWpUpload");
    default:
      return reason;
  }
}

export default function LedgerTable({ orgId }: LedgerTableProps) {
  const t = useTranslations("Billing");
  const locale = useLocale();
  const { data, isLoading } = useBillingGetLedger(orgId, { limit: 20 });

  if (isLoading) {
    return <CircularProgress size={24} />;
  }

  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1.5 }}>
        {t("ledgerTitle")}
      </Typography>
      {!data?.items.length ? (
        <Typography variant="body2" color="text.secondary">
          {t("ledgerEmpty")}
        </Typography>
      ) : (
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: "text.secondary", fontWeight: 500 }}>
                {t("date")}
              </TableCell>
              <TableCell sx={{ color: "text.secondary", fontWeight: 500 }}>
                {t("reason")}
              </TableCell>
              <TableCell sx={{ color: "text.secondary", fontWeight: 500 }}>
                {t("bucket")}
              </TableCell>
              <TableCell sx={{ color: "text.secondary", fontWeight: 500 }} align="right">
                {t("amount")}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.items.map((entry) => {
              const isPositive = entry.amount > 0;
              return (
                <TableRow key={entry.id}>
                  <TableCell>
                    {new Date(entry.created_at).toLocaleDateString(locale)}
                  </TableCell>
                  <TableCell>{reasonLabel(entry.reason, t)}</TableCell>
                  <TableCell sx={{ color: "text.secondary" }}>{entry.bucket}</TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      color: isPositive ? "success.main" : "error.main",
                      fontWeight: 500,
                    }}
                  >
                    {isPositive ? "+" : ""}
                    {entry.amount.toLocaleString()}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </Box>
  );
}
