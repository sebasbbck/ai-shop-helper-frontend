import { describe, expect, test } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "./test-utils";
import ReferralsTable from "@/features/referrals/ReferralsTable";
import type { ReferralPublic } from "@/api/model";

function makeReferral(overrides: Partial<ReferralPublic> = {}): ReferralPublic {
  return {
    id: "ref-1",
    status: "pending",
    referee_org_id: "org-2",
    qualified_at: null,
    rewarded_at: null,
    referrer_credits: null,
    referee_credits: null,
    created_at: "2026-09-01T00:00:00Z",
    ...overrides,
  };
}

describe("ReferralsTable", () => {
  test("shows the empty state when there are no referrals", () => {
    renderWithProviders(<ReferralsTable referrals={[]} />);
    expect(
      screen.getByText("No referrals yet. Share your link to get started."),
    ).toBeInTheDocument();
  });

  test("shows the reward amount for a rewarded referral", () => {
    renderWithProviders(
      <ReferralsTable
        referrals={[
          makeReferral({
            id: "ref-1",
            status: "rewarded",
            referrer_credits: 100,
          }),
        ]}
      />,
    );
    expect(screen.getByText("Rewarded")).toBeInTheDocument();
    expect(screen.getByText("+100")).toBeInTheDocument();
  });

  test("shows a dash for referrals without a paid-out reward", () => {
    renderWithProviders(
      <ReferralsTable
        referrals={[makeReferral({ id: "ref-1", status: "pending" })]}
      />,
    );
    expect(screen.getByText("Pending")).toBeInTheDocument();
    expect(screen.getByText("—")).toBeInTheDocument();
  });

  test("shows the capped status label", () => {
    renderWithProviders(
      <ReferralsTable
        referrals={[makeReferral({ id: "ref-1", status: "capped" })]}
      />,
    );
    expect(screen.getByText("Capped")).toBeInTheDocument();
  });
});
