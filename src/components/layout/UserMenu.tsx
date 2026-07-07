"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import SettingsIcon from "@mui/icons-material/Settings";
import { useAuthLogout } from "@/api/endpoints/auth/auth";
import { useUsersGetMe } from "@/api/endpoints/users/users";
import { setAccessToken } from "@/lib/api/token-store";

export default function UserMenu() {
  const t = useTranslations("Shell");
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const { data: user } = useUsersGetMe({ query: { retry: false } });

  const logout = useAuthLogout({
    mutation: {
      onSuccess: () => {
        setAccessToken(null);
        router.replace("/login");
      },
    },
  });

  const displayName = user?.name ?? user?.email ?? "";
  const showEmail = user?.name && user.email !== user.name;

  return (
    <>
      <IconButton
        size="small"
        onClick={(e) => setAnchorEl(e.currentTarget)}
        sx={{ p: 0.5 }}
        aria-label="User menu"
      >
        <Avatar
          sx={{
            width: 32,
            height: 32,
            bgcolor: "primary.lighter",
            color: "primary.dark",
          }}
        >
          <AccountCircleIcon sx={{ fontSize: 22 }} />
        </Avatar>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{ paper: { sx: { minWidth: 200 } } }}
      >
        <ListItem
          sx={{
            flexDirection: "column",
            alignItems: "flex-start",
            pt: 2,
            pb: 1,
            gap: 0.25,
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {displayName}
          </Typography>
          {showEmail && (
            <Typography variant="caption" color="text.secondary">
              {user?.email}
            </Typography>
          )}
        </ListItem>

        <MenuItem
          onClick={() => {
            router.push("/settings");
            setAnchorEl(null);
          }}
        >
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          <Typography variant="body2">{t("settingsItem")}</Typography>
        </MenuItem>

        <MenuItem
          onClick={() => {
            logout.mutate();
            setAnchorEl(null);
          }}
          disabled={logout.isPending}
        >
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <Typography variant="body2">{t("logout")}</Typography>
        </MenuItem>
      </Menu>
    </>
  );
}
