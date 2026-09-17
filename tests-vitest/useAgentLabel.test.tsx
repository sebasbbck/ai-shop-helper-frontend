import { describe, expect, test } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "./test-utils";
import { useAgentLabel } from "@/features/agents/use-agent-label";

function Probe({
  name,
  description,
}: {
  name: string;
  description?: string | null;
}) {
  const getLabel = useAgentLabel();
  const label = getLabel(name, description);
  return (
    <div>
      <span data-testid="name">{label.name}</span>
      <span data-testid="description">{label.description}</span>
    </div>
  );
}

describe("useAgentLabel", () => {
  test("translates a known agent by slug", () => {
    renderWithProviders(<Probe name="Blog Writer" description="fallback" />);
    expect(screen.getByTestId("name").textContent).toBe("Blog Writer");
    expect(screen.getByTestId("description").textContent).toBe(
      "Generate SEO blog posts for your store.",
    );
  });

  test("falls back to the raw name/description for unknown agents", () => {
    renderWithProviders(
      <Probe name="Custom Agent" description="Custom description" />,
    );
    expect(screen.getByTestId("name").textContent).toBe("Custom Agent");
    expect(screen.getByTestId("description").textContent).toBe(
      "Custom description",
    );
  });

  test("falls back to an empty description when none is given", () => {
    renderWithProviders(<Probe name="Custom Agent" />);
    expect(screen.getByTestId("description").textContent).toBe("");
  });
});
