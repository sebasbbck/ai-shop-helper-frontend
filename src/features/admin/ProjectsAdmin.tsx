"use client";

import { useTranslations } from "next-intl";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ConstructionOutlinedIcon from "@mui/icons-material/ConstructionOutlined";

export default function ProjectsAdmin() {
  const t = useTranslations("Admin");

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, letterSpacing: -0.5, mb: 4 }}>
        {t("projectsHeading")}
      </Typography>

      <Box
        sx={{
          textAlign: "center",
          py: 12,
          px: 4,
          borderRadius: 3,
          bgcolor: "action.hover",
        }}
      >
        <ConstructionOutlinedIcon sx={{ fontSize: 48, color: "text.disabled", mb: 2 }} />
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
          {t("comingSoonHeading")}
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary", maxWidth: 420, mx: "auto" }}>
          {t("projectsComingSoonBody")}
        </Typography>
      </Box>
    </Box>
  );
}
