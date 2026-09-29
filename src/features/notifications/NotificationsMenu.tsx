"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import NotificationsIcon from "@mui/icons-material/Notifications";
import {
  getNotificationsGetNotificationsQueryKey,
  getNotificationsGetUnreadCountQueryKey,
  useNotificationsGetNotifications,
  useNotificationsGetUnreadCount,
  useNotificationsMarkNotificationRead,
} from "@/api/endpoints/notifications/notifications";
import type { NotificationPublic } from "@/api/model/notificationPublic";
import { notificationText } from "./notificationText";

const UNREAD_COUNT_POLL_MS = 20000;
// Bell only ever shows the most recent unread — the dedicated /notifications
// view is where everything else (read history, filters, pagination) lives.
const RECENT_PARAMS = { limit: 5, unread_only: true };

export default function NotificationsMenu() {
  const t = useTranslations("Notifications");
  const locale = useLocale();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  // No org_id — the bell's badge stays a global count across all orgs.
  const { data: unreadData } = useNotificationsGetUnreadCount(undefined, {
    query: { refetchInterval: UNREAD_COUNT_POLL_MS },
  });

  const { data: listData, isLoading } = useNotificationsGetNotifications(
    RECENT_PARAMS,
    { query: { enabled: open } },
  );

  const markRead = useNotificationsMarkNotificationRead({
    mutation: {
      onSuccess: () => {
        // Prefix match (no params) so this also refreshes the dedicated
        // /notifications view's cached queries, not just the bell's own.
        queryClient.invalidateQueries({
          queryKey: getNotificationsGetNotificationsQueryKey(),
        });
        queryClient.invalidateQueries({
          queryKey: getNotificationsGetUnreadCountQueryKey(),
        });
      },
    },
  });

  const handleItemClick = (notification: NotificationPublic) => {
    markRead.mutate({ notificationId: notification.id });
  };

  const unreadCount = unreadData?.unread_count ?? 0;
  const notifications = listData?.items ?? [];

  return (
    <>
      <IconButton
        size="small"
        onClick={(e) => setAnchorEl(e.currentTarget)}
        aria-label={t("ariaLabel")}
        sx={{ color: "text.secondary" }}
      >
        <Badge badgeContent={unreadCount} color="error" max={99}>
          <NotificationsIcon fontSize="small" />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{ paper: { sx: { width: 360, maxHeight: 440 } } }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            {t("heading")}
          </Typography>
        </Box>
        <Divider />

        {isLoading && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
            <CircularProgress size={20} />
          </Box>
        )}

        {!isLoading && notifications.length === 0 && (
          <Box sx={{ px: 2, py: 3 }}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ textAlign: "center" }}
            >
              {t("empty")}
            </Typography>
          </Box>
        )}

        {notifications.map((notification) => {
          // Every item here is unread by construction (RECENT_PARAMS filters
          // unread_only) — title only, no body, see proposal sent to Enrique.
          const { title } = notificationText(t, notification);
          return (
            <MenuItem
              key={notification.id}
              onClick={() => handleItemClick(notification)}
              sx={{
                whiteSpace: "normal",
                alignItems: "flex-start",
                gap: 1,
                py: 1.25,
                bgcolor: "action.hover",
              }}
            >
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  bgcolor: "primary.main",
                  mt: 0.75,
                  flexShrink: 0,
                }}
              />
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {title}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {new Date(notification.created_at).toLocaleString(locale, {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </Typography>
              </Box>
            </MenuItem>
          );
        })}

        <Divider />
        <MenuItem
          onClick={() => {
            router.push("/notifications");
            setAnchorEl(null);
          }}
        >
          <Typography variant="body2" color="text.secondary">
            {t("viewAll")}
          </Typography>
        </MenuItem>
      </Menu>
    </>
  );
}
