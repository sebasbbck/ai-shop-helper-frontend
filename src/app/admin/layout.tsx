import type { ReactNode } from "react";
import AuthGate from "@/features/auth/components/AuthGate";
import AdminGuard from "@/features/auth/components/AdminGuard";
import AdminShell from "@/features/admin/AdminShell";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGate>
      <AdminGuard>
        <AdminShell>{children}</AdminShell>
      </AdminGuard>
    </AuthGate>
  );
}
