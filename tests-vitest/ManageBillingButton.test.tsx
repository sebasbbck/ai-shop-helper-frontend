import { beforeEach, describe, expect, test, vi } from "vitest";
import { fireEvent, screen } from "@testing-library/react";
import { renderWithProviders } from "./test-utils";
import ManageBillingButton from "@/features/billing/ManageBillingButton";

type PortalOptions = {
  mutation?: { onSuccess?: (res: { url: string }) => void };
};

const h = vi.hoisted(() => ({
  mutate: vi.fn(),
  isPending: false,
  options: undefined as PortalOptions | undefined,
}));

vi.mock("@/api/endpoints/billing/billing", () => ({
  useBillingCreatePortal: (options: PortalOptions) => {
    h.options = options;
    return { mutate: h.mutate, isPending: h.isPending };
  },
}));

describe("ManageBillingButton", () => {
  const originalLocation = window.location;

  beforeEach(() => {
    h.mutate.mockClear();
    h.isPending = false;
    h.options = undefined;
    Object.defineProperty(window, "location", {
      configurable: true,
      value: { ...originalLocation, href: "" },
    });
  });

  test("triggers the billing portal mutation with the org id", () => {
    renderWithProviders(<ManageBillingButton orgId="org-1" />);
    fireEvent.click(screen.getByRole("button", { name: "Manage billing" }));
    expect(h.mutate).toHaveBeenCalledWith({ orgId: "org-1" });
  });

  test("disables the button while the mutation is pending", () => {
    h.isPending = true;
    renderWithProviders(<ManageBillingButton orgId="org-1" />);
    expect(
      screen.getByRole("button", { name: "Manage billing" }),
    ).toBeDisabled();
  });

  test("redirects to the returned portal url on success", () => {
    renderWithProviders(<ManageBillingButton orgId="org-1" />);
    h.options?.mutation?.onSuccess?.({
      url: "https://billing.stripe.com/session",
    });
    expect(window.location.href).toBe("https://billing.stripe.com/session");
  });
});
