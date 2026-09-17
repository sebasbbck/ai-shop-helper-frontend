import { beforeEach, describe, expect, test, vi } from "vitest";
import { act, fireEvent, screen, waitFor } from "@testing-library/react";
import { renderWithProviders } from "./test-utils";
import WordpressConnectionSection from "@/features/project/WordpressConnectionSection";

type StartOptions = {
  mutation?: {
    onSuccess?: (data: { redirect_url: string }) => void;
    onError?: () => void;
  };
};

const h = vi.hoisted(() => ({
  status: undefined as
    { connected: boolean; site_url?: string; username?: string } | undefined,
  statusError: false,
  mutate: vi.fn(),
  isPending: false,
  options: undefined as StartOptions | undefined,
}));

vi.mock("@/api/endpoints/connections/connections", () => ({
  useConnectionsGetWordpressStatus: () => ({
    data: h.status,
    isError: h.statusError,
  }),
  useConnectionsStartWordpressConnection: (options: StartOptions) => {
    h.options = options;
    return { mutate: h.mutate, isPending: h.isPending };
  },
}));

describe("WordpressConnectionSection", () => {
  const originalLocation = window.location;

  beforeEach(() => {
    h.status = undefined;
    h.statusError = false;
    h.mutate.mockClear();
    h.isPending = false;
    h.options = undefined;
    Object.defineProperty(window, "location", {
      configurable: true,
      value: { ...originalLocation, href: "" },
    });
  });

  test("shows the not-connected state and a connect button", () => {
    h.status = { connected: false };
    renderWithProviders(<WordpressConnectionSection projectId="project-1" />);

    expect(screen.getByText("Not connected")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Connect WordPress" }),
    ).toBeInTheDocument();
  });

  test("shows the connected site and username", () => {
    h.status = {
      connected: true,
      site_url: "https://my-store.com",
      username: "admin",
    };
    renderWithProviders(<WordpressConnectionSection projectId="project-1" />);

    expect(screen.getByText("Connected")).toBeInTheDocument();
    expect(
      screen.getByText("Site URL: https://my-store.com"),
    ).toBeInTheDocument();
    expect(screen.getByText("WordPress user: admin")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Reconnect" }),
    ).toBeInTheDocument();
  });

  test("shows the load error alert when the status query fails", () => {
    h.statusError = true;
    renderWithProviders(<WordpressConnectionSection projectId="project-1" />);
    expect(
      screen.getByText("Could not load connection status"),
    ).toBeInTheDocument();
  });

  test("shows a validation error for an empty site url", async () => {
    h.status = { connected: false };
    renderWithProviders(<WordpressConnectionSection projectId="project-1" />);
    fireEvent.click(screen.getByRole("button", { name: "Connect WordPress" }));

    expect(await screen.findByText("Required")).toBeInTheDocument();
    expect(h.mutate).not.toHaveBeenCalled();
  });

  test("starts the connection with the entered site url", async () => {
    h.status = { connected: false };
    renderWithProviders(<WordpressConnectionSection projectId="project-1" />);
    fireEvent.change(screen.getByLabelText("WordPress site URL"), {
      target: { value: "https://my-store.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Connect WordPress" }));

    await waitFor(() =>
      expect(h.mutate).toHaveBeenCalledWith({
        projectId: "project-1",
        data: { site_url: "https://my-store.com" },
      }),
    );
  });

  test("redirects to the returned url on success", () => {
    h.status = { connected: false };
    renderWithProviders(<WordpressConnectionSection projectId="project-1" />);
    act(() => {
      h.options?.mutation?.onSuccess?.({
        redirect_url: "https://my-store.com/wp-admin/authorize",
      });
    });
    expect(window.location.href).toBe(
      "https://my-store.com/wp-admin/authorize",
    );
  });

  test("shows an error alert when starting the connection fails", () => {
    h.status = { connected: false };
    renderWithProviders(<WordpressConnectionSection projectId="project-1" />);
    act(() => {
      h.options?.mutation?.onError?.();
    });
    expect(
      screen.getByText("Could not start WordPress connection"),
    ).toBeInTheDocument();
  });
});
