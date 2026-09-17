import { beforeEach, describe, expect, test, vi } from "vitest";
import { fireEvent, screen } from "@testing-library/react";
import { renderWithProviders } from "./test-utils";
import { makeActiveContext } from "./mocks/active-context";
import { makeRouter } from "./mocks/router";
import ProjectDashboard from "@/features/project/ProjectDashboard";

const h = vi.hoisted(() => ({
  push: vi.fn(),
  contextLoading: false,
  activeProject: undefined as { id: string; name: string } | undefined,
  activeProjectTypeId: null as string | null,
  agents: [] as { id: string; name: string; description: string | null }[],
  agentsLoading: false,
}));

vi.mock("next/navigation", () => ({
  useRouter: () => makeRouter({ push: h.push }),
}));

vi.mock("@/features/shell/ActiveContext", () => ({
  useActiveContext: () =>
    makeActiveContext({
      activeProject: h.activeProject,
      activeProjectTypeId: h.activeProjectTypeId,
      isLoading: h.contextLoading,
    }),
}));

vi.mock("@/api/endpoints/project-types/project-types", () => ({
  useProjectTypesGetProjectTypes: () => ({
    data: { items: [{ id: "pt-1", name: "WooCommerce" }] },
  }),
}));

vi.mock("@/api/endpoints/agents/agents", () => ({
  useAgentsGetAgents: () => ({
    data: { items: h.agents },
    isLoading: h.agentsLoading,
  }),
}));

beforeEach(() => {
  h.push.mockClear();
  h.contextLoading = false;
  h.activeProject = undefined;
  h.activeProjectTypeId = null;
  h.agents = [];
  h.agentsLoading = false;
});

describe("ProjectDashboard", () => {
  test("shows skeletons while the active context is loading", () => {
    h.contextLoading = true;
    const { container } = renderWithProviders(<ProjectDashboard />);
    expect(
      container.querySelectorAll(".MuiSkeleton-root").length,
    ).toBeGreaterThan(0);
  });

  test("shows the empty state when there is no active project", () => {
    renderWithProviders(<ProjectDashboard />);
    expect(screen.getByText("No project selected")).toBeInTheDocument();
  });

  test("shows the project name, type and agent count", () => {
    h.activeProject = { id: "project-1", name: "My Store" };
    h.activeProjectTypeId = "pt-1";
    renderWithProviders(<ProjectDashboard />);

    expect(screen.getByText("My Store")).toBeInTheDocument();
    expect(screen.getByText("WooCommerce")).toBeInTheDocument();
    expect(screen.getByText("No agents available")).toBeInTheDocument();
  });

  test("shows skeletons while the agents list is loading", () => {
    h.activeProject = { id: "project-1", name: "My Store" };
    h.activeProjectTypeId = "pt-1";
    h.agentsLoading = true;
    const { container } = renderWithProviders(<ProjectDashboard />);
    expect(
      container.querySelectorAll(".MuiSkeleton-root").length,
    ).toBeGreaterThan(0);
  });

  test("renders a card per agent and navigates to it when opened", () => {
    h.activeProject = { id: "project-1", name: "My Store" };
    h.activeProjectTypeId = "pt-1";
    h.agents = [
      { id: "agent-1", name: "Blog Writer", description: null },
      { id: "agent-2", name: "Custom Agent", description: "Does things." },
    ];
    renderWithProviders(<ProjectDashboard />);

    expect(screen.getByText("Blog Writer")).toBeInTheDocument();
    expect(screen.getByText("Custom Agent")).toBeInTheDocument();
    expect(screen.getByText("Does things.")).toBeInTheDocument();

    fireEvent.click(screen.getAllByRole("button", { name: "Open" })[0]);
    expect(h.push).toHaveBeenCalledWith("/agents/agent-1");
  });
});
