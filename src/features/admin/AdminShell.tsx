"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import ArrowBackIcon from "@mui/icons-material/ArrowBackOutlined";
import LocaleSwitcher from "@/features/i18n/LocaleSwitcher";
import UserMenu from "@/components/layout/UserMenu";

export default function AdminShell({ children }: { children: ReactNode }) {
  const t = useTranslations("Admin");
  const router = useRouter();

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: "background.paper",
          color: "text.primary",
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Toolbar sx={{ gap: 2, px: { xs: 2, md: 3 } }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              {t("wordmark")}
            </Typography>
            <Chip
              label={t("badge")}
              size="small"
              color="primary"
              variant="outlined"
            />
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          <Button
            size="small"
            color="inherit"
            startIcon={<ArrowBackIcon sx={{ fontSize: 18 }} />}
            onClick={() => router.push("/")}
            sx={{ color: "text.secondary" }}
          >
            {t("backToApp")}
          </Button>
          <LocaleSwitcher />
          <UserMenu />
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 4 } }}>
        {children}
      </Container>
    </Box>
  );
}
