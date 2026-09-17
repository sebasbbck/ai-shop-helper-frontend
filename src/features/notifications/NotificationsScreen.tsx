"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Select from "@mui/material/Select";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import TablePagination from "@mui/material/TablePagination";
import Tooltip from "@mui/material/Tooltip";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Typography from "@mui/material/Typography";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import MarkEmailReadOutlinedIcon from "@mui/icons-material/MarkEmailReadOutlined";
import MarkEmailUnreadOutlinedIcon from "@mui/icons-material/MarkEmailUnreadOutlined";
import {
  getNotificationsGetNotificationsQueryKey,
  getNotificationsGetUnreadCountQueryKey,
  useNotificationsGetNotifications,
  useNotificationsGetUnreadCount,
  useNotificationsMarkAllNotificationsRead,
  useNotificationsMarkNotificationRead,
  useNotificationsMarkNotificationUnread,
} from "@/api/endpoints/notifications/notifications";
import type { NotificationPublic } from "@/api/model/notificationPublic";
import { useActiveContext } from "@/features/shell/ActiveContext";
import { notificationText } from "./notificationText";

const ROWS_PER_PAGE_OPTIONS = [10, 25, 50] as const;
const ALL_ORGS = "all";
type ReadFilter = "all" | "unread";

export default function NotificationsScreen() {
  const t = useTranslations("Notifications");
  const locale = useLocale();
  const queryClient = useQueryClient();
  const { orgs } = useActiveContext();

  const [filter, setFilter] = useState<ReadFilter>("all");
  const [orgId, setOrgId] = useState<string>(ALL_ORGS);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(
    ROWS_PER_PAGE_OPTIONS[0],
  );

  const scopedOrgId = orgId === ALL_ORGS ? undefined : orgId;
  const listParams = {
    unread_only: filter === "unread",
    org_id: scopedOrgId,
    offset: page * rowsPerPage,
    limit: rowsPerPage,
  };

  const { data, isLoading, isError, isPlaceholderData } =
    useNotificationsGetNotifications(listParams, {
      query: { placeholderData: (prev) => prev },
    });

  // Drives the "mark all as read" disabled state — scoped the same way as the
  // list filter so it reflects what's actually left unread in this view.
  const { data: unreadData } = useNotificationsGetUnreadCount({
    org_id: scopedOrgId,
  });

  const invalidateAll = () => {
    // Prefix match (no params) so every cached variant — this screen's own
    // filter/page combos and the bell's — gets refreshed together.
    queryClient.invalidateQueries({
      queryKey: getNotificationsGetNotificationsQueryKey(),
    });
    queryClient.invalidateQueries({
      queryKey: getNotificationsGetUnreadCountQueryKey(),
    });
  };

  const markRead = useNotificationsMarkNotificationRead({
    mutation: { onSuccess: invalidateAll },
  });
  const markUnread = useNotificationsMarkNotificationUnread({
    mutation: { onSuccess: invalidateAll },
  });
  const markAllRead = useNotificationsMarkAllNotificationsRead({
    mutation: { onSuccess: invalidateAll },
  });

  const handleToggleRead = (notification: NotificationPublic) => {
    if (notification.read_at) {
      markUnread.mutate({ notificationId: notification.id });
    } else {
      markRead.mutate({ notificationId: notification.id });
    }
  };

  const notifications = data?.items ?? [];
  const total = data?.total ?? 0;
  const unreadCount = unreadData?.unread_count ?? 0;
  const dateFormatter = new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4" sx={{ fontWeight: 700, letterSpacing: -0.5 }}>
          {t("pageHeading")}
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
          {t("pageSubheading")}
        </Typography>
      </Box>

      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{ alignItems: { sm: "center" }, justifyContent: "space-between" }}
      >
        <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
          <ToggleButtonGroup
            size="small"
            exclusive
            value={filter}
            onChange={(_, next: ReadFilter | null) => {
              if (next) {
                setFilter(next);
                setPage(0);
              }
            }}
          >
            <ToggleButton value="all">{t("filterAll")}</ToggleButton>
            <ToggleButton value="unread">{t("filterUnread")}</ToggleButton>
          </ToggleButtonGroup>

          {orgs.length > 1 && (
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel id="notifications-org-filter-label">
                {t("orgFilterLabel")}
              </InputLabel>
              <Select
                labelId="notifications-org-filter-label"
                label={t("orgFilterLabel")}
                value={orgId}
                onChange={(e) => {
                  setOrgId(e.target.value);
                  setPage(0);
                }}
              >
                <MenuItem value={ALL_ORGS}>{t("orgFilterAll")}</MenuItem>
                {orgs.map((org) => (
                  <MenuItem key={org.id} value={org.id}>
                    {org.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </Stack>

        <Button
          startIcon={<DoneAllIcon />}
          disabled={unreadCount === 0 || markAllRead.isPending}
          onClick={() =>
            markAllRead.mutate({ params: { org_id: scopedOrgId } })
          }
        >
          {t("markAllRead")}
        </Button>
      </Stack>

      <Paper variant="outlined" sx={{ borderRadius: 2, overflow: "hidden" }}>
        {isError && (
          <Box sx={{ p: 3 }}>
            <Alert severity="error">{t("listLoadError")}</Alert>
          </Box>
        )}

        {!isError && isLoading && (
          <Box sx={{ p: 2 }}>
            <Stack spacing={2}>
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} variant="rounded" height={56} />
              ))}
            </Stack>
          </Box>
        )}

        {!isError && !isLoading && notifications.length === 0 && (
          <Box sx={{ py: 8, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              {t("empty")}
            </Typography>
          </Box>
        )}

        {!isError && !isLoading && notifications.length > 0 && (
          <List
            disablePadding
            sx={{
              opacity: isPlaceholderData ? 0.55 : 1,
              transition: "opacity 0.15s ease",
            }}
          >
            {notifications.map((notification, index) => {
              const { title, body } = notificationText(t, notification);
              const isRead = Boolean(notification.read_at);
              return (
                <ListItem
                  key={notification.id}
                  divider={index < notifications.length - 1}
                  sx={{ alignItems: "flex-start", gap: 1.5, py: 1.5 }}
                  secondaryAction={
                    <Tooltip
                      title={isRead ? t("markAsUnread") : t("markAsRead")}
                    >
                      <IconButton
                        edge="end"
                        size="small"
                        aria-label={
                          isRead ? t("markAsUnread") : t("markAsRead")
                        }
                        onClick={() => handleToggleRead(notification)}
                      >
                        {isRead ? (
                          <MarkEmailUnreadOutlinedIcon fontSize="small" />
                        ) : (
                          <MarkEmailReadOutlinedIcon fontSize="small" />
                        )}
                      </IconButton>
                    </Tooltip>
                  }
                >
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      bgcolor: isRead ? "transparent" : "primary.main",
                      mt: 1,
                      flexShrink: 0,
                    }}
                  />
                  <Box sx={{ minWidth: 0, pr: 4 }}>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: isRead ? 400 : 600 }}
                    >
                      {title}
                    </Typography>
                    {body && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ overflowWrap: "break-word" }}
                      >
                        {body}
                      </Typography>
                    )}
                    <Typography variant="caption" color="text.secondary">
                      {dateFormatter.format(new Date(notification.created_at))}
                    </Typography>
                  </Box>
                </ListItem>
              );
            })}
          </List>
        )}

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
