import { beforeEach, describe, expect, test, vi } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "./test-utils";
import RunHistory from "@/features/agents/RunHistory";

type Run = { id: string; status: string; created_at: string };

const h = vi.hoisted(() => ({
  runs: undefined as Run[] | undefined,
  isLoading: false,
}));

vi.mock("@/api/endpoints/agent-runs/agent-runs", () => ({
  useAgentRunsListProjectRuns: () => ({
    data: h.runs,
    isLoading: h.isLoading,
  }),
}));

beforeEach(() => {
  h.runs = undefined;
  h.isLoading = false;
});

describe("RunHistory", () => {
  test("shows skeletons while loading", () => {
    h.isLoading = true;
    const { container } = renderWithProviders(
      <RunHistory projectId="project-1" />,
    );
    expect(
      container.querySelectorAll(".MuiSkeleton-root").length,
    ).toBeGreaterThan(0);
  });

  test("shows the empty state when there are no runs", () => {
    h.runs = [];
    renderWithProviders(<RunHistory projectId="project-1" />);
    expect(screen.getByText("No runs yet")).toBeInTheDocument();
  });

  test("sorts runs newest first and labels the status", () => {
    h.runs = [
      { id: "run-1", status: "success", created_at: "2026-09-01T00:00:00Z" },
      {
        id: "run-2",
        status: "awaiting_input",
        created_at: "2026-09-05T00:00:00Z",
      },
    ];
    renderWithProviders(<RunHistory projectId="project-1" />);

    const labels = screen
      .getAllByText(/success|awaiting input/)
      .map((el) => el.textContent);
    expect(labels).toEqual(["awaiting input", "success"]);
  });

  test("colors a failed run's status chip as an error", () => {
    h.runs = [
      { id: "run-1", status: "failed", created_at: "2026-09-01T00:00:00Z" },
    ];
    const { container } = renderWithProviders(
      <RunHistory projectId="project-1" />,
    );
    expect(container.querySelector(".MuiChip-colorError")).toBeInTheDocument();
  });
});
