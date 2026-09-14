import { beforeEach, describe, expect, test, vi } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "./test-utils";
import ProjectSettings from "@/features/project/ProjectSettings";

const h = vi.hoisted(() => ({
  available: [] as { connection_type: string; connected: boolean }[],
}));

vi.mock("@/features/shell/ActiveContext", () => ({
  useActiveContext: () => ({
    activeOrgId: "org-1",
    activeProjectId: "project-1",
    activeProject: {
      id: "project-1",
      name: "My Project",
      project_type_id: "pt-1",
    },
  }),
}));

vi.mock("@/api/endpoints/projects/projects", () => ({
  useProjectsUpdateProject: () => ({ mutate: vi.fn(), isPending: false }),
}));

vi.mock("@/api/endpoints/project-types/project-types", () => ({
  useProjectTypesGetProjectTypes: () => ({ data: { items: [] } }),
}));

vi.mock("@/api/endpoints/orgs/orgs", () => ({
  getOrgsGetMyOrgsQueryKey: () => ["orgs"],
}));

vi.mock("@/api/endpoints/connections/connections", () => ({
  useConnectionsGetAvailableConnections: () => ({ data: h.available }),
}));

vi.mock("@/features/project/ProjectContextSection", () => ({
  default: () => <div data-testid="project-context-section" />,
}));

vi.mock("@/features/project/WordpressConnectionSection", () => ({
  default: () => <div data-testid="wordpress-section" />,
}));

vi.mock("@/features/project/GoogleConnectionSection", () => ({
  default: () => <div data-testid="google-section" />,
}));

describe("ProjectSettings connection sections", () => {
  beforeEach(() => {
    h.available = [];
  });

  test("renders a section for each relevant connection type", () => {
    h.available = [
      { connection_type: "wordpress", connected: false },
      { connection_type: "google", connected: false },
    ];

    renderWithProviders(<ProjectSettings />);

    expect(screen.getByTestId("wordpress-section")).toBeInTheDocument();
    expect(screen.getByTestId("google-section")).toBeInTheDocument();
  });

  test("both connection types coexist even when connected (no exclusivity)", () => {
    h.available = [
      { connection_type: "wordpress", connected: true },
      { connection_type: "google", connected: true },
    ];

    renderWithProviders(<ProjectSettings />);

    expect(screen.getByTestId("wordpress-section")).toBeInTheDocument();
    expect(screen.getByTestId("google-section")).toBeInTheDocument();
  });

  test("renders only the relevant types", () => {
    h.available = [{ connection_type: "wordpress", connected: false }];

    renderWithProviders(<ProjectSettings />);

    expect(screen.getByTestId("wordpress-section")).toBeInTheDocument();
    expect(screen.queryByTestId("google-section")).not.toBeInTheDocument();
  });

  test("renders no connection sections when none are relevant", () => {
    h.available = [];

    renderWithProviders(<ProjectSettings />);

    expect(screen.queryByTestId("wordpress-section")).not.toBeInTheDocument();
    expect(screen.queryByTestId("google-section")).not.toBeInTheDocument();
  });

  test("ignores connection types without a section component", () => {
    h.available = [{ connection_type: "notifuse", connected: false }];

    renderWithProviders(<ProjectSettings />);

    expect(screen.queryByTestId("wordpress-section")).not.toBeInTheDocument();
    expect(screen.queryByTestId("google-section")).not.toBeInTheDocument();
  });
});
