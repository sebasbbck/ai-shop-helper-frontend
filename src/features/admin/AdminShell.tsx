"use client";

import type { ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import LocaleSwitcher from "@/features/i18n/LocaleSwitcher";
import UserMenu from "@/components/layout/UserMenu";

const TABS = [
  { value: "/admin/users", labelKey: "users" },
  { value: "/admin/projects", labelKey: "projects" },
  { value: "/admin/orgs", labelKey: "orgs" },
] as const;

export default function AdminShell({ children }: { children: ReactNode }) {
  const t = useTranslations("Admin");
  const router = useRouter();
  const pathname = usePathname();

  const activeTab = TABS.find((tab) => pathname?.startsWith(tab.value))?.value ?? false;

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{ bgcolor: "background.paper", color: "text.primary", borderBottom: "1px solid", borderColor: "divider" }}
      >
        <Toolbar sx={{ gap: 2, px: { xs: 2, md: 3 } }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            {t("heading")}
          </Typography>

          <Tabs
            value={activeTab}
            onChange={(_, value: string) => router.push(value)}
            sx={{ flexGrow: 1, minHeight: 0 }}
          >
            {TABS.map((tab) => (
              <Tab
                key={tab.value}
                value={tab.value}
                label={t(tab.labelKey)}
                sx={{ minHeight: 48, textTransform: "none", fontWeight: 500 }}
              />
            ))}
          </Tabs>

          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <LocaleSwitcher />
            <UserMenu />
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 4 } }}>
        {children}
      </Container>
    </Box>
  );
}
