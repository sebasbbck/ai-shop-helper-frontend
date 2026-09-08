import { describe, expect, test, vi } from "vitest";
import { fireEvent, screen } from "@testing-library/react";
import { renderWithProviders } from "./test-utils";
import AgentCard from "@/features/project/AgentCard";

describe("AgentCard", () => {
  test("clicking anywhere on the card triggers onOpen", () => {
    const onOpen = vi.fn();
    renderWithProviders(
      <AgentCard
        name="SEO Agent"
        description="Improves rankings"
        onOpen={onOpen}
      />,
    );

    fireEvent.click(screen.getByRole("button"));

    expect(onOpen).toHaveBeenCalledTimes(1);
  });

  test("renders without a description", () => {
    renderWithProviders(
      <AgentCard name="SEO Agent" description={null} onOpen={vi.fn()} />,
    );

    expect(screen.getByText("SEO Agent")).toBeInTheDocument();
  });
});
