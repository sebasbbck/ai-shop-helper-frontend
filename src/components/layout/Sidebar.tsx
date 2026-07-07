"use client";

import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import SidebarContent from "./SidebarContent";
import { SIDEBAR_MINI, SIDEBAR_WIDTH } from "./shell-constants";

interface SidebarProps {
  collapsed: boolean;
  mobileOpen: boolean;
  onToggleCollapse: () => void;
  onMobileClose: () => void;
}

export default function Sidebar({
  collapsed,
  mobileOpen,
  onToggleCollapse,
  onMobileClose,
}: SidebarProps) {
  const drawerWidth = collapsed ? SIDEBAR_MINI : SIDEBAR_WIDTH;

  return (
    <>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            width: SIDEBAR_WIDTH,
            boxSizing: "border-box",
            borderRight: "1px solid",
            borderColor: "divider",
          },
        }}
      >
        <SidebarContent collapsed={false} onToggleCollapse={onToggleCollapse} />
      </Drawer>

      <Box
        sx={{
          display: { xs: "none", md: "block" },
          width: drawerWidth,
          flexShrink: 0,
          transition: "width 0.2s ease",
        }}
      >
        <Drawer
          variant="permanent"
          open
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
              transition: "width 0.2s ease",
              overflowX: "hidden",
              borderRight: "1px solid",
              borderColor: "divider",
            },
          }}
        >
          <SidebarContent collapsed={collapsed} onToggleCollapse={onToggleCollapse} />
        </Drawer>
      </Box>
    </>
  );
}
