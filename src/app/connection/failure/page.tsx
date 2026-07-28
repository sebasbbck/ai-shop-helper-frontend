import { getTranslations } from "next-intl/server";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutlined";

export default async function ConnectionFailurePage() {
  const t = await getTranslations("Connection");

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
        p: 4,
      }}
    >
      <ErrorOutlineIcon sx={{ fontSize: 56, color: "error.main" }} />
      <Typography variant="h4" sx={{ fontWeight: 700, textAlign: "center" }}>
        {t("failureHeading")}
      </Typography>
      <Typography
        variant="body1"
        color="text.secondary"
        sx={{ textAlign: "center", maxWidth: 440 }}
      >
        {t("failureBody")}
      </Typography>
      <Button href="/project/settings" variant="outlined" sx={{ mt: 1 }}>
        {t("backToProject")}
      </Button>
    </Box>
  );
}
