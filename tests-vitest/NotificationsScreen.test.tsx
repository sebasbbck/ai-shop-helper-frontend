import { beforeEach, describe, expect, test, vi } from "vitest";
import { fireEvent, screen } from "@testing-library/react";
import { renderWithProviders } from "./test-utils";
import { makeActiveContext } from "./mocks/active-context";
import { makeListQueryState, type ListQueryState } from "./mocks/query-state";
import { makeOrg, makeNotification } from "./mocks/entities";
import NotificationsScreen from "@/features/notifications/NotificationsScreen";
import type { NotificationPublic } from "@/api/model/notificationPublic";
import type { OrgWithProjects } from "@/api/model";

const h = vi.hoisted(() => ({
  listState: {} as ListQueryState<NotificationPublic>,
  unreadCount: 0,
  orgs: [] as OrgWithProjects[],
  getNotifications: vi.fn(),
  getUnreadCount: vi.fn(),
  markRead: vi.fn(),
  markUnread: vi.fn(),
  markAllRead: vi.fn(),
}));

vi.mock("@/features/shell/ActiveContext", () => ({
  useActiveContext: () => makeActiveContext({ orgs: h.orgs }),
}));

vi.mock("@/api/endpoints/notifications/notifications", () => ({
  getNotificationsGetNotificationsQueryKey: () => ["notifications"],
  getNotificationsGetUnreadCountQueryKey: () => ["notifications", "unread"],
  useNotificationsGetNotifications: (params: unknown, options: unknown) => {
    h.getNotifications(params, options);
    return h.listState;
  },
  useNotificationsGetUnreadCount: (params: unknown) => {
    h.getUnreadCount(params);
    return { data: { unread_count: h.unreadCount } };
  },
  useNotificationsMarkNotificationRead: () => ({ mutate: h.markRead }),
  useNotificationsMarkNotificationUnread: () => ({ mutate: h.markUnread }),
  useNotificationsMarkAllNotificationsRead: () => ({
    mutate: h.markAllRead,
    isPending: false,
  }),
}));

beforeEach(() => {
  h.listState = makeListQueryState();
  h.unreadCount = 0;
  h.orgs = [];
  h.getNotifications.mockClear();
  h.getUnreadCount.mockClear();
  h.markRead.mockClear();
  h.markUnread.mockClear();
  h.markAllRead.mockClear();
});

describe("NotificationsScreen", () => {
  test("requests the first page, unfiltered, on mount", () => {
    h.listState = makeListQueryState({ data: { items: [], total: 0 } });
    renderWithProviders(<NotificationsScreen />);
    expect(h.getNotifications).toHaveBeenCalledWith(
      { unread_only: false, org_id: undefined, offset: 0, limit: 10 },
      expect.anything(),
    );
  });

  test("shows the empty state", () => {
    h.listState = makeListQueryState({ data: { items: [], total: 0 } });
    renderWithProviders(<NotificationsScreen />);
    expect(screen.getByText("You have no notifications")).toBeInTheDocument();
  });

  test("shows the error state", () => {
    h.listState = makeListQueryState({ isError: true });
    renderWithProviders(<NotificationsScreen />);
    expect(
      screen.getByText("Could not load notifications"),
    ).toBeInTheDocument();
  });

  test("shows skeletons while loading", () => {
    h.listState = makeListQueryState({ isLoading: true });
    const { container } = renderWithProviders(<NotificationsScreen />);
    expect(
      container.querySelectorAll(".MuiSkeleton-root").length,
    ).toBeGreaterThan(0);
  });

  test("renders a notification's title, body and date", () => {
    h.listState = makeListQueryState({
      data: {
        items: [makeNotification({ payload: { reason: "success" } })],
        total: 1,
      },
    });
    renderWithProviders(<NotificationsScreen />);
    expect(screen.getByText("Run completed")).toBeInTheDocument();
    expect(
      screen.getByText("The agent has finished running successfully."),
    ).toBeInTheDocument();
  });

  test("switching to the Unread filter requests unread_only", () => {
    h.listState = makeListQueryState({ data: { items: [], total: 0 } });
    renderWithProviders(<NotificationsScreen />);

    fireEvent.click(screen.getByRole("button", { name: "Unread" }));

    expect(h.getNotifications).toHaveBeenLastCalledWith(
      { unread_only: true, org_id: undefined, offset: 0, limit: 10 },
      expect.anything(),
    );
  });

  test("hides the org filter when the user belongs to a single org", () => {
    h.orgs = [makeOrg()];
    h.listState = makeListQueryState({ data: { items: [], total: 0 } });
    renderWithProviders(<NotificationsScreen />);
    expect(screen.queryByLabelText("Organization")).not.toBeInTheDocument();
  });

  test("filtering by org scopes the list and the mark-all-read request", () => {
    h.orgs = [
      makeOrg({ id: "org1", name: "Acme" }),
      makeOrg({ id: "org2", name: "Beta" }),
    ];
    h.unreadCount = 1;
    h.listState = makeListQueryState({ data: { items: [], total: 0 } });
    renderWithProviders(<NotificationsScreen />);

    fireEvent.mouseDown(screen.getByLabelText("Organization"));
    fireEvent.click(screen.getByRole("option", { name: "Beta" }));

    expect(h.getNotifications).toHaveBeenLastCalledWith(
      { unread_only: false, org_id: "org2", offset: 0, limit: 10 },
      expect.anything(),
    );

    fireEvent.click(screen.getByRole("button", { name: "Mark all as read" }));
    expect(h.markAllRead).toHaveBeenCalledWith({ params: { org_id: "org2" } });
  });

  test("disables mark-all-read when nothing is unread", () => {
    h.unreadCount = 0;
    h.listState = makeListQueryState({ data: { items: [], total: 0 } });
    renderWithProviders(<NotificationsScreen />);
    expect(
      screen.getByRole("button", { name: "Mark all as read" }),
    ).toBeDisabled();
  });

  test("toggles an unread notification to read", () => {
    h.listState = makeListQueryState({
      data: {
        items: [makeNotification({ id: "n1", read_at: null })],
        total: 1,
      },
    });
    renderWithProviders(<NotificationsScreen />);

    fireEvent.click(screen.getByRole("button", { name: "Mark as read" }));

    expect(h.markRead).toHaveBeenCalledWith({ notificationId: "n1" });
  });

  test("toggles a read notification back to unread", () => {
    h.listState = makeListQueryState({
      data: {
        items: [
          makeNotification({
            id: "n1",
            read_at: "2026-09-03T10:05:00Z",
          }),
        ],
        total: 1,
      },
    });
    renderWithProviders(<NotificationsScreen />);

    fireEvent.click(screen.getByRole("button", { name: "Mark as unread" }));

    expect(h.markUnread).toHaveBeenCalledWith({ notificationId: "n1" });
  });

  test("advances the offset when paging", () => {
    h.listState = makeListQueryState({
      data: { items: [makeNotification()], total: 60 },
    });
    renderWithProviders(<NotificationsScreen />);

    fireEvent.click(screen.getByRole("button", { name: "Go to next page" }));

    expect(h.getNotifications).toHaveBeenLastCalledWith(
      { unread_only: false, org_id: undefined, offset: 10, limit: 10 },
      expect.anything(),
    );
  });
});
