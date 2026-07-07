"use client";

import { useTranslations } from "next-intl";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import SmartToyOutlinedIcon from "@mui/icons-material/SmartToyOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

interface AgentCardProps {
  name: string;
  description: string | null;
  onOpen: () => void;
}

export default function AgentCard({ name, description, onOpen }: AgentCardProps) {
  const t = useTranslations("Project");
  return (
    <Box
      sx={{
        p: 3,
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 2,
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

      <Button
        variant="text"
        size="small"
        endIcon={<ArrowForwardIcon sx={{ fontSize: 16 }} />}
        onClick={onOpen}
        sx={{ alignSelf: "flex-start", px: 0, minWidth: 0 }}
      >
        {t("openAgent")}
      </Button>
    </Box>
  );
}
