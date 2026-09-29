import Container from "@mui/material/Container";
import NotificationsScreen from "@/features/notifications/NotificationsScreen";

export default function NotificationsPage() {
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <NotificationsScreen />
    </Container>
  );
}
