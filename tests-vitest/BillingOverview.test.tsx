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

    // The component uses toLocaleString() with the runtime's default locale,
    // so build the expected text the same way (es-ES: "1734", en-US: "1,734").
    const fmt = (n: number) => n.toLocaleString();
    expect(screen.getByText(fmt(1734))).toBeInTheDocument();
    expect(
      screen.getByText(`Subscription: ${fmt(1234)} · Purchased: ${fmt(500)}`),
    ).toBeInTheDocument();
  });
});
