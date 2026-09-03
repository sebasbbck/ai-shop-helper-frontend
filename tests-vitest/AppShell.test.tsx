import { beforeEach, describe, expect, test, vi } from "vitest";
import { fireEvent, screen } from "@testing-library/react";
import { renderWithProviders } from "./test-utils";
import AppShell from "@/components/layout/AppShell";

vi.mock("@/components/layout/Sidebar", () => ({
  default: ({
    collapsed,
    onToggleCollapse,
  }: {
    collapsed: boolean;
    onToggleCollapse: () => void;
  }) => (
    <div>
      <span data-testid="collapsed">{String(collapsed)}</span>
      <button onClick={onToggleCollapse}>toggle</button>
    </div>
  ),
}));

vi.mock("@/components/layout/Topbar", () => ({
  default: () => <div />,
}));

describe("AppShell", () => {
  beforeEach(() => localStorage.clear());

  test("sidebar starts expanded by default", () => {
    renderWithProviders(<AppShell>content</AppShell>);

    expect(screen.getByTestId("collapsed")).toHaveTextContent("false");
    expect(screen.getByText("content")).toBeInTheDocument();
  });

  test("reads the persisted collapsed state", () => {
    localStorage.setItem("sidebar_collapsed", "true");

    renderWithProviders(<AppShell>content</AppShell>);

    expect(screen.getByTestId("collapsed")).toHaveTextContent("true");
  });

  test("toggling collapse persists to localStorage", () => {
    renderWithProviders(<AppShell>content</AppShell>);

    fireEvent.click(screen.getByText("toggle"));

    expect(screen.getByTestId("collapsed")).toHaveTextContent("true");
    expect(localStorage.getItem("sidebar_collapsed")).toBe("true");
  });
});
