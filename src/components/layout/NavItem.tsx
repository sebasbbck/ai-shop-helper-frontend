"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Tooltip from "@mui/material/Tooltip";

interface NavItemProps {
  href: string;
  icon: ReactNode;
  label: string;
  active: boolean;
  collapsed: boolean;
  onClick?: () => void;
}

export default function NavItem({
  href,
  icon,
  label,
  active,
  collapsed,
  onClick,
}: NavItemProps) {
  const router = useRouter();

  const button = (
    <ListItemButton
      selected={active}
      onClick={() => {
        router.push(href);
        onClick?.();
      }}
      sx={{
        minHeight: 40,
        px: collapsed ? 0 : 1.5,
        justifyContent: collapsed ? "center" : "flex-start",
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
          mr: collapsed ? 0 : 1.5,
          color: active ? "primary.dark" : "text.secondary",
          "& svg": { fontSize: 20 },
        }}
      >
        {icon}
      </ListItemIcon>
      {!collapsed && (
        <ListItemText
          primary={label}
          slotProps={{ primary: { variant: "body2", sx: { fontWeight: active ? 600 : 400 } } }}
        />
      )}
    </ListItemButton>
  );

  if (collapsed) {
    return (
      <Tooltip title={label} placement="right" arrow>
        {button}
      </Tooltip>
    );
  }

  return button;
}
