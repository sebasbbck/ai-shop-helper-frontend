import { beforeEach, describe, expect, test, vi } from "vitest";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import { renderWithProviders } from "./test-utils";
import GoogleConnectionSection from "@/features/project/GoogleConnectionSection";

const h = vi.hoisted(() => ({
  connected: false,
  googleEmail: undefined as string | undefined,
  statusError: false,
  startGoogleConnection: vi.fn(),
}));

vi.mock("@/api/endpoints/connections/connections", () => ({
  useConnectionsGetGoogleConnectionStatus: () => ({
    data: { connected: h.connected, google_email: h.googleEmail },
    isError: h.statusError,
  }),
  connectionsStartGoogleConnection: (...args: unknown[]) =>
    h.startGoogleConnection(...args),
}));

describe("GoogleConnectionSection", () => {
  const originalLocation = window.location;

  beforeEach(() => {
    h.connected = false;
    h.googleEmail = undefined;
    h.statusError = false;
    h.startGoogleConnection.mockReset();
    Object.defineProperty(window, "location", {
      configurable: true,
      value: { ...originalLocation, href: "" },
    });
  });

  test("shows not-connected state and a connect button", () => {
    renderWithProviders(<GoogleConnectionSection projectId="project-1" />);

    expect(screen.getByText("Not connected")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Connect with Google/i }),
    ).toBeInTheDocument();
  });

  test("shows the connected account email when connected", () => {
    h.connected = true;
    h.googleEmail = "user@example.com";

    renderWithProviders(<GoogleConnectionSection projectId="project-1" />);

    expect(screen.getByText("Connected")).toBeInTheDocument();
    expect(
      screen.getByText("Google account: user@example.com"),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Reconnect" }),
    ).toBeInTheDocument();
  });

  test("shows the load error alert when the status query fails", () => {
    h.statusError = true;

    renderWithProviders(<GoogleConnectionSection projectId="project-1" />);

    expect(
      screen.getByText("Could not load connection status"),
    ).toBeInTheDocument();
  });

  test("redirects to the returned auth_url when connecting", async () => {
    h.startGoogleConnection.mockResolvedValue({
      auth_url: "https://accounts.google.com/o/oauth2/v2/auth?foo=bar",
    });

    renderWithProviders(<GoogleConnectionSection projectId="project-1" />);
    fireEvent.click(screen.getByRole("button", { name: /Connect with Google/i }));

    await waitFor(() =>
      expect(window.location.href).toBe(
        "https://accounts.google.com/o/oauth2/v2/auth?foo=bar",
      ),
    );
    expect(h.startGoogleConnection).toHaveBeenCalledWith("project-1");
  });

  test("shows an error alert when starting the connection fails", async () => {
    h.startGoogleConnection.mockRejectedValue(new Error("network error"));

    renderWithProviders(<GoogleConnectionSection projectId="project-1" />);
    fireEvent.click(screen.getByRole("button", { name: /Connect with Google/i }));

    expect(
      await screen.findByText("Could not start Google connection"),
    ).toBeInTheDocument();
  });
});
