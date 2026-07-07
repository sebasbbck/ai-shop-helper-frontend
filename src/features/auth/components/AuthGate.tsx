"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { useUsersGetMe } from "@/api/endpoints/users/users";
import { ensureAccessToken } from "@/lib/api/custom-instance";

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    ensureAccessToken().then((token) => {
      if (!active) {
        return;
      }
      if (token) {
        setReady(true);
      } else {
        router.replace("/login");
      }
    });
    return () => {
      active = false;
    };
  }, [router]);

  const { data: user, isError } = useUsersGetMe({
    query: { enabled: ready, retry: false },
  });

  useEffect(() => {
    if (isError) {
      router.replace("/login");
    }
  }, [isError, router]);

  if (!ready || !user) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return <>{children}</>;
}
