"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import GoogleIcon from "@mui/icons-material/Google";
import {
  useConnectionsGetGoogleConnectionStatus,
  connectionsStartGoogleConnection,
} from "@/api/endpoints/connections/connections";

interface Props {
  projectId: string;
}

export default function GoogleConnectionSection({ projectId }: Props) {
  const t = useTranslations("Connection");

  const [starting, setStarting] = useState(false);
  const [startError, setStartError] = useState<string | null>(null);

  const { data: statusData, isError: statusError } =
    useConnectionsGetGoogleConnectionStatus(projectId);

  const isConnected = statusData?.connected === true;

  const handleConnect = async () => {
    setStartError(null);
    setStarting(true);
    try {
      const { auth_url } = await connectionsStartGoogleConnection(projectId);
      window.location.href = auth_url;
    } catch {
      setStartError(t("googleStartError"));
      setStarting(false);
    }
  };

  return (
    <Box sx={{ mt: 5 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {t("googleSection")}
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

      {isConnected && statusData?.google_email && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            {t("emailLabel")}: {statusData.google_email}
          </Typography>
        </Box>
      )}

      {startError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {startError}
        </Alert>
      )}

      <Typography
        variant="body2"
        sx={{ mb: 2, color: "text.secondary", maxWidth: 400 }}
      >
        {t("googleHelp")}
      </Typography>

      <Button
        variant={isConnected ? "outlined" : "contained"}
        size="small"
        startIcon={<GoogleIcon sx={{ fontSize: 18 }} />}
        disabled={starting}
        onClick={handleConnect}
      >
        {starting
          ? t("connecting")
          : isConnected
            ? t("reconnectGoogleButton")
            : t("connectGoogleButton")}
      </Button>
    </Box>
  );
}
