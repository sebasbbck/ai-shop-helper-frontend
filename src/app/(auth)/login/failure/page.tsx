import { getTranslations } from "next-intl/server";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutlined";

export default async function GoogleLoginFailurePage() {
  const t = await getTranslations("Auth");

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
      }}
    >
      <ErrorOutlineIcon sx={{ fontSize: 48, color: "error.main" }} />
      <Typography variant="h6" sx={{ fontWeight: 600, textAlign: "center" }}>
        {t("loginFailureHeading")}
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ textAlign: "center" }}
      >
        {t("loginFailureBody")}
      </Typography>
      <Button href="/login" variant="outlined" sx={{ mt: 1 }}>
        {t("backToLogin")}
      </Button>
    </Box>
  );
}
