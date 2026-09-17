import { beforeEach, describe, expect, test, vi } from "vitest";
import { fireEvent, screen } from "@testing-library/react";
import { renderWithProviders } from "./test-utils";
import TopupCard from "@/features/billing/TopupCard";
import type { CatalogResponse } from "@/api/model";

type CheckoutOptions = {
  mutation?: { onSuccess?: (res: { url: string }) => void };
};

const catalog: CatalogResponse = {
  free_credits: 0,
  plans: [],
  topup: {
    currency: "USD",
    min_amount: 500,
    max_amount: 20000,
    cents_per_credit: 5,
  },
};

const h = vi.hoisted(() => ({
  data: undefined as CatalogResponse | undefined,
  isLoading: false,
  mutate: vi.fn(),
  isPending: false,
  options: undefined as CheckoutOptions | undefined,
}));

vi.mock("@/api/endpoints/billing/billing", () => ({
  useBillingGetCatalog: () => ({ data: h.data, isLoading: h.isLoading }),
  useBillingCreateCheckout: (options: CheckoutOptions) => {
    h.options = options;
    return { mutate: h.mutate, isPending: h.isPending };
  },
}));

beforeEach(() => {
  h.data = undefined;
  h.isLoading = false;
  h.mutate.mockClear();
  h.isPending = false;
  h.options = undefined;
});

describe("TopupCard", () => {
  const originalLocation = window.location;

  beforeEach(() => {
    Object.defineProperty(window, "location", {
      configurable: true,
      value: { ...originalLocation, href: "" },
    });
  });

  test("shows a spinner while loading", () => {
    h.isLoading = true;
    renderWithProviders(<TopupCard orgId="org-1" />);
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  test("renders nothing without data", () => {
    const { container } = renderWithProviders(<TopupCard orgId="org-1" />);
    expect(container).toBeEmptyDOMElement();
  });

  test("disables the buy button until an amount is entered", () => {
    h.data = catalog;
    renderWithProviders(<TopupCard orgId="org-1" />);
    expect(screen.getByRole("button", { name: "Buy credits" })).toBeDisabled();
  });

  test("shows a live credits preview as the amount changes", () => {
    h.data = catalog;
    renderWithProviders(<TopupCard orgId="org-1" />);
    fireEvent.change(screen.getByLabelText("€ (5–200)"), {
      target: { value: "10" },
    });
    expect(screen.getByText("≈ 200 credits")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Buy credits" })).toBeEnabled();
  });

  test("starts checkout for the topup plan with the entered amount", () => {
    h.data = catalog;
    renderWithProviders(<TopupCard orgId="org-1" />);
    fireEvent.change(screen.getByLabelText("€ (5–200)"), {
      target: { value: "10" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Buy credits" }));
    expect(h.mutate).toHaveBeenCalledWith({
      orgId: "org-1",
      data: { plan_key: "topup" },
    });
  });

  test("redirects to the checkout url on success", () => {
    h.data = catalog;
    renderWithProviders(<TopupCard orgId="org-1" />);
    h.options?.mutation?.onSuccess?.({
      url: "https://checkout.stripe.com/session",
    });
    expect(window.location.href).toBe("https://checkout.stripe.com/session");
  });
});
