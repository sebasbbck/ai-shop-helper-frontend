"use client";

import { useTranslations } from "next-intl";
import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

interface ProjectCardProps {
  name: string;
  typeName: string;
  onOpen: () => void;
}

export default function ProjectCard({
  name,
  typeName,
  onOpen,
}: ProjectCardProps) {
  const t = useTranslations("Org");
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
      <Box sx={{ flex: 1 }}>
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: 600, lineHeight: 1.3, mb: 1 }}
        >
          {name}
        </Typography>
        <Chip
          label={typeName}
          size="small"
          variant="outlined"
          sx={{ fontSize: "0.7rem", height: 22 }}
        />
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
        {t("openProject")}
        <ArrowForwardIcon sx={{ fontSize: 16 }} />
      </Box>
    </ButtonBase>
  );
}
