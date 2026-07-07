import Container from "@mui/material/Container";
import SettingsForm from "@/features/settings/SettingsForm";

export default async function SettingsPage() {
  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <SettingsForm />
    </Container>
  );
}
