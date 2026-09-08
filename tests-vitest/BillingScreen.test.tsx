import { beforeEach, describe, expect, test, vi } from "vitest";
import { fireEvent, screen } from "@testing-library/react";
import { renderWithProviders } from "./test-utils";
import BillingScreen from "@/features/billing/BillingScreen";

const h = vi.hoisted(() => ({
  push: vi.fn(),
  replace: vi.fn(),
  params: new URLSearchParams(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: h.push, replace: h.replace, prefetch: vi.fn() }),
  useSearchParams: () => h.params,
}));

vi.mock("@/features/shell/ActiveContext", () => ({
  useActiveContext: () => ({ activeOrgId: "org-1" }),
}));

vi.mock("@/api/endpoints/billing/billing", () => ({
  useBillingConfirmCheckout: (options: {
    mutation?: {
      onSuccess?: (data: undefined, vars: { orgId: string }) => void;
    };
  }) => ({
    mutate: (vars: { orgId: string }) =>
      options.mutation?.onSuccess?.(undefined, vars),
  }),
  getBillingGetBalanceQueryKey: () => ["balance"],
  getBillingGetLedgerQueryKey: () => ["ledger"],
}));

vi.mock("@/features/billing/BillingOverview", () => ({ default: () => null }));
vi.mock("@/features/billing/PlansSection", () => ({ default: () => null }));
vi.mock("@/features/billing/TopupCard", () => ({ default: () => null }));
vi.mock("@/features/billing/LedgerTable", () => ({ default: () => null }));
vi.mock("@/features/billing/ManageBillingButton", () => ({
  default: () => null,
}));

beforeEach(() => {
  h.push.mockClear();
  h.replace.mockClear();
  h.params = new URLSearchParams();
});

describe("BillingScreen checkout confirmation", () => {
  test("confirms the session and redirects to /billing on success", async () => {
    h.params = new URLSearchParams("session_id=sess_123");
    renderWithProviders(<BillingScreen />);

    await vi.waitFor(() => {
      expect(h.replace).toHaveBeenCalledWith("/billing");
    });
    expect(
      await screen.findByText(
        "Payment complete — credits have been added to your account.",
      ),
    ).toBeInTheDocument();
  });
});

describe("BillingScreen onboarding banner", () => {
  test("hidden by default", () => {
    renderWithProviders(<BillingScreen />);

    expect(
      screen.queryByText(
        "Your organization is ready. Pick a plan now, or continue and do it later.",
      ),
    ).not.toBeInTheDocument();
  });

  test("shown with a continue button when ?onboarding=1, navigates to /org", () => {
    h.params = new URLSearchParams("onboarding=1");
    renderWithProviders(<BillingScreen />);

    expect(
      screen.getByText(
        "Your organization is ready. Pick a plan now, or continue and do it later.",
      ),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Continue" }));
    expect(h.push).toHaveBeenCalledWith("/org");
  });
});
