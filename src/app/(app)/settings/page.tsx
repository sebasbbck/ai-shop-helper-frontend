import Container from "@mui/material/Container";
import NotificationsPreferences from "@/features/notifications/NotificationsPreferences";
import SettingsForm from "@/features/settings/SettingsForm";

export default async function SettingsPage() {
  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <SettingsForm />
      <NotificationsPreferences />
    </Container>
  );
}
