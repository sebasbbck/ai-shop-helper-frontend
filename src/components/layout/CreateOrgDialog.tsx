"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQueryClient } from "@tanstack/react-query";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import {
  useOrgsCreateOrg,
  getOrgsGetMyOrgsQueryKey,
} from "@/api/endpoints/orgs/orgs";
import { useActiveContext } from "@/features/shell/ActiveContext";

const schema = z.object({ name: z.string().min(1) });
type FormValues = z.infer<typeof schema>;

interface CreateOrgDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function CreateOrgDialog({ open, onClose }: CreateOrgDialogProps) {
  const t = useTranslations("Shell");
  const tc = useTranslations("Common");
  const tv = useTranslations("Validation");
  const router = useRouter();
  const qc = useQueryClient();
  const { selectAfterCreate } = useActiveContext();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setError,
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const createOrg = useOrgsCreateOrg({
    mutation: {
      onSuccess: async (org) => {
        await qc.invalidateQueries({ queryKey: getOrgsGetMyOrgsQueryKey() });
        selectAfterCreate(org.id);
        router.push("/org");
        onClose();
        reset();
      },
      onError: () => {
        setError("root", { message: t("createOrgError") });
      },
    },
  });

  const onSubmit = (values: FormValues) => {
    createOrg.mutate({ data: { name: values.name } });
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <DialogTitle>{t("newOrg")}</DialogTitle>
        <DialogContent sx={{ pt: "12px !important", display: "flex", flexDirection: "column", gap: 2 }}>
          {errors.root && (
            <Alert severity="error">{errors.root.message}</Alert>
          )}
          <TextField
            label={tc("name")}
            fullWidth
            autoFocus
            size="small"
            error={Boolean(errors.name)}
            helperText={errors.name ? tv("nameRequired") : undefined}
            {...register("name")}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleClose} color="inherit">
            {tc("cancel")}
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting || createOrg.isPending}
          >
            {createOrg.isPending ? tc("creating") : tc("create")}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
