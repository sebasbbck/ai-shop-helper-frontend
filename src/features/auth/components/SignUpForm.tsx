import { zodResolver } from "@hookform/resolvers/zod"
import Alert from "@mui/material/Alert"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import IconButton, { IconButtonProps } from "@mui/material/IconButton"
import InputAdornment from "@mui/material/InputAdornment"
import Link from "@mui/material/Link"
import Typography from "@mui/material/Typography"
import NextLink from "next/link"
import { useBoolean } from "minimal-shared/hooks"
import { useEffect, useState } from "react"
import { type SubmitHandler, useForm } from "react-hook-form"
import { Field, Form, schemaUtils } from "../../../components/hook-form"
import * as z from "zod"
import { FormHead } from "./FormHead"
import { SignUpTerms } from "./SignUpTerms"
import { Iconify } from "../../../components/iconify/iconify"
// import useAuth, { isLoggedIn } from "../hooks/useAuth"
// import { getErrorMessage } from "@/utils"
// import Collapse from "@mui/material/Collapse"
import useCustomToast from "../../../hooks/useCustomToast"
import { useTranslation } from "next-i18next"
import { CircularProgress } from "@mui/material"
import { UserCreate } from "../../../../api/model"
import { register } from "../../../../api/auth/auth"
import router from "next/router"
import useBackdrop from "../../../hooks/useBackdrop"
import useHandleError from "../../../hooks/useHandleError"

interface UserRegisterForm extends UserCreate {
  confirm_password: string
}

function SignUpForm() {
  const { showWarningToast } = useCustomToast()
  const { t } = useTranslation()

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search)
      const ref = params.get("ref")
      // check that ref ends in a dash and 5 alphanumeric characters (uppercase or lowercase)
      if (ref) {
        if (ref.match(/-[a-z0-9]{5}$/)) {
          setReferralCode(ref)
        } else {
          showWarningToast(t("translation:signup.invalid_code"), t("translation:signup.invalid_code_description"))
        }
      }
      
    } catch (err) {
      // ignore if window is not available (SSR)
    }
  }, [])

  const showPassword = useBoolean()
  const [referralCode, setReferralCode] = useState<string | null>(null)
  const [expanded, setExpanded]  = useState<boolean>(false)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  // const { signUpMutation } = useAuth()
  const { showSignupBackdrop } = useBackdrop()
  const handleError = useHandleError()

  const handleExpandClick = () => {
    setExpanded(!expanded)
  }

  const SignUpSchema = z
    .object({
      name: z
        .string()
        .min(1, { message: t("translation:forms.name_not_empty") }),
      email: schemaUtils.email(),
      password: z
        .string()
        .min(8, { message: t("translation:forms.password_minimum_characters") })
        .regex(/[A-Z]/, t("translation:forms.password_must_contain_uppercase"))
        .regex(/[a-z]/, t("translation:forms.password_must_contain_lowercase"))
        .regex(/[0-9]/, t("translation:forms.password_must_contain_number"))
        .regex(/[!@#$%^&*()\-_~,.:;{}<>]/, t("translation:forms.password_must_contain_special_character")),
      confirm_password: z
        .string()
        .min(8, { message: t("translation:forms.password_minimum_characters") }),
      referral_code: z
        .string()
        .regex(/-[a-z0-9]{5}$/, { message: t("translation:forms.invalid_code_format") })
        .optional()
        .or(z.literal("")),
    })
    .refine((data) => data.password === data.confirm_password, {
      path: ["confirm_password"],
      message: t("translation:forms.passwords_do_not_match"),
    })

  const methods = useForm({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirm_password: "",
      // referral_code: "",
    },
  })

  const onSubmit: SubmitHandler<UserRegisterForm> = async (
    data: UserRegisterForm,
  ) => {
    setIsSubmitting(true)
    try {
      await register(data)
      showSignupBackdrop(t("translation:signup.signed_up_title"), t("translation:signup.signed_up_description"))
      router.push("/login")
    } catch (err) {
      handleError(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderForm = () => (
    <Box sx={{ gap: 3, display: "flex", flexDirection: "column" }}>
      <Box
        sx={{
          display: "flex",
          gap: { xs: 3, sm: 2 },
          flexDirection: { xs: "column", sm: "row" },
        }}
      >
        <Field.Text
          name="name"
          label={t("translation:forms.name")}
          slotProps={{ inputLabel: { shrink: true } }}
        />
      </Box>

      <Field.Text
        name="email"
        label={t("translation:forms.email")}
        slotProps={{ inputLabel: { shrink: true } }}
      />

      {/*
      <Field.Text
        name="name"
        label="Razón social"
        slotProps={{ inputLabel: { shrink: true } }}
      />

      <Field.Text
        name="name"
        label="NIF"
        slotProps={{ inputLabel: { shrink: true } }}
      />
       */}

      <Field.Text
        name="password"
        label={t("translation:forms.password")}
        placeholder={t("translation:signup.8_chars")}
        type={showPassword.value ? "text" : "password"}
        slotProps={{
          inputLabel: { shrink: true },
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={showPassword.onToggle} edge="end">
                  <Iconify
                    icon={showPassword.value
                      ? "solar:eye-bold"
                      : "solar:eye-closed-bold"} 
                    className={undefined}
                    height={undefined}
                    sx={undefined}
                  />
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
      />

      <Field.Text
        name="confirm_password"
        label={t("translation:forms.confirm_password")}
        type={showPassword.value ? "text" : "password"}
        slotProps={{
          inputLabel: { shrink: true },
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={showPassword.onToggle} edge="end">
                  <Iconify
                    icon={showPassword.value
                      ? "solar:eye-bold"
                      : "solar:eye-closed-bold"}
                      className={undefined}
                      height={undefined}
                      sx={undefined}
                    />
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
      />

      {/*
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>{t("translation:signup.referral_code")}</Typography>
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <Iconify icon={"solar:alt-arrow-down-linear"} className={undefined} height={undefined} sx={undefined} />
        </ExpandMore>
      </Box>
      
      
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Field.Text
          name="referral_code"
          label={t("translation:forms.code")}
          slotProps={{ inputLabel: { shrink: true } }}
          defaultValue={referralCode || ""}
          disabled={!!referralCode}
        />
      </Collapse>
      */}

      <Button
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        disabled={isSubmitting}
      >
        {isSubmitting && <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />}
        {isSubmitting ? t("translation:onboarding.processing") : t("translation:signup.create_account")}
      </Button>
    </Box>
  )

  return (
    <Box sx={{ width: "100%", display: "flex", flex: "1 1 auto", alignItems: "center", justifyContent: "center", flexDirection: "row", height: "calc(100vh - var(--layout-header-desktop-height))" }}>
      <Box sx={{ position: "relative", padding: "2rem", flex: "1 1 auto", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
        <img style={{ borderRadius: 12, width: 420 }}
          src="/assets/images/herramienta-ia-marketing-equipo-login.webp"
          alt="Los cuatro agentes de AI Shop Helper"
        />
      </Box>

      <Box sx={{ width: "50%", display: "flex", alignItems: "center", justifyContent: "left", padding: "2rem" }}>
        <Box sx={{ width: "100%", maxWidth: "420px" }}>
          <FormHead
            title={t("translation:signup.title")}
            description={
              <>
                {t("translation:signup.account")}
                <Link
                  component={NextLink}
                  href={"/login"}
                  variant="subtitle2"
                >
                  {t("translation:signup.login_link")}
                </Link>
              </>
            }
            sx={{ textAlign: { xs: "center", md: "left" } }}
          />

          <Alert severity="info" sx={{ mb: 3 }}>
            Actualmente no está disponible el programa de referidos. Disculpe las molestias.
          </Alert>

          <Form methods={methods} onSubmit={methods.handleSubmit(onSubmit)}>
            {renderForm()}
          </Form>

          <SignUpTerms />
        </Box>
      </Box>
    </Box>
  )
}

export default SignUpForm
