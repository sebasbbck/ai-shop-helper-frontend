"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { useActiveOrgRole } from "./useActiveOrgRole";

export default function OrgAdminGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { isOrgAdmin, isLoading } = useActiveOrgRole();

  useEffect(() => {
    if (!isLoading && !isOrgAdmin) {
      router.replace("/org");
    }
  }, [isLoading, isOrgAdmin, router]);

  if (isLoading || !isOrgAdmin) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return <>{children}</>;
}
