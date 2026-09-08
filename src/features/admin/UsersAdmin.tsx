"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import ContentCopyIcon from "@mui/icons-material/ContentCopyOutlined";
import { useUsersGetUsers } from "@/api/endpoints/users/users";

const ROWS_PER_PAGE_OPTIONS = [25, 50, 100] as const;
const COLUMN_COUNT = 5;

export default function UsersAdmin() {
  const t = useTranslations("Admin");
  const locale = useLocale();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(
    ROWS_PER_PAGE_OPTIONS[0],
  );
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

  const { data, isLoading, isError, isPlaceholderData } = useUsersGetUsers(
    { offset: page * rowsPerPage, limit: rowsPerPage },
    { query: { placeholderData: (prev) => prev } },
  );

  const users = data?.items ?? [];
  const total = data?.total ?? 0;

  const dateFormatter = new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
  });
  const timeFormatter = new Intl.DateTimeFormat(locale, {
    dateStyle: "long",
    timeStyle: "short",
  });

  const copyEmail = async (email: string) => {
    await navigator.clipboard.writeText(email);
    setCopiedEmail(email);
  };

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4" sx={{ fontWeight: 700, letterSpacing: -0.5 }}>
          {t("usersHeading")}
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
          {t("userCount", { count: total })}
        </Typography>
      </Box>

      <Paper variant="outlined" sx={{ borderRadius: 2, overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: "calc(100vh - 280px)" }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow
                sx={{
                  "& th": {
                    bgcolor: "background.paper",
                    color: "text.secondary",
                    fontWeight: 600,
                    borderBottomColor: "divider",
                  },
                }}
              >
                <TableCell>{t("columnName")}</TableCell>
                <TableCell>{t("columnEmail")}</TableCell>
                <TableCell>{t("columnRole")}</TableCell>
                <TableCell>{t("columnStatus")}</TableCell>
                <TableCell align="right">{t("columnCreated")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody
              sx={{
                opacity: isPlaceholderData ? 0.55 : 1,
                transition: "opacity 0.15s ease",
                "& tr:last-of-type td": { border: 0 },
              }}
            >
              {isLoading ? (
                Array.from({ length: 8 }).map((_, index) => (
                  <TableRow key={index}>
                    {Array.from({ length: COLUMN_COUNT }).map((__, cell) => (
                      <TableCell key={cell}>
                        <Skeleton
                          variant="text"
                          width={cell === 0 ? "60%" : "80%"}
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : isError ? (
                <TableRow>
                  <TableCell
                    colSpan={COLUMN_COUNT}
                    sx={{ py: 8, textAlign: "center", color: "error.main" }}
                  >
                    {t("loadError")}
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={COLUMN_COUNT}
                    sx={{ py: 8, textAlign: "center", color: "text.secondary" }}
                  >
                    {t("emptyTitle")}
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id} hover>
                    <TableCell sx={{ fontWeight: 500 }}>{user.name}</TableCell>
                    <TableCell sx={{ color: "text.secondary" }}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                      >
                        <Box
                          component="span"
                          sx={{
                            fontFamily: "monospace",
                            fontSize: "0.8125rem",
                          }}
                        >
                          {user.email}
                        </Box>
                        <Tooltip
                          title={
                            copiedEmail === user.email
                              ? t("copied")
                              : t("copyEmail")
                          }
                        >
                          <IconButton
                            size="small"
                            onClick={() => copyEmail(user.email)}
                            sx={{ opacity: 0.5, "&:hover": { opacity: 1 } }}
                          >
                            <ContentCopyIcon sx={{ fontSize: 15 }} />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={
                          user.is_superuser ? t("roleSuperuser") : t("roleUser")
                        }
                        size="small"
                        variant="outlined"
                        color={user.is_superuser ? "primary" : "default"}
                      />
                    </TableCell>
                    <TableCell>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            bgcolor: user.is_active
                              ? "success.main"
                              : "text.disabled",
                          }}
                        />
                        <Typography variant="body2">
                          {user.is_active
                            ? t("statusActive")
                            : t("statusInactive")}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{ color: "text.secondary", whiteSpace: "nowrap" }}
                    >
                      <Tooltip
                        title={timeFormatter.format(new Date(user.created_at))}
                      >
                        <span>
                          {dateFormatter.format(new Date(user.created_at))}
                        </span>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={total}
          page={page}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[...ROWS_PER_PAGE_OPTIONS]}
          onPageChange={(_, next) => setPage(next)}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(Number(event.target.value));
            setPage(0);
          }}
          labelRowsPerPage={t("rowsPerPage")}
          labelDisplayedRows={({ from, to, count }) =>
            t("rangeLabel", { from, to, count })
          }
          sx={{ borderTop: "1px solid", borderColor: "divider" }}
        />
      </Paper>
    </Stack>
  );
}
