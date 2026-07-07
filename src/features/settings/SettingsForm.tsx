"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import {
  getUsersGetMeQueryKey,
  useUsersGetMe,
  useUsersUpdateMe,
} from "@/api/endpoints/users/users";

type FormValues = {
  name: string;
  email: string;
};

export default function SettingsForm() {
  const t = useTranslations("Settings");
  const tCommon = useTranslations("Common");
  const tValidation = useTranslations("Validation");
  const queryClient = useQueryClient();
  const [saved, setSaved] = useState(false);
  const { data: user } = useUsersGetMe({ query: { retry: false } });

  const schema = z.object({
    name: z.string().min(1, tValidation("nameRequired")),
    email: z.string().email(tValidation("emailInvalid")),
  });

  const { control, handleSubmit, formState } = useForm<FormValues>({
    resolver: zodResolver(schema),
    values: user ? { name: user.name, email: user.email } : undefined,
  });

  const update = useUsersUpdateMe({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getUsersGetMeQueryKey() });
        setSaved(true);
      },
    },
  });

  const onSubmit = (values: FormValues) => {
    setSaved(false);
    update.mutate({ data: values });
  };

  return (
    <Stack component="form" onSubmit={handleSubmit(onSubmit)} spacing={3}>
      <Typography variant="h4" component="h1">
        {t("heading")}
      </Typography>
      {saved && <Alert severity="success">{t("profileUpdated")}</Alert>}
      {update.isError && <Alert severity="error">{t("saveError")}</Alert>}
      <Controller
        name="name"
        control={control}
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            label={tCommon("name")}
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
            fullWidth
          />
        )}
      />
      <Controller
        name="email"
        control={control}
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            label={tCommon("email")}
            type="email"
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
            fullWidth
          />
        )}
      />
      <Button
        type="submit"
        variant="contained"
        disabled={update.isPending || !formState.isDirty}
        sx={{ alignSelf: "flex-start" }}
      >
        {update.isPending ? tCommon("saving") : tCommon("save")}
      </Button>
    </Stack>
  );
}
