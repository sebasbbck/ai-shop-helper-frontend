"use client";

import { useTranslations } from "next-intl";
import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import Typography from "@mui/material/Typography";
import SmartToyOutlinedIcon from "@mui/icons-material/SmartToyOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

interface AgentCardProps {
  name: string;
  description: string | null;
  onOpen: () => void;
}

export default function AgentCard({
  name,
  description,
  onOpen,
}: AgentCardProps) {
  const t = useTranslations("Project");
  return (
    <ButtonBase
      onClick={onOpen}
      focusRipple
      sx={{
        p: 3,
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        alignSelf: "center",
        justifyContent: "center",
        gap: 2,
        textAlign: "center",
        transition: "box-shadow 200ms ease, border-color 200ms ease",
        "&:hover": {
          boxShadow: "0 4px 16px 0 rgba(0,0,0,.08)",
          borderColor: "primary.light",
        },
      }}
    >
      <Box
        sx={{
          width: 36,
          height: 36,
          borderRadius: 2,
          bgcolor: "primary.lighter",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <SmartToyOutlinedIcon sx={{ fontSize: 20, color: "primary.dark" }} />
      </Box>

      <Box sx={{ flex: 1 }}>
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: 600, lineHeight: 1.3, mb: description ? 0.75 : 0 }}
        >
          {name}
        </Typography>
        {description && (
          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {description}
          </Typography>
        )}
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.5,
          color: "primary.main",
          fontSize: "0.8125rem",
          fontWeight: 500,
        }}
      >
        {t("openAgent")}
        <ArrowForwardIcon sx={{ fontSize: 16 }} />
      </Box>
    </ButtonBase>
  );
}
