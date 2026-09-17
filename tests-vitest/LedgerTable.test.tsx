import { beforeEach, describe, expect, test, vi } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "./test-utils";
import LedgerTable from "@/features/billing/LedgerTable";
import type { LedgerEntryPublic } from "@/api/model";

function makeEntry(
  overrides: Partial<LedgerEntryPublic> = {},
): LedgerEntryPublic {
  return {
    id: "led-1",
    amount: 100,
    bucket: "purchased",
    balance_after: 100,
    reason: "purchase",
    created_at: "2026-09-01T00:00:00Z",
    ...overrides,
  };
}

const h = vi.hoisted(() => ({
  data: undefined as { items: LedgerEntryPublic[] } | undefined,
  isLoading: false,
}));

vi.mock("@/api/endpoints/billing/billing", () => ({
  useBillingGetLedger: () => ({ data: h.data, isLoading: h.isLoading }),
}));

beforeEach(() => {
  h.data = undefined;
  h.isLoading = false;
});

describe("LedgerTable", () => {
  test("shows a spinner while loading", () => {
    h.isLoading = true;
    renderWithProviders(<LedgerTable orgId="org-1" />);
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  test("shows the empty state when there are no entries", () => {
    h.data = { items: [] };
    renderWithProviders(<LedgerTable orgId="org-1" />);
    expect(screen.getByText("No transactions yet")).toBeInTheDocument();
  });

  test("shows a positive entry with its translated reason", () => {
    h.data = {
      items: [
        makeEntry({ reason: "purchase", amount: 500, bucket: "purchased" }),
      ],
    };
    renderWithProviders(<LedgerTable orgId="org-1" />);

    expect(screen.getByText("Purchase")).toBeInTheDocument();
    expect(screen.getByText("purchased")).toBeInTheDocument();
    expect(screen.getByText("+500")).toBeInTheDocument();
  });

  test("shows a negative entry without a leading sign", () => {
    h.data = {
      items: [
        makeEntry({ reason: "agent_run", amount: -10, bucket: "subscription" }),
      ],
    };
    renderWithProviders(<LedgerTable orgId="org-1" />);

    expect(screen.getByText("Agent run")).toBeInTheDocument();
    expect(screen.getByText("-10")).toBeInTheDocument();
  });

  test("falls back to the raw reason for an unknown code", () => {
    h.data = { items: [makeEntry({ reason: "mystery_reason" })] };
    renderWithProviders(<LedgerTable orgId="org-1" />);
    expect(screen.getByText("mystery_reason")).toBeInTheDocument();
  });
});
