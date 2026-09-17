import { describe, expect, test, vi } from "vitest";
import { fireEvent, screen } from "@testing-library/react";
import { renderWithProviders } from "./test-utils";
import AgentCard from "@/features/project/AgentCard";

describe("AgentCard", () => {
  test("shows the agent name and description", () => {
    renderWithProviders(
      <AgentCard
        name="Blog Writer"
        description="Generates SEO blog posts."
        onOpen={vi.fn()}
      />,
    );
    expect(screen.getByText("Blog Writer")).toBeInTheDocument();
    expect(screen.getByText("Generates SEO blog posts.")).toBeInTheDocument();
  });

  test("omits the description when there is none", () => {
    renderWithProviders(
      <AgentCard name="Blog Writer" description={null} onOpen={vi.fn()} />,
    );
    expect(screen.getByText("Blog Writer")).toBeInTheDocument();
    expect(
      screen.queryByText("Generates SEO blog posts."),
    ).not.toBeInTheDocument();
  });

  test("calls onOpen when the open button is clicked", () => {
    const onOpen = vi.fn();
    renderWithProviders(
      <AgentCard name="Blog Writer" description={null} onOpen={onOpen} />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Open" }));
    expect(onOpen).toHaveBeenCalledTimes(1);
  });
});
