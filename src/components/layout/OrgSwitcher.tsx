"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import AddIcon from "@mui/icons-material/Add";
import BusinessIcon from "@mui/icons-material/Business";
import CheckIcon from "@mui/icons-material/Check";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import CardGiftcardOutlinedIcon from "@mui/icons-material/CardGiftcardOutlined";
import SettingsIcon from "@mui/icons-material/Settings";
import { useActiveContext } from "@/features/shell/ActiveContext";
import CreateOrgDialog from "./CreateOrgDialog";

function initials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0] ?? "")
    .join("")
    .toUpperCase();
}

interface OrgSwitcherProps {
  collapsed: boolean;
}

export default function OrgSwitcher({ collapsed }: OrgSwitcherProps) {
  const t = useTranslations("Shell");
  const router = useRouter();
  const pathname = usePathname();
  const { orgs, activeOrg, activeOrgId, setActiveOrg } = useActiveContext();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [sectionOpen, setSectionOpen] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const handleSelectOrg = (id: string) => {
    setActiveOrg(id);
    router.push("/org");
    setAnchorEl(null);
  };

  const orgInitials = activeOrg ? initials(activeOrg.name) : "?";
  const settingsActive = pathname === "/org/settings";
  const billingActive = pathname === "/billing";
  const referralsActive = pathname === "/referrals";

  const switcherMenu = (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={() => setAnchorEl(null)}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      transformOrigin={{ vertical: "top", horizontal: "left" }}
      slotProps={{ paper: { sx: { minWidth: 220 } } }}
    >
      {orgs.map((org) => (
        <MenuItem key={org.id} onClick={() => handleSelectOrg(org.id)}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              width: "100%",
            }}
          >
            <Avatar
              sx={{
                width: 22,
                height: 22,
                bgcolor: "primary.lighter",
                color: "primary.dark",
                fontSize: 9,
                fontWeight: 700,
              }}
            >
              {initials(org.name)}
            </Avatar>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {org.name}
            </Typography>
            {org.id === activeOrgId && (
              <CheckIcon sx={{ fontSize: 15, color: "primary.main" }} />
            )}
          </Box>
        </MenuItem>
      ))}
      <MenuItem
        onClick={() => {
          setAnchorEl(null);
          setCreateDialogOpen(true);
        }}
      >
        <AddIcon sx={{ mr: 1.5, fontSize: 17, color: "text.secondary" }} />
        <Typography variant="body2">{t("newOrg")}</Typography>
      </MenuItem>
    </Menu>
  );

  if (collapsed) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", py: 0.5 }}>
        <Tooltip title={t("switchOrg")} placement="right" arrow>
          <ListItemButton
            onClick={(e) => setAnchorEl(e.currentTarget)}
            sx={{
              minHeight: 40,
              px: 0,
              justifyContent: "center",
              mx: 0.5,
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                color: "text.secondary",
                "& svg": { fontSize: 20 },
              }}
            >
              <BusinessIcon />
            </ListItemIcon>
          </ListItemButton>
        </Tooltip>
        <Tooltip title={t("settings")} placement="right" arrow>
          <ListItemButton
            selected={settingsActive}
            onClick={() => router.push("/org/settings")}
            sx={{
              minHeight: 40,
              px: 0,
              justifyContent: "center",
              mx: 0.5,
              "&.Mui-selected": {
                bgcolor: "primary.lighter",
                "& .MuiListItemIcon-root": { color: "primary.dark" },
                "&:hover": { bgcolor: "primary.lighter" },
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                color: settingsActive ? "primary.dark" : "text.secondary",
                "& svg": { fontSize: 20 },
              }}
            >
              <SettingsIcon />
            </ListItemIcon>
          </ListItemButton>
        </Tooltip>
        <Tooltip title={t("billing")} placement="right" arrow>
          <ListItemButton
            selected={billingActive}
            onClick={() => router.push("/billing")}
            sx={{
              minHeight: 40,
              px: 0,
              justifyContent: "center",
              mx: 0.5,
              "&.Mui-selected": {
                bgcolor: "primary.lighter",
                "& .MuiListItemIcon-root": { color: "primary.dark" },
                "&:hover": { bgcolor: "primary.lighter" },
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                color: billingActive ? "primary.dark" : "text.secondary",
                "& svg": { fontSize: 20 },
              }}
            >
              <AccountBalanceWalletOutlinedIcon />
            </ListItemIcon>
          </ListItemButton>
        </Tooltip>
        <Tooltip title={t("referrals")} placement="right" arrow>
          <ListItemButton
            selected={referralsActive}
            onClick={() => router.push("/referrals")}
            sx={{
              minHeight: 40,
              px: 0,
              justifyContent: "center",
              mx: 0.5,
              "&.Mui-selected": {
                bgcolor: "primary.lighter",
                "& .MuiListItemIcon-root": { color: "primary.dark" },
                "&:hover": { bgcolor: "primary.lighter" },
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                color: referralsActive ? "primary.dark" : "text.secondary",
                "& svg": { fontSize: 20 },
              }}
            >
              <CardGiftcardOutlinedIcon />
            </ListItemIcon>
          </ListItemButton>
        </Tooltip>
        {switcherMenu}
        <CreateOrgDialog
          open={createDialogOpen}
          onClose={() => setCreateDialogOpen(false)}
        />
      </Box>
    );
  }

  return (
    <Box sx={{ px: 2, pt: 1.5, pb: 0.5 }}>
      <Typography
        variant="caption"
        color="text.disabled"
        sx={{ display: "block", mb: 0.5, fontWeight: 500, userSelect: "none" }}
      >
        {t("orgSection")}
      </Typography>

      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 0.25 }}>
        <Tooltip title={t("switchOrg")} placement="right">
          <IconButton
            size="small"
            onClick={(e) => setAnchorEl(e.currentTarget)}
            sx={{ p: 0.5, flexShrink: 0 }}
          >
            <Avatar
              sx={{
                width: 26,
                height: 26,
                bgcolor: "primary.lighter",
                color: "primary.dark",
                fontSize: 10,
                fontWeight: 700,
              }}
            >
              {orgInitials}
            </Avatar>
          </IconButton>
        </Tooltip>

        <Typography
          variant="body2"
          noWrap
          onClick={() => activeOrg && router.push("/org")}
          sx={{
            flexGrow: 1,
            fontWeight: 600,
            cursor: activeOrg ? "pointer" : "default",
            color: "text.primary",
            "&:hover": activeOrg ? { color: "primary.main" } : {},
            transition: "color 0.15s",
          }}
        >
          {activeOrg?.name ?? t("noOrgs")}
        </Typography>

        <IconButton
          size="small"
          onClick={() => setSectionOpen((prev) => !prev)}
          sx={{ color: "text.disabled", flexShrink: 0 }}
        >
          {sectionOpen ? (
            <ExpandLessIcon sx={{ fontSize: 16 }} />
          ) : (
            <ExpandMoreIcon sx={{ fontSize: 16 }} />
          )}
        </IconButton>
      </Box>

      <Collapse in={sectionOpen} unmountOnExit>
        <List dense disablePadding sx={{ pl: 1, pt: 0.25, pb: 0.5 }}>
          <ListItemButton
            selected={settingsActive}
            onClick={() => router.push("/org/settings")}
            sx={{
              minHeight: 36,
              borderRadius: 1,
              px: 1.5,
              mx: 0.5,
              "&.Mui-selected": {
                bgcolor: "primary.lighter",
                color: "primary.dark",
                "& .MuiListItemIcon-root": { color: "primary.dark" },
                "&:hover": { bgcolor: "primary.lighter" },
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: 1.5,
                color: settingsActive ? "primary.dark" : "text.secondary",
                "& svg": { fontSize: 20 },
              }}
            >
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText
              primary={t("settings")}
              slotProps={{
                primary: {
                  variant: "body2",
                  sx: { fontWeight: settingsActive ? 600 : 400 },
                },
              }}
            />
          </ListItemButton>
          <ListItemButton
            selected={billingActive}
            onClick={() => router.push("/billing")}
            sx={{
              minHeight: 36,
              borderRadius: 1,
              px: 1.5,
              mx: 0.5,
              "&.Mui-selected": {
                bgcolor: "primary.lighter",
                color: "primary.dark",
                "& .MuiListItemIcon-root": { color: "primary.dark" },
                "&:hover": { bgcolor: "primary.lighter" },
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: 1.5,
                color: billingActive ? "primary.dark" : "text.secondary",
                "& svg": { fontSize: 20 },
              }}
            >
              <AccountBalanceWalletOutlinedIcon />
            </ListItemIcon>
            <ListItemText
              primary={t("billing")}
              slotProps={{
                primary: {
                  variant: "body2",
                  sx: { fontWeight: billingActive ? 600 : 400 },
                },
              }}
            />
          </ListItemButton>
          <ListItemButton
            selected={referralsActive}
            onClick={() => router.push("/referrals")}
            sx={{
              minHeight: 36,
              borderRadius: 1,
              px: 1.5,
              mx: 0.5,
              "&.Mui-selected": {
                bgcolor: "primary.lighter",
                color: "primary.dark",
                "& .MuiListItemIcon-root": { color: "primary.dark" },
                "&:hover": { bgcolor: "primary.lighter" },
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: 1.5,
                color: referralsActive ? "primary.dark" : "text.secondary",
                "& svg": { fontSize: 20 },
              }}
            >
              <CardGiftcardOutlinedIcon />
            </ListItemIcon>
            <ListItemText
              primary={t("referrals")}
              slotProps={{
                primary: {
                  variant: "body2",
                  sx: { fontWeight: referralsActive ? 600 : 400 },
                },
              }}
            />
          </ListItemButton>
        </List>
      </Collapse>

      {switcherMenu}
      <CreateOrgDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
      />
    </Box>
  );
}
