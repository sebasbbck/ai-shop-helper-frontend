"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import CheckIcon from "@mui/icons-material/Check";
import { locales, type Locale } from "@/i18n/config";
import { setLocale } from "./actions";

const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  es: "Español",
};

export default function LocaleSwitcher() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleSelect = async (loc: string) => {
    setAnchorEl(null);
    await setLocale(loc);
    router.refresh();
  };

  return (
    <>
      <Button
        size="small"
        onClick={(e) => setAnchorEl(e.currentTarget)}
        sx={{
          minWidth: 0,
          px: 1,
          py: 0.5,
          color: "text.secondary",
          fontWeight: 600,
          fontSize: "0.7rem",
          letterSpacing: "0.06em",
          "&:hover": { bgcolor: "action.hover", color: "text.primary" },
        }}
      >
        {locale.toUpperCase()}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{ paper: { sx: { minWidth: 140 } } }}
      >
        {locales.map((loc) => (
          <MenuItem
            key={loc}
            selected={loc === locale}
            onClick={() => handleSelect(loc)}
          >
            <Box sx={{ display: "flex", alignItems: "center", width: "100%", gap: 1 }}>
              <Typography variant="body2">{LOCALE_LABELS[loc]}</Typography>
              {loc === locale && (
                <CheckIcon sx={{ fontSize: 14, ml: "auto", color: "primary.main" }} />
              )}
            </Box>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
