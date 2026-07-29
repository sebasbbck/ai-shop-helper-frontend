"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useUsersGetUsers } from "@/api/endpoints/users/users";

const PAGE_SIZE = 20;

export default function UsersAdmin() {
  const t = useTranslations("Admin");
  const locale = useLocale();
  const [offset, setOffset] = useState(0);

  const { data, isLoading, isPlaceholderData } = useUsersGetUsers(
    { offset, limit: PAGE_SIZE },
    { query: { placeholderData: (prev) => prev } },
  );

  const users = data?.items ?? [];
  const total = data?.total ?? 0;
  const hasPrev = offset > 0;
  const hasNext = offset + PAGE_SIZE < total;

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, letterSpacing: -0.5 }}>
          {t("usersHeading")}
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
          {t("userCount", { count: total })}
        </Typography>
      </Box>

      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress size={24} />
        </Box>
      ) : users.length === 0 ? (
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {t("noUsers")}
        </Typography>
      ) : (
        <Box sx={{ opacity: isPlaceholderData ? 0.6 : 1, transition: "opacity 0.15s" }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: "text.secondary", fontWeight: 500 }}>
                  {t("columnName")}
                </TableCell>
                <TableCell sx={{ color: "text.secondary", fontWeight: 500 }}>
                  {t("columnEmail")}
                </TableCell>
                <TableCell sx={{ color: "text.secondary", fontWeight: 500 }}>
                  {t("columnRole")}
                </TableCell>
                <TableCell sx={{ color: "text.secondary", fontWeight: 500 }}>
                  {t("columnStatus")}
                </TableCell>
                <TableCell sx={{ color: "text.secondary", fontWeight: 500 }}>
                  {t("columnCreated")}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell sx={{ fontWeight: 500 }}>{user.name}</TableCell>
                  <TableCell sx={{ color: "text.secondary" }}>{user.email}</TableCell>
                  <TableCell>
                    {user.is_superuser ? (
                      <Chip label={t("roleSuperuser")} size="small" color="primary" variant="outlined" />
                    ) : (
                      <Chip label={t("roleUser")} size="small" variant="outlined" />
                    )}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={user.is_active ? t("statusActive") : t("statusInactive")}
                      size="small"
                      color={user.is_active ? "success" : "default"}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell sx={{ color: "text.secondary" }}>
                    {new Date(user.created_at).toLocaleDateString(locale)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 1, mt: 2 }}>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {t("pageRange", {
                from: offset + 1,
                to: Math.min(offset + PAGE_SIZE, total),
                total,
              })}
            </Typography>
            <IconButton
              size="small"
              disabled={!hasPrev}
              onClick={() => setOffset((prev) => Math.max(0, prev - PAGE_SIZE))}
            >
              <ChevronLeftIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              disabled={!hasNext}
              onClick={() => setOffset((prev) => prev + PAGE_SIZE)}
            >
              <ChevronRightIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      )}
    </Box>
  );
}
