"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import DownloadIcon from "@mui/icons-material/Download";
import {
  useConnectionsGetWordpressStatus,
  useConnectionsStartWordpressConnection,
} from "@/api/endpoints/connections/connections";

interface Props {
  projectId: string;
}

const schema = z.object({
  site_url: z.string().url(),
});

type FormValues = z.infer<typeof schema>;

export default function WordpressConnectionSection({ projectId }: Props) {
  const t = useTranslations("Connection");
  const tv = useTranslations("Validation");

  const [startError, setStartError] = useState<string | null>(null);

  const { data: statusData, isError: statusError } =
    useConnectionsGetWordpressStatus(projectId);

  const startMutation = useConnectionsStartWordpressConnection({
    mutation: {
      onSuccess: (data) => {
        window.location.href = data.redirect_url;
      },
      onError: () => {
        setStartError(t("startError"));
      },
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      site_url: statusData?.site_url ?? "",
    },
  });

  const onSubmit = (values: FormValues) => {
    setStartError(null);
    startMutation.mutate({
      projectId,
      data: { site_url: values.site_url },
    });
  };

  const isConnected = statusData?.connected === true;

  return (
    <Box sx={{ mt: 5 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {t("wpSection")}
        </Typography>
        {statusData && (
          <Chip
            label={isConnected ? t("connected") : t("notConnected")}
            size="small"
            color={isConnected ? "success" : "default"}
            variant="outlined"
          />
        )}
      </Box>

      {statusError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {t("loadError")}
        </Alert>
      )}

      {isConnected && statusData && (
        <Box sx={{ mb: 2, display: "flex", flexDirection: "column", gap: 0.5 }}>
          <Typography variant="body2" color="text.secondary">
            {t("siteLabel")}: {statusData.site_url}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t("userLabel")}: {statusData.username}
          </Typography>
        </Box>
      )}

      {startError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {startError}
        </Alert>
      )}

      <Box sx={{ mb: 3, maxWidth: 400 }}>
        <Typography variant="body2" sx={{ mb: 1, color: "text.secondary" }}>
          {t("pluginHelp")}
        </Typography>
        <Button
          component="a"
          href="/aishophelper-plugin.zip"
          download
          variant="text"
          size="small"
          startIcon={<DownloadIcon sx={{ fontSize: 18 }} />}
          sx={{ px: 0, minWidth: 0 }}
        >
          {t("downloadPlugin")}
        </Button>
      </Box>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, maxWidth: 400 }}>
          <TextField
            label={t("siteUrlLabel")}
            placeholder={t("siteUrlPlaceholder")}
            fullWidth
            size="small"
            error={Boolean(errors.site_url)}
            helperText={errors.site_url ? tv("required") : undefined}
            {...register("site_url")}
          />

          <Box>
            <Button
              type="submit"
              variant={isConnected ? "outlined" : "contained"}
              disabled={startMutation.isPending}
              size="small"
            >
              {startMutation.isPending
                ? t("connecting")
                : isConnected
                  ? t("reconnectButton")
                  : t("connectButton")}
            </Button>
          </Box>
        </Box>
      </form>
    </Box>
  );
}
