import type { ComponentProps } from "react";
import { beforeEach, describe, expect, test, vi } from "vitest";
import {
  fireEvent,
  screen,
  waitForElementToBeRemoved,
  within,
} from "@testing-library/react";
import { renderWithProviders } from "./test-utils";
import { makeRouter } from "./mocks/router";
import ProjectSwitcher from "@/components/layout/ProjectSwitcher";

type Project = { id: string; name: string };

const alpha: Project = { id: "p1", name: "Alpha Project" };
const beta: Project = { id: "p2", name: "Beta" };

const h = vi.hoisted(() => ({
  push: vi.fn(),
  pathname: "/project",
  setActiveProject: vi.fn(),
  activeOrg: undefined as
    { projects?: { id: string; name: string }[] } | undefined,
  activeProject: undefined as { id: string; name: string } | undefined,
  activeProjectId: undefined as string | undefined,
}));

vi.mock("next/navigation", () => ({
  useRouter: () => makeRouter({ push: h.push }),
  usePathname: () => h.pathname,
}));

vi.mock("next-intl", async (importOriginal) => ({
  ...(await importOriginal<typeof import("next-intl")>()),
  useTranslations: () => (key: string) => key,
}));

vi.mock("@/features/shell/ActiveContext", () => ({
  useActiveContext: () => ({
    activeOrg: h.activeOrg,
    activeProject: h.activeProject,
    activeProjectId: h.activeProjectId,
    setActiveProject: h.setActiveProject,
  }),
}));

vi.mock("@/components/layout/AgentsNavList", () => ({
  default: ({ collapsed }: { collapsed: boolean }) => (
    <div data-testid="agents-nav-list" data-collapsed={String(collapsed)} />
  ),
}));

vi.mock("@/components/layout/CreateProjectDialog", () => ({
  default: ({ open, onClose }: { open: boolean; onClose: () => void }) =>
    open ? (
      <div data-testid="create-project-dialog">
        <button type="button" onClick={onClose}>
          close dialog
        </button>
      </div>
    ) : null,
}));

function renderSwitcher(
  props: Partial<ComponentProps<typeof ProjectSwitcher>> = {},
) {
  return renderWithProviders(<ProjectSwitcher collapsed={false} {...props} />);
}

const switcherButton = () => screen.getAllByRole("button")[0];
const sectionToggle = () =>
  (
    screen.queryByTestId("ExpandLessIcon") ??
    screen.getByTestId("ExpandMoreIcon")
  ).closest("button")!;
const menu = () => screen.getByRole("menu");
const menuItem = (name: string | RegExp) =>
  within(menu()).getByRole("menuitem", { name });

function openSwitcherMenu() {
  fireEvent.click(switcherButton());
}

beforeEach(() => {
  h.push.mockClear();
  h.setActiveProject.mockClear();
  h.pathname = "/project";
  h.activeOrg = { projects: [alpha, beta] };
  h.activeProject = alpha;
  h.activeProjectId = alpha.id;
});

describe("ProjectSwitcher, expanded", () => {
  test("renders the section header, the active project and the nested lists", () => {
    renderSwitcher();

    expect(screen.getByText("projectSection")).toBeInTheDocument();
    expect(screen.getByText("Alpha Project")).toBeInTheDocument();
    expect(screen.getByTestId("agents-nav-list")).toHaveAttribute(
      "data-collapsed",
      "false",
    );
    expect(
      screen.getByRole("button", { name: "settings" }),
    ).toBeInTheDocument();
  });

  test("shows the initials of the active project in the avatar", () => {
    renderSwitcher();

    expect(switcherButton()).toHaveTextContent("AP");
  });

  test("ignores empty words when building the initials", () => {
    h.activeProject = { id: "p3", name: "Gamma  Delta" };
    renderSwitcher();

    expect(switcherButton()).toHaveTextContent("G");
  });

  test("navigates to the project when its name is clicked", () => {
    renderSwitcher();

    fireEvent.click(screen.getByText("Alpha Project"));

    expect(h.push).toHaveBeenCalledWith("/project");
  });

  test("falls back to a placeholder when no project is active", () => {
    h.activeProject = undefined;
    h.activeProjectId = undefined;
    renderSwitcher();

    expect(screen.getByText("noProjects")).toBeInTheDocument();
    expect(
      within(switcherButton()).getByTestId("FolderIcon"),
    ).toBeInTheDocument();
  });

  test("does not navigate when the placeholder label is clicked", () => {
    h.activeProject = undefined;
    renderSwitcher();

    fireEvent.click(screen.getByText("noProjects"));

    expect(h.push).not.toHaveBeenCalled();
  });

  test("collapses and expands the section", async () => {
    renderSwitcher();

    expect(
      screen.getByRole("button", { name: "settings" }),
    ).toBeInTheDocument();

    fireEvent.click(sectionToggle());

    expect(screen.getByTestId("ExpandMoreIcon")).toBeInTheDocument();
    await waitForElementToBeRemoved(() =>
      screen.queryByRole("button", { name: "settings" }),
    );

    fireEvent.click(sectionToggle());

    expect(
      screen.getByRole("button", { name: "settings" }),
    ).toBeInTheDocument();
    expect(screen.getByTestId("ExpandLessIcon")).toBeInTheDocument();
  });

  test("navigates to the project settings", () => {
    renderSwitcher();

    fireEvent.click(screen.getByRole("button", { name: "settings" }));

    expect(h.push).toHaveBeenCalledWith("/project/settings");
  });

  test("highlights the settings entry on the settings route", () => {
    h.pathname = "/project/settings";
    renderSwitcher();

    const settings = screen.getByRole("button", { name: "settings" });
    expect(settings).toHaveClass("Mui-selected");
    expect(screen.getByText("settings")).toHaveStyle({ fontWeight: "600" });
  });

  test("does not highlight the settings entry on another route", () => {
    renderSwitcher();

    expect(screen.getByRole("button", { name: "settings" })).not.toHaveClass(
      "Mui-selected",
    );
    expect(screen.getByText("settings")).toHaveStyle({ fontWeight: "400" });
  });
});

describe("ProjectSwitcher, project menu", () => {
  test("lists every project of the active org and ticks the active one", () => {
    renderSwitcher();

    openSwitcherMenu();

    expect(within(menu()).getAllByRole("menuitem")).toHaveLength(3);
    expect(
      within(menuItem(/Alpha Project/)).getByTestId("CheckIcon"),
    ).toBeInTheDocument();
    expect(
      within(menuItem(/Beta/)).queryByTestId("CheckIcon"),
    ).not.toBeInTheDocument();
  });

  test("selects another project, navigates and closes the menu", () => {
    renderSwitcher();
    openSwitcherMenu();

    fireEvent.click(menuItem(/Beta/));

    expect(h.setActiveProject).toHaveBeenCalledWith("p2");
    expect(h.push).toHaveBeenCalledWith("/project");
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  test("shows an empty state when the org has no projects", () => {
    h.activeOrg = { projects: [] };
    h.activeProject = undefined;
    renderSwitcher();

    openSwitcherMenu();

    expect(within(menu()).getByText("noProjects")).toBeInTheDocument();
    expect(within(menu()).getAllByRole("menuitem")).toHaveLength(2);
  });

  test("shows an empty state when there is no active org at all", () => {
    h.activeOrg = undefined;
    h.activeProject = undefined;
    renderSwitcher();

    openSwitcherMenu();

    expect(within(menu()).getByText("noProjects")).toBeInTheDocument();
  });

  test("opens the create dialog from the menu and closes it again", () => {
    renderSwitcher();
    openSwitcherMenu();

    expect(
      screen.queryByTestId("create-project-dialog"),
    ).not.toBeInTheDocument();

    fireEvent.click(menuItem(/newProject/));

    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    expect(screen.getByTestId("create-project-dialog")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "close dialog" }));

    expect(
      screen.queryByTestId("create-project-dialog"),
    ).not.toBeInTheDocument();
  });

  test("closes the menu when dismissed", () => {
    renderSwitcher();
    openSwitcherMenu();

    fireEvent.keyDown(menu(), { key: "Escape" });

    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });
});

describe("ProjectSwitcher, collapsed", () => {
  test("renders icon-only entries without the section header", () => {
    renderSwitcher({ collapsed: true });

    expect(screen.queryByText("projectSection")).not.toBeInTheDocument();
    expect(screen.queryByText("Alpha Project")).not.toBeInTheDocument();
    expect(screen.getByTestId("agents-nav-list")).toHaveAttribute(
      "data-collapsed",
      "true",
    );
    expect(screen.getByTestId("FolderIcon")).toBeInTheDocument();
    expect(screen.getByTestId("SettingsIcon")).toBeInTheDocument();
  });

  test("opens the project menu from the folder button", () => {
    renderSwitcher({ collapsed: true });

    openSwitcherMenu();

    expect(within(menu()).getAllByRole("menuitem")).toHaveLength(3);
  });

  test("navigates to the project settings", () => {
    renderSwitcher({ collapsed: true });

    fireEvent.click(
      screen.getByTestId("SettingsIcon").closest("div")!.parentElement!,
    );

    expect(h.push).toHaveBeenCalledWith("/project/settings");
  });

  test("highlights the settings entry on the settings route", () => {
    h.pathname = "/project/settings";
    renderSwitcher({ collapsed: true });

    expect(
      screen.getByTestId("SettingsIcon").closest(".MuiListItemButton-root"),
    ).toHaveClass("Mui-selected");
  });

  test("shows the switch-project tooltip", async () => {
    renderSwitcher({ collapsed: true });

    fireEvent.mouseOver(switcherButton());

    expect(await screen.findByRole("tooltip")).toHaveTextContent(
      "switchProject",
    );
  });

  test("opens the create dialog from the menu and closes it again", () => {
    renderSwitcher({ collapsed: true });
    openSwitcherMenu();

    fireEvent.click(menuItem(/newProject/));

    expect(screen.getByTestId("create-project-dialog")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "close dialog" }));

    expect(
      screen.queryByTestId("create-project-dialog"),
    ).not.toBeInTheDocument();
  });
});
