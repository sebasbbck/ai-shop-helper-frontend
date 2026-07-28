"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { useUsersGetMe } from "@/api/endpoints/users/users";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data: user, isLoading } = useUsersGetMe({ query: { retry: false } });

  useEffect(() => {
    if (user && !user.is_superuser) {
      router.replace("/");
    }
  }, [user, router]);

  if (isLoading || !user?.is_superuser) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return <>{children}</>;
}
