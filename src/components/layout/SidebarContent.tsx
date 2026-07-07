"use client";

import Image from "next/image";
import Box from "@mui/material/Box";
import OrgSwitcher from "./OrgSwitcher";
import ProjectSwitcher from "./ProjectSwitcher";

interface SidebarContentProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export default function SidebarContent({
  collapsed,
  onToggleCollapse,
}: SidebarContentProps) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflowX: "hidden",
        overflowY: "auto",
      }}
    >
      <Box
        onClick={onToggleCollapse}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "flex-start",
          px: collapsed ? 1 : 2.5,
          minHeight: 72,
          flexShrink: 0,
          cursor: "pointer",
          transition: "opacity 0.15s",
          "&:hover": { opacity: 0.75 },
        }}
      >
        {collapsed ? (
          <Image
            src="/ai-shop-helper-logo-recortado.webp"
            alt="AI Shop Helper"
            width={578}
            height={334}
            priority
            style={{ height: 28, width: "auto" }}
          />
        ) : (
          <Image
            src="/ai-shop-helper-logo.webp"
            alt="AI Shop Helper"
            width={1051}
            height={334}
            priority
            style={{ height: 30, width: "auto" }}
          />
        )}
      </Box>

      <OrgSwitcher collapsed={collapsed} />

      <ProjectSwitcher collapsed={collapsed} />

      <Box sx={{ flexGrow: 1 }} />
    </Box>
  );
}
