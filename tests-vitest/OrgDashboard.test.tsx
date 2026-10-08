import { beforeEach, describe, expect, test, vi } from "vitest";
import { fireEvent, screen } from "@testing-library/react";
import { renderWithProviders } from "./test-utils";
import { makeActiveContext } from "./mocks/active-context";
import { makeRouter } from "./mocks/router";
import OrgDashboard from "@/features/org/OrgDashboard";
import type { ProjectPublic } from "@/api/model/projectPublic";

const h = vi.hoisted(() => ({
  push: vi.fn(),
  setActiveProject: vi.fn(),
  projects: [] as Partial<ProjectPublic>[],
}));

vi.mock("next/navigation", () => ({
  useRouter: () => makeRouter({ push: h.push }),
}));

vi.mock("@/features/shell/ActiveContext", () => ({
  useActiveContext: () =>
    makeActiveContext({
      activeOrg: { name: "Acme", projects: h.projects as ProjectPublic[] },
      setActiveProject: h.setActiveProject,
    }),
}));

vi.mock("@/api/endpoints/project-types/project-types", () => ({
  useProjectTypesGetProjectTypes: () => ({
    data: { items: [{ id: "pt-1", name: "WooCommerce" }] },
  }),
}));

vi.mock("@/components/layout/CreateProjectDialog", () => ({
  default: ({ open }: { open: boolean }) => (
    <div data-testid="create-project-dialog">{String(open)}</div>
  ),
}));

beforeEach(() => {
  h.push.mockClear();
  h.setActiveProject.mockClear();
  h.projects = [];
});

describe("OrgDashboard", () => {
  test("shows the empty state when there are no projects", () => {
    renderWithProviders(<OrgDashboard />);
    expect(screen.getByText("No projects yet")).toBeInTheDocument();
  });

  test("renders a card per project, resolving the type name", () => {
    h.projects = [
      { id: "p1", name: "My Store", project_type_id: "pt-1" },
      { id: "p2", name: "Other Store", project_type_id: "unknown-type" },
    ];
    renderWithProviders(<OrgDashboard />);

    expect(screen.getByText("My Store")).toBeInTheDocument();
    expect(screen.getByText("WooCommerce")).toBeInTheDocument();
    expect(screen.getByText("Other Store")).toBeInTheDocument();
    expect(screen.getByText("unknown-type")).toBeInTheDocument();
  });

  test("opens the create-project dialog", () => {
    h.projects = [{ id: "p1", name: "My Store", project_type_id: "pt-1" }];
    renderWithProviders(<OrgDashboard />);
    expect(screen.getByTestId("create-project-dialog").textContent).toBe(
      "false",
    );
    fireEvent.click(screen.getByRole("button", { name: "New project" }));
    expect(screen.getByTestId("create-project-dialog").textContent).toBe(
      "true",
    );
  });

  test("selects a project and navigates to it when opened", () => {
    h.projects = [{ id: "p1", name: "My Store", project_type_id: "pt-1" }];
    renderWithProviders(<OrgDashboard />);

    fireEvent.click(screen.getByRole("button", { name: /My Store/ }));

    expect(h.setActiveProject).toHaveBeenCalledWith("p1");
    expect(h.push).toHaveBeenCalledWith("/project");
  });
});
