"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
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
import Typography from "@mui/material/Typography";
import { useOrgMembersGetOrgMembers } from "@/api/endpoints/org-members/org-members";
import { useActiveContext } from "@/features/shell/ActiveContext";

const ROWS_PER_PAGE_OPTIONS = [25, 50, 100] as const;
const COLUMN_COUNT = 4;
const OWNER_LEVEL = 0;

export default function OrgMembers() {
  const t = useTranslations("OrgAdmin");
  const locale = useLocale();
  const { activeOrgId, activeOrg } = useActiveContext();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(
    ROWS_PER_PAGE_OPTIONS[0],
  );

  const { data, isLoading, isError, isPlaceholderData } =
    useOrgMembersGetOrgMembers(
      activeOrgId ?? "",
      { offset: page * rowsPerPage, limit: rowsPerPage },
      {
        query: {
          enabled: Boolean(activeOrgId),
          placeholderData: (prev) => prev,
        },
      },
    );

  const members = data?.items ?? [];
  const total = data?.total ?? 0;
  const dateFormatter = new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
  });

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4" sx={{ fontWeight: 700, letterSpacing: -0.5 }}>
          {t("heading")}
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
          {activeOrg?.name ?? ""}
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
                <TableCell align="right">{t("columnJoined")}</TableCell>
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
                Array.from({ length: 6 }).map((_, index) => (
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
              ) : members.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={COLUMN_COUNT}
                    sx={{ py: 8, textAlign: "center", color: "text.secondary" }}
                  >
                    {t("empty")}
                  </TableCell>
                </TableRow>
              ) : (
                members.map((member) => (
                  <TableRow key={member.id} hover>
                    <TableCell sx={{ fontWeight: 500 }}>
                      {member.user.name}
                    </TableCell>
                    <TableCell sx={{ color: "text.secondary" }}>
                      <Box
                        component="span"
                        sx={{ fontFamily: "monospace", fontSize: "0.8125rem" }}
                      >
                        {member.user.email}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={member.role.name}
                        size="small"
                        variant="outlined"
                        color={
                          member.role.access_level === OWNER_LEVEL
                            ? "primary"
                            : "default"
                        }
                      />
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{ color: "text.secondary", whiteSpace: "nowrap" }}
                    >
                      {dateFormatter.format(new Date(member.created_at))}
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
