import { SxProps, Theme } from "@mui/material"
import Box from "@mui/material/Box"
import Link from "@mui/material/Link"
import { Link as RouterLink } from "@tanstack/react-router"
import { useTranslation } from "react-i18next"

// ----------------------------------------------------------------------

export function SignUpTerms({ sx, ...other }: { sx?: SxProps<Theme>}) {
  const { t } = useTranslation()
  return (
    <Box
      component="span"
      sx={[
        () => ({
          mt: 3,
          display: "block",
          textAlign: "center",
          typography: "caption",
          color: "text.secondary",
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      {t("translation:signup.disclaimer1")}
      <Link
        component={RouterLink}
        target="_blank"
        to={t("translation:signup.terms_link")}
        underline="hover"
        color="primary"
      >
        {t("translation:signup.terms")}
      </Link>
      {t("translation:signup.disclaimer2")}
      <Link
        component={RouterLink}
        target="_blank"
        to={t("translation:signup.privacy_policy_link")}
        underline="hover"
        color="primary"
      >
        {t("translation:signup.privacy_policy")}
      </Link>
      {t("translation:signup.disclaimer3")}
    </Box>
  )
}
