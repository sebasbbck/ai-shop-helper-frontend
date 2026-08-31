"use client";

import { useLocale, useTranslations } from "next-intl";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import type { ReferralPublic } from "@/api/model";

interface ReferralsTableProps {
  referrals: ReferralPublic[];
}

type ChipColor = "default" | "success" | "warning";

const STATUS_COLOR: Record<string, ChipColor> = {
  pending: "warning",
  rewarded: "success",
  capped: "default",
};

type ReferralsT = ReturnType<typeof useTranslations<"Referrals">>;

function statusLabel(status: string, t: ReferralsT): string {
  switch (status) {
    case "pending":
      return t("statusPending");
    case "rewarded":
      return t("statusRewarded");
    case "capped":
      return t("statusCapped");
    default:
      return status;
  }
}

export default function ReferralsTable({ referrals }: ReferralsTableProps) {
  const t = useTranslations("Referrals");
  const locale = useLocale();

  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1.5 }}>
        {t("tableTitle")}
      </Typography>
      {!referrals.length ? (
        <Typography variant="body2" color="text.secondary">
          {t("tableEmpty")}
        </Typography>
      ) : (
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: "text.secondary", fontWeight: 500 }}>
                {t("colDate")}
              </TableCell>
              <TableCell sx={{ color: "text.secondary", fontWeight: 500 }}>
                {t("colStatus")}
              </TableCell>
              <TableCell
                sx={{ color: "text.secondary", fontWeight: 500 }}
                align="right"
              >
                {t("colReward")}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {referrals.map((referral) => (
              <TableRow key={referral.id}>
                <TableCell>
                  {new Date(referral.created_at).toLocaleDateString(locale)}
                </TableCell>
                <TableCell>
                  <Chip
                    size="small"
                    variant="outlined"
                    label={statusLabel(referral.status, t)}
                    color={STATUS_COLOR[referral.status] ?? "default"}
                  />
                </TableCell>
                <TableCell align="right">
                  {referral.status === "rewarded" && referral.referrer_credits
                    ? `+${referral.referrer_credits.toLocaleString()}`
                    : "—"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Box>
  );
}
