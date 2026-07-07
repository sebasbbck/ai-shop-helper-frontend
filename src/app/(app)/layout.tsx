import type { ReactNode } from "react";
import AuthGate from "@/features/auth/components/AuthGate";
import AppShell from "@/components/layout/AppShell";
import { ActiveContextProvider } from "@/features/shell/ActiveContext";
import BootstrapGate from "@/features/shell/BootstrapGate";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGate>
      <ActiveContextProvider>
        <BootstrapGate>
          <AppShell>{children}</AppShell>
        </BootstrapGate>
      </ActiveContextProvider>
    </AuthGate>
  );
}
