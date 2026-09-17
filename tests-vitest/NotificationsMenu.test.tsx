import { beforeEach, describe, expect, test, vi } from "vitest";
import { fireEvent, screen } from "@testing-library/react";
import { renderWithProviders } from "./test-utils";
import { makeRouter } from "./mocks/router";
import { makeNotification } from "./mocks/entities";
import NotificationsMenu from "@/features/notifications/NotificationsMenu";
import type { NotificationPublic } from "@/api/model/notificationPublic";

const h = vi.hoisted(() => ({
  unreadCount: 0,
  notifications: [] as NotificationPublic[],
  isLoading: false,
  mutate: vi.fn(),
  push: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => makeRouter({ push: h.push }),
}));

vi.mock("@/api/endpoints/notifications/notifications", () => ({
  getNotificationsGetNotificationsQueryKey: () => ["notifications"],
  getNotificationsGetUnreadCountQueryKey: () => ["notifications", "unread"],
  useNotificationsGetUnreadCount: () => ({
    data: { unread_count: h.unreadCount },
  }),
  useNotificationsGetNotifications: () => ({
    data: { items: h.notifications },
    isLoading: h.isLoading,
  }),
  useNotificationsMarkNotificationRead: () => ({ mutate: h.mutate }),
}));

function openMenu() {
  fireEvent.click(screen.getByRole("button", { name: "Notifications" }));
}

describe("NotificationsMenu", () => {
  beforeEach(() => {
    h.unreadCount = 0;
    h.notifications = [];
    h.isLoading = false;
    h.mutate.mockClear();
    h.push.mockClear();
  });

  test("shows the unread count badge", () => {
    h.unreadCount = 3;

    renderWithProviders(<NotificationsMenu />);

    expect(screen.getByText("3")).toBeInTheDocument();
  });

  test("renders the localized title but not the body", () => {
    h.notifications = [
      makeNotification({
        type: "service_change",
        payload: {
          reason: "connection_established",
          connection_type: "wordpress",
          project_name: "My Project",
        },
      }),
    ];

    renderWithProviders(<NotificationsMenu />);
    openMenu();

    expect(screen.getByText("New connection established")).toBeInTheDocument();
    expect(
      screen.queryByText(
        'Project "My Project" has been successfully connected to WordPress.',
      ),
    ).not.toBeInTheDocument();
  });

  test("links to the dedicated notifications view instead of settings", () => {
    renderWithProviders(<NotificationsMenu />);
    openMenu();

    fireEvent.click(screen.getByText("View all"));

    expect(h.push).toHaveBeenCalledWith("/notifications");
  });

  test("falls back to the type label when the payload has no recognized reason", () => {
    h.notifications = [
      makeNotification({ type: "execution_finished", payload: {} }),
    ];

    renderWithProviders(<NotificationsMenu />);
    openMenu();

    expect(screen.getByText("Agent run finished")).toBeInTheDocument();
  });

  test("marks an unread notification as read on click", () => {
    h.notifications = [
      makeNotification({
        id: "n2",
        type: "user_status_change",
        payload: { reason: "activated" },
        read_at: null,
      }),
    ];

    renderWithProviders(<NotificationsMenu />);
    openMenu();

    fireEvent.click(screen.getByText("Account activated"));

    expect(h.mutate).toHaveBeenCalledWith({ notificationId: "n2" });
  });
});
