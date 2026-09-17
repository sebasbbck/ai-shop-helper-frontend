import { beforeEach, describe, expect, test, vi } from "vitest";
import { act, screen } from "@testing-library/react";
import { renderWithProviders } from "./test-utils";
import { makeActiveContext } from "./mocks/active-context";
import { makeRouter } from "./mocks/router";
import BillingScreen from "@/features/billing/BillingScreen";

type ConfirmOptions = {
  mutation?: {
    onSuccess?: (
      res: unknown,
      variables: { orgId: string; data: { session_id: string } },
    ) => void;
    onError?: () => void;
  };
};

const h = vi.hoisted(() => ({
  activeOrgId: null as string | null,
  sessionId: null as string | null,
  replace: vi.fn(),
  confirmMutate: vi.fn(),
  options: undefined as ConfirmOptions | undefined,
}));

vi.mock("next/navigation", () => ({
  useRouter: () => makeRouter({ replace: h.replace }),
  useSearchParams: () =>
    new URLSearchParams(h.sessionId ? { session_id: h.sessionId } : {}),
}));

vi.mock("@/features/shell/ActiveContext", () => ({
  useActiveContext: () => makeActiveContext({ activeOrgId: h.activeOrgId }),
}));

vi.mock("@/api/endpoints/billing/billing", () => ({
  getBillingGetBalanceQueryKey: (orgId: string) => [
    "billing",
    "balance",
    orgId,
  ],
  getBillingGetLedgerQueryKey: (orgId: string) => ["billing", "ledger", orgId],
  useBillingConfirmCheckout: (options: ConfirmOptions) => {
    h.options = options;
    return { mutate: h.confirmMutate };
  },
}));

vi.mock("@/features/billing/BillingOverview", () => ({
  default: () => <div data-testid="billing-overview" />,
}));
vi.mock("@/features/billing/PlansSection", () => ({
  default: () => <div data-testid="plans-section" />,
}));
vi.mock("@/features/billing/TopupCard", () => ({
  default: () => <div data-testid="topup-card" />,
}));
vi.mock("@/features/billing/LedgerTable", () => ({
  default: () => <div data-testid="ledger-table" />,
}));
vi.mock("@/features/billing/ManageBillingButton", () => ({
  default: () => <div data-testid="manage-billing-button" />,
}));

beforeEach(() => {
  h.activeOrgId = "org-1";
  h.sessionId = null;
  h.replace.mockClear();
  h.confirmMutate.mockClear();
  h.options = undefined;
});

describe("BillingScreen", () => {
  test("renders nothing without an active org", () => {
    h.activeOrgId = null;
    const { container } = renderWithProviders(<BillingScreen />);
    expect(container).toBeEmptyDOMElement();
  });

  test("renders every billing section for the active org", () => {
    renderWithProviders(<BillingScreen />);
    expect(screen.getByText("Billing")).toBeInTheDocument();
    expect(screen.getByTestId("billing-overview")).toBeInTheDocument();
    expect(screen.getByTestId("plans-section")).toBeInTheDocument();
    expect(screen.getByTestId("topup-card")).toBeInTheDocument();
    expect(screen.getByTestId("ledger-table")).toBeInTheDocument();
    expect(screen.getByTestId("manage-billing-button")).toBeInTheDocument();
    expect(h.confirmMutate).not.toHaveBeenCalled();
  });

  test("confirms the checkout session found in the url", () => {
    h.sessionId = "cs_test_123";
    renderWithProviders(<BillingScreen />);
    expect(h.confirmMutate).toHaveBeenCalledWith({
      orgId: "org-1",
      data: { session_id: "cs_test_123" },
    });
  });

  test("shows a success alert and clears the url on confirmation", async () => {
    h.sessionId = "cs_test_123";
    renderWithProviders(<BillingScreen />);
    await act(async () => {
      await h.options?.mutation?.onSuccess?.(undefined, {
        orgId: "org-1",
        data: { session_id: "cs_test_123" },
      });
    });
    expect(
      screen.getByText(
        "Payment complete — credits have been added to your account.",
      ),
    ).toBeInTheDocument();
    expect(h.replace).toHaveBeenCalledWith("/billing");
  });

  test("shows a pending alert when confirmation fails", () => {
    h.sessionId = "cs_test_123";
    renderWithProviders(<BillingScreen />);
    act(() => {
      h.options?.mutation?.onError?.();
    });
    expect(
      screen.getByText(
        "We're confirming your payment. Credits will be added shortly.",
      ),
    ).toBeInTheDocument();
    expect(h.replace).toHaveBeenCalledWith("/billing");
  });
});
