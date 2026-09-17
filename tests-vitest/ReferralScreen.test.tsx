import { beforeEach, describe, expect, test, vi } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "./test-utils";
import { makeActiveContext } from "./mocks/active-context";
import ReferralScreen from "@/features/referrals/ReferralScreen";
import type { ReferralOverview } from "@/api/model";

const h = vi.hoisted(() => ({
  activeOrgId: null as string | null,
  data: undefined as ReferralOverview | undefined,
  isLoading: false,
}));

vi.mock("@/features/shell/ActiveContext", () => ({
  useActiveContext: () => makeActiveContext({ activeOrgId: h.activeOrgId }),
}));

vi.mock("@/api/endpoints/referrals/referrals", () => ({
  useReferralsGetReferralOverview: () => ({
    data: h.data,
    isLoading: h.isLoading,
  }),
}));

vi.mock("@/features/referrals/ReferralOverviewCard", () => ({
  default: () => <div data-testid="overview-card" />,
}));

vi.mock("@/features/referrals/ReferralsTable", () => ({
  default: () => <div data-testid="referrals-table" />,
}));

beforeEach(() => {
  h.activeOrgId = "org-1";
  h.data = undefined;
  h.isLoading = false;
});

describe("ReferralScreen", () => {
  test("renders nothing without an active org", () => {
    h.activeOrgId = null;
    const { container } = renderWithProviders(<ReferralScreen />);
    expect(container).toBeEmptyDOMElement();
  });

  test("shows a spinner while loading", () => {
    h.isLoading = true;
    renderWithProviders(<ReferralScreen />);
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
    expect(screen.queryByTestId("overview-card")).not.toBeInTheDocument();
  });

  test("renders the overview and table once data is loaded", () => {
    h.data = {
      code: "ABC123",
      share_url: "https://app.example.com/r/ABC123",
      reward: { referrer_credits: 100, referee_credits: 50, monthly_cap: 5 },
      rewarded_this_month: 0,
      referrals: [],
    };
    renderWithProviders(<ReferralScreen />);
    expect(screen.getByTestId("overview-card")).toBeInTheDocument();
    expect(screen.getByTestId("referrals-table")).toBeInTheDocument();
  });
});
