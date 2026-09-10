import Container from "@mui/material/Container";
import NotificationsPreferences from "@/features/notifications/NotificationsPreferences";
import SettingsForm from "@/features/settings/SettingsForm";

export default async function SettingsPage() {
  return (
    <Container maxWidth="sm" sx={{ 
          py: 8,     
          borderRadius: 3,
          mt:3,
          mb:3,
          p:3,
          bgcolor: "background.paper",
          
        }}>
      <SettingsForm />
      <NotificationsPreferences />
    </Container>
  );
}
