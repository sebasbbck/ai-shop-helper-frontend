import type { useTranslations } from "next-intl";
import type { NotificationPublic } from "@/api/model/notificationPublic";

export type NotificationsTranslator = ReturnType<
  typeof useTranslations<"Notifications">
>;

/**
 * Builds the localized title/body for a notification from its `type` + `payload`
 * (the backend sends no text, see the backend's CLAUDE.md notifications section).
 * Falls back to the type label alone if the payload's `reason` doesn't match a
 * known message. Shared between the bell (`NotificationsMenu`, title only) and
 * the dedicated `/notifications` view (`NotificationsScreen`, title + body).
 */
export function notificationText(
  t: NotificationsTranslator,
  notification: NotificationPublic,
): { title: string; body: string } {
  const payload = (notification.payload ?? {}) as Record<string, unknown>;
  const reason =
    typeof payload.reason === "string" ? payload.reason : undefined;
  const base = `messages.${notification.type}.${reason}`;

  if (!reason || !t.has(`${base}.title`)) {
    return {
      title: t.has(`types.${notification.type}`)
        ? t(`types.${notification.type}`)
        : notification.type,
      body: "",
    };
  }

  const connectionType =
    typeof payload.connection_type === "string" ? payload.connection_type : "";

  return {
    title: t(`${base}.title`),
    body: t(`${base}.body`, {
      credits: typeof payload.credits === "number" ? payload.credits : 0,
      plan: typeof payload.plan === "string" ? payload.plan : "",
      project:
        typeof payload.project_name === "string" ? payload.project_name : "",
      service: t.has(`connectionTypes.${connectionType}`)
        ? t(`connectionTypes.${connectionType}`)
        : connectionType,
    }),
  };
}
