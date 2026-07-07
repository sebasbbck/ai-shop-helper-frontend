import type { ReactNode } from "react";
import Image from "next/image";
import Box from "@mui/material/Box";
import LocaleSwitcher from "@/features/i18n/LocaleSwitcher";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        component="header"
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          px: 3,
          pt: 2,
        }}
      >
        <LocaleSwitcher />
      </Box>
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          px: 2,
          py: 6,
        }}
      >
        <Box sx={{ mb: 5 }}>
          <Image
            src="/ai-shop-helper-logo.webp"
            alt="AI Shop Helper"
            width={1051}
            height={334}
            priority
            style={{ height: 36, width: "auto" }}
          />
        </Box>
        <Box
          sx={{
            width: "100%",
            maxWidth: 400,
            bgcolor: "background.paper",
            borderRadius: 3,
            p: { xs: 3, sm: 4 },
            boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.04)",
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}
