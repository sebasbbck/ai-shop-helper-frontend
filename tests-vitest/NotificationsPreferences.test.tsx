import { beforeEach, describe, expect, test, vi } from "vitest";
import { fireEvent, screen } from "@testing-library/react";
import { renderWithProviders } from "./test-utils";
import NotificationsPreferences from "@/features/notifications/NotificationsPreferences";

const h = vi.hoisted(() => ({
  data: undefined as { preferences: Record<string, boolean> } | undefined,
  isLoading: false,
  isError: false,
  mutate: vi.fn(),
  updateIsPending: false,
  updateIsError: false,
}));

vi.mock("@/api/endpoints/notifications/notifications", () => ({
  getNotificationsGetNotificationPreferencesQueryKey: () => ["notif-prefs"],
  useNotificationsGetNotificationPreferences: () => ({
    data: h.data,
    isLoading: h.isLoading,
    isError: h.isError,
  }),
  useNotificationsUpdateNotificationPreference: () => ({
    mutate: h.mutate,
    isPending: h.updateIsPending,
    isError: h.updateIsError,
  }),
}));

beforeEach(() => {
  h.data = undefined;
  h.isLoading = false;
  h.isError = false;
  h.mutate.mockClear();
  h.updateIsPending = false;
  h.updateIsError = false;
});

describe("NotificationsPreferences", () => {
  test("shows a spinner while loading", () => {
    h.isLoading = true;
    renderWithProviders(<NotificationsPreferences />);
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  test("shows an error alert when loading fails", () => {
    h.isError = true;
    renderWithProviders(<NotificationsPreferences />);
    expect(screen.getByText("Could not load preferences")).toBeInTheDocument();
  });

  test("renders a switch per type, enabled unless muted", () => {
    h.data = {
      preferences: { execution_finished: false, service_change: true },
    };
    renderWithProviders(<NotificationsPreferences />);

    expect(
      screen.getByRole("switch", { name: "Agent run finished" }),
    ).toBeChecked();
    expect(
      screen.getByRole("switch", { name: "Service changes" }),
    ).not.toBeChecked();
  });

  test("toggling a switch mutes/unmutes the type", () => {
    h.data = { preferences: { execution_finished: false } };
    renderWithProviders(<NotificationsPreferences />);

    fireEvent.click(screen.getByRole("switch", { name: "Agent run finished" }));

    expect(h.mutate).toHaveBeenCalledWith({
      data: { notification_type: "execution_finished", muted: true },
    });
  });

  test("shows an error alert when updating a preference fails", () => {
    h.data = { preferences: { execution_finished: false } };
    h.updateIsError = true;
    renderWithProviders(<NotificationsPreferences />);
    expect(screen.getByText("Could not update preference")).toBeInTheDocument();
  });
});
