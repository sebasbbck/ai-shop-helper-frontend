"use client";

import { useTranslations } from "next-intl";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

interface ProjectCardProps {
  name: string;
  typeName: string;
  onOpen: () => void;
}

export default function ProjectCard({ name, typeName, onOpen }: ProjectCardProps) {
  const t = useTranslations("Org");
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

      <Button
        variant="text"
        size="small"
        endIcon={<ArrowForwardIcon sx={{ fontSize: 16 }} />}
        onClick={onOpen}
        sx={{ alignSelf: "flex-start", px: 0, minWidth: 0 }}
      >
        {t("openProject")}
      </Button>
    </Box>
  );
}
