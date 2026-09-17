import { beforeEach, describe, expect, test, vi } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "./test-utils";
import BillingOverview from "@/features/billing/BillingOverview";
import type { BalanceResponse } from "@/api/model";

const h = vi.hoisted(() => ({
  data: undefined as BalanceResponse | undefined,
  isLoading: false,
}));

vi.mock("@/api/endpoints/billing/billing", () => ({
  useBillingGetBalance: () => ({ data: h.data, isLoading: h.isLoading }),
}));

beforeEach(() => {
  h.data = undefined;
  h.isLoading = false;
});

describe("BillingOverview", () => {
  test("shows a spinner while loading", () => {
    h.isLoading = true;
    renderWithProviders(<BillingOverview orgId="org-1" />);
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  test("renders nothing without data", () => {
    const { container } = renderWithProviders(
      <BillingOverview orgId="org-1" />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  test("shows the formatted balance breakdown", () => {
    h.data = {
      subscription_credits: 1234,
      purchased_credits: 500,
      total: 1734,
    };
    renderWithProviders(<BillingOverview orgId="org-1" />);

    expect(screen.getByText("1734")).toBeInTheDocument();
    expect(
      screen.getByText("Subscription: 1234 · Purchased: 500"),
    ).toBeInTheDocument();
  });
});
