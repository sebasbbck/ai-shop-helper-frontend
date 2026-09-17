import { beforeEach, describe, expect, test, vi } from "vitest";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import { renderWithProviders } from "./test-utils";
import ReferralOverviewCard from "@/features/referrals/ReferralOverviewCard";
import type { ReferralOverview } from "@/api/model";

const overview: ReferralOverview = {
  code: "ABC123",
  share_url: "https://app.example.com/r/ABC123",
  reward: { referrer_credits: 100, referee_credits: 50, monthly_cap: 5 },
  rewarded_this_month: 2,
  referrals: [],
};

describe("ReferralOverviewCard", () => {
  const writeText = vi.fn().mockResolvedValue(undefined);

  beforeEach(() => {
    writeText.mockClear();
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });
  });

  test("shows the share url and monthly progress", () => {
    renderWithProviders(<ReferralOverviewCard overview={overview} />);
    expect(
      screen.getByDisplayValue("https://app.example.com/r/ABC123"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("2 of 5 rewards earned this month."),
    ).toBeInTheDocument();
  });

  test("copies the share url and shows a confirmation that reverts after a delay", async () => {
    renderWithProviders(<ReferralOverviewCard overview={overview} />);

    fireEvent.click(screen.getByRole("button", { name: "Copy" }));

    expect(writeText).toHaveBeenCalledWith("https://app.example.com/r/ABC123");
    expect(
      await screen.findByRole("button", { name: "Copied" }),
    ).toBeInTheDocument();

    await waitFor(
      () =>
        expect(
          screen.getByRole("button", { name: "Copy" }),
        ).toBeInTheDocument(),
      { timeout: 3000 },
    );
  });
});
