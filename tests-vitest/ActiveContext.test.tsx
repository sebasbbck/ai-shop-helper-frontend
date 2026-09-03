import { beforeEach, describe, expect, test, vi } from "vitest";
import { fireEvent, screen } from "@testing-library/react";
import { renderWithProviders } from "./test-utils";
import {
  ActiveContextProvider,
  useActiveContext,
} from "@/features/shell/ActiveContext";

const orgs = [
  {
    id: "org-1",
    name: "Org One",
    projects: [
      { id: "p-1", project_type_id: "t-1" },
      { id: "p-2", project_type_id: "t-2" },
    ],
  },
  {
    id: "org-2",
    name: "Org Two",
    projects: [{ id: "p-3", project_type_id: "t-3" }],
  },
];

vi.mock("@/api/endpoints/orgs/orgs", () => ({
  useOrgsGetMyOrgs: () => ({ data: { items: orgs }, isLoading: false }),
}));

function Probe() {
  const {
    activeOrgId,
    activeProjectId,
    setActiveOrg,
    setActiveProject,
    selectAfterCreate,
  } = useActiveContext();
  return (
    <div>
      <span data-testid="org">{activeOrgId}</span>
      <span data-testid="project">{activeProjectId}</span>
      <button onClick={() => setActiveOrg("org-2")}>switch org</button>
      <button onClick={() => setActiveProject("p-2")}>switch project</button>
      <button onClick={() => selectAfterCreate("org-2", "p-3")}>
        select after create
      </button>
    </div>
  );
}

function renderProbe() {
  return renderWithProviders(
    <ActiveContextProvider>
      <Probe />
    </ActiveContextProvider>,
  );
}

describe("ActiveContext", () => {
  beforeEach(() => localStorage.clear());

  test("defaults to the first org and its first project", () => {
    renderProbe();

    expect(screen.getByTestId("org")).toHaveTextContent("org-1");
    expect(screen.getByTestId("project")).toHaveTextContent("p-1");
  });

  test("switching org persists it and resolves its first project", () => {
    renderProbe();

    fireEvent.click(screen.getByText("switch org"));

    expect(screen.getByTestId("org")).toHaveTextContent("org-2");
    expect(screen.getByTestId("project")).toHaveTextContent("p-3");
    expect(localStorage.getItem("active_org_id")).toBe("org-2");
  });

  test("switching project persists per-org", () => {
    renderProbe();

    fireEvent.click(screen.getByText("switch project"));

    expect(screen.getByTestId("project")).toHaveTextContent("p-2");
    expect(
      JSON.parse(localStorage.getItem("active_project_by_org") ?? "{}"),
    ).toEqual({ "org-1": "p-2" });
  });

  test("selectAfterCreate persists org and project", () => {
    renderProbe();

    fireEvent.click(screen.getByText("select after create"));

    expect(screen.getByTestId("org")).toHaveTextContent("org-2");
    expect(screen.getByTestId("project")).toHaveTextContent("p-3");
    expect(localStorage.getItem("active_org_id")).toBe("org-2");
    expect(
      JSON.parse(localStorage.getItem("active_project_by_org") ?? "{}"),
    ).toEqual({ "org-2": "p-3" });
  });

  test("falls back to the first project when the stored map is malformed", () => {
    localStorage.setItem("active_project_by_org", "not-json");

    renderProbe();

    expect(screen.getByTestId("project")).toHaveTextContent("p-1");
  });

  test("restores the persisted org selection on mount", () => {
    localStorage.setItem("active_org_id", "org-2");

    renderProbe();

    expect(screen.getByTestId("org")).toHaveTextContent("org-2");
    expect(screen.getByTestId("project")).toHaveTextContent("p-3");
  });
});
