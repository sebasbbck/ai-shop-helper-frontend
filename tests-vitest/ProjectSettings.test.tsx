import { beforeEach, describe, expect, test, vi } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "./test-utils";
import ProjectSettings from "@/features/project/ProjectSettings";

const h = vi.hoisted(() => ({
  wpConnected: false,
  googleConnected: false,
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
  useConnectionsGetWordpressStatus: () => ({
    data: { connected: h.wpConnected },
  }),
  useConnectionsGetGoogleConnectionStatus: () => ({
    data: { connected: h.googleConnected },
  }),
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
    h.wpConnected = false;
    h.googleConnected = false;
  });

  test("shows both connection sections when neither is connected", () => {
    renderWithProviders(<ProjectSettings />);

    expect(screen.getByTestId("wordpress-section")).toBeInTheDocument();
    expect(screen.getByTestId("google-section")).toBeInTheDocument();
  });

  test("hides the Google section and explains why when WordPress is connected", () => {
    h.wpConnected = true;

    renderWithProviders(<ProjectSettings />);

    expect(screen.getByTestId("wordpress-section")).toBeInTheDocument();
    expect(screen.queryByTestId("google-section")).not.toBeInTheDocument();
    expect(
      screen.getByText(
        "This project already has an active WordPress connection. Only one connection can be active at a time.",
      ),
    ).toBeInTheDocument();
  });

  test("hides the WordPress section and explains why when Google is connected", () => {
    h.googleConnected = true;

    renderWithProviders(<ProjectSettings />);

    expect(screen.getByTestId("google-section")).toBeInTheDocument();
    expect(screen.queryByTestId("wordpress-section")).not.toBeInTheDocument();
    expect(
      screen.getByText(
        "This project already has an active Google connection. Only one connection can be active at a time.",
      ),
    ).toBeInTheDocument();
  });
});
