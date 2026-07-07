"use client";

import type { ReactNode } from "react";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { useActiveContext } from "@/features/shell/ActiveContext";
import BootstrapWizard from "@/features/shell/BootstrapWizard";

interface BootstrapGateProps {
  children: ReactNode;
}

export default function BootstrapGate({ children }: BootstrapGateProps) {
  const { isLoading, isEmpty } = useActiveContext();

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isEmpty) {
    return <BootstrapWizard />;
  }

  return <>{children}</>;
}
