"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import FormControlLabel from "@mui/material/FormControlLabel";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import Typography from "@mui/material/Typography";
import {
  getNotificationsGetNotificationPreferencesQueryKey,
  useNotificationsGetNotificationPreferences,
  useNotificationsUpdateNotificationPreference,
} from "@/api/endpoints/notifications/notifications";

export default function NotificationsPreferences() {
  const t = useTranslations("Notifications");
  const queryClient = useQueryClient();

  const { data, isLoading, isError } =
    useNotificationsGetNotificationPreferences();

  const updatePreference = useNotificationsUpdateNotificationPreference({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getNotificationsGetNotificationPreferencesQueryKey(),
        });
      },
    },
  });

  const preferences = data?.preferences ?? {};
  const types = Object.keys(preferences);

  return (
    <Stack spacing={1.5} sx={{ mt: 5 }}>
      <Typography variant="h6" sx={{ fontWeight: 600 }}>
        {t("preferencesHeading")}
      </Typography>

      {isLoading && (
        <Box sx={{ display: "flex", py: 1 }}>
          <CircularProgress size={20} />
        </Box>
      )}

      {isError && <Alert severity="error">{t("loadError")}</Alert>}
      {updatePreference.isError && (
        <Alert severity="error">{t("updateError")}</Alert>
      )}

      {!isLoading &&
        types.map((type) => (
          <FormControlLabel
            key={type}
            control={
              <Switch
                checked={!preferences[type]}
                disabled={updatePreference.isPending}
                onChange={(_, checked) =>
                  updatePreference.mutate({
                    data: { notification_type: type, muted: !checked },
                  })
                }
              />
            }
            label={t(`types.${type}`)}
          />
        ))}
    </Stack>
  );
}
