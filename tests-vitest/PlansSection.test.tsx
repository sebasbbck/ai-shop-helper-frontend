import { beforeEach, describe, expect, test, vi } from "vitest";
import { fireEvent, screen } from "@testing-library/react";
import { renderWithProviders } from "./test-utils";
import PlansSection from "@/features/billing/PlansSection";
import type { CatalogResponse } from "@/api/model";

type CheckoutOptions = {
  mutation?: { onSuccess?: (res: { url: string }) => void };
};

const catalog: CatalogResponse = {
  free_credits: 100,
  plans: [
    {
      key: "starter",
      name: "Starter",
      credits: 1000,
      unit_amount: 1999,
      currency: "USD",
    },
  ],
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

describe("PlansSection", () => {
  const originalLocation = window.location;

  beforeEach(() => {
    Object.defineProperty(window, "location", {
      configurable: true,
      value: { ...originalLocation, href: "" },
    });
  });

  test("shows a spinner while loading", () => {
    h.isLoading = true;
    renderWithProviders(<PlansSection orgId="org-1" />);
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  test("renders nothing without data", () => {
    const { container } = renderWithProviders(<PlansSection orgId="org-1" />);
    expect(container).toBeEmptyDOMElement();
  });

  test("shows the free-credits note when there are free credits", () => {
    h.data = catalog;
    renderWithProviders(<PlansSection orgId="org-1" />);
    expect(
      screen.getByText("New accounts start with 100 free credits"),
    ).toBeInTheDocument();
  });

  test("omits the free-credits note when there are none", () => {
    h.data = { ...catalog, free_credits: 0 };
    renderWithProviders(<PlansSection orgId="org-1" />);
    expect(
      screen.queryByText(/New accounts start with/),
    ).not.toBeInTheDocument();
  });

  test("renders each plan with its formatted price", () => {
    h.data = catalog;
    renderWithProviders(<PlansSection orgId="org-1" />);
    expect(screen.getByText("Starter")).toBeInTheDocument();
    expect(screen.getByText("$19.99")).toBeInTheDocument();
  });

  test("starts checkout for the clicked plan", () => {
    h.data = catalog;
    renderWithProviders(<PlansSection orgId="org-1" />);
    fireEvent.click(screen.getByRole("button", { name: "Subscribe" }));
    expect(h.mutate).toHaveBeenCalledWith({
      orgId: "org-1",
      data: { plan_key: "starter" },
    });
  });

  test("redirects to the checkout url on success", () => {
    h.data = catalog;
    renderWithProviders(<PlansSection orgId="org-1" />);
    h.options?.mutation?.onSuccess?.({
      url: "https://checkout.stripe.com/session",
    });
    expect(window.location.href).toBe("https://checkout.stripe.com/session");
  });
});
