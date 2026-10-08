"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import Box from "@mui/material/Box";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const SIDEBAR_KEY = "sidebar_collapsed";

interface AppShellProps {
  children: ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const [storedCollapsed, setStoredCollapsed] = useLocalStorage(SIDEBAR_KEY);
  const collapsed = storedCollapsed === "true";
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleToggleCollapse = () => {
    setStoredCollapsed(String(!collapsed));
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onToggleCollapse={handleToggleCollapse}
        onMobileClose={() => setMobileOpen(false)}
      />

      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
        }}
      >
        <Topbar onMobileMenuToggle={() => setMobileOpen(true)} />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            bgcolor: "secondary.light",
            p: { xs: 2, md: 3 },
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}
