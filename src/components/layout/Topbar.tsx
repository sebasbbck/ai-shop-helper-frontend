"use client";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import MenuIcon from "@mui/icons-material/Menu";
import LocaleSwitcher from "@/features/i18n/LocaleSwitcher";
import NotificationsMenu from "@/features/notifications/NotificationsMenu";
import UserMenu from "./UserMenu";

interface TopbarProps {
  onMobileMenuToggle: () => void;
}

export default function Topbar({ onMobileMenuToggle }: TopbarProps) {
  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: "#D6E2FC",
        color: "text.primary",
      }}
    >
      <Toolbar
        variant="dense"
        sx={{ gap: 1, minHeight: 56, px: { xs: 1.5, md: 3 } }}
      >
        <IconButton
          onClick={onMobileMenuToggle}
          size="small"
          sx={{ display: { md: "none" }, color: "text.secondary" }}
        >
          <MenuIcon />
        </IconButton>

        <Box sx={{ flexGrow: 1 }} />

        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <LocaleSwitcher />
          <NotificationsMenu />
          <UserMenu />
        </Box>
      </Toolbar>
    </AppBar>
  );
}
