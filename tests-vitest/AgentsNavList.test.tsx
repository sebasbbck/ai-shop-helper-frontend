import type { ComponentProps } from "react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import {
  cleanup,
  fireEvent,
  screen,
  waitForElementToBeRemoved,
  within,
} from "@testing-library/react";
import { renderWithProviders } from "./test-utils";
import { makeRouter } from "./mocks/router";
import AgentsNavList from "@/components/layout/AgentsNavList";

const agents = [
  { id: "a1", name: "Blog Writer" },
  { id: "a2", name: "Product Describer" },
];

const h = vi.hoisted(() => ({
  push: vi.fn(),
  pathname: "/project",
  activeProjectTypeId: "pt1" as string | null,
  agentsArgs: undefined as unknown[] | undefined,
  agentsData: undefined as
    { items: { id: string; name: string }[] } | undefined,
}));

vi.mock("next/navigation", () => ({
  useRouter: () => makeRouter({ push: h.push }),
  usePathname: () => h.pathname,
}));

vi.mock("next-intl", async (importOriginal) => ({
  ...(await importOriginal<typeof import("next-intl")>()),
  useTranslations: () => (key: string) => key,
}));

vi.mock("@/api/endpoints/agents/agents", () => ({
  useAgentsGetAgents: (...args: unknown[]) => {
    h.agentsArgs = args;
    return { data: h.agentsData };
  },
}));

vi.mock("@/features/shell/ActiveContext", () => ({
  useActiveContext: () => ({ activeProjectTypeId: h.activeProjectTypeId }),
}));

vi.mock("@/features/agents/use-agent-label", () => ({
  useAgentLabel: () => (name: string) => ({ name, description: "" }),
}));

function renderList(props: Partial<ComponentProps<typeof AgentsNavList>> = {}) {
  return renderWithProviders(<AgentsNavList collapsed={false} {...props} />);
}

const header = () => screen.getByRole("button", { name: "agents" });
const iconButton = () =>
  screen.getByTestId("SmartToyIcon").closest(".MuiListItemButton-root")!;
const menu = () => screen.getByRole("menu");
const agentButton = (name: string) => screen.getByRole("button", { name });
const queryParams = () =>
  h.agentsArgs?.[0] as { project_type_id: string | null };
const queryEnabled = () =>
  (h.agentsArgs?.[1] as { query: { enabled: boolean } }).query.enabled;

beforeEach(() => {
  h.push.mockClear();
  h.pathname = "/project";
  h.activeProjectTypeId = "pt1";
  h.agentsArgs = undefined;
  h.agentsData = { items: agents };
});

describe("AgentsNavList, the agents query", () => {
  test("asks for the agents of the active project type", () => {
    renderList();

    expect(queryParams()).toEqual({ project_type_id: "pt1" });
    expect(queryEnabled()).toBe(true);
  });

  test("stays disabled until a project type is known", () => {
    h.activeProjectTypeId = null;
    renderList();

    expect(queryParams()).toEqual({ project_type_id: null });
    expect(queryEnabled()).toBe(false);
  });

  test("renders no agents while the list has not arrived", () => {
    h.agentsData = undefined;
    h.pathname = "/agents/a1";
    renderList();

    expect(
      screen.queryByRole("button", { name: "Blog Writer" }),
    ).not.toBeInTheDocument();
  });
});

describe("AgentsNavList, expanded", () => {
  test("renders the section header closed on a non-agent route", () => {
    renderList();

    expect(header()).toBeInTheDocument();
    expect(screen.getByTestId("ExpandMoreIcon")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Blog Writer" }),
    ).not.toBeInTheDocument();
  });

  test("opens the section and navigates to the project when the header is clicked", () => {
    renderList();

    fireEvent.click(header());

    expect(h.push).toHaveBeenCalledWith("/project");
    expect(screen.getByTestId("ExpandLessIcon")).toBeInTheDocument();
    expect(agentButton("Blog Writer")).toBeInTheDocument();
    expect(agentButton("Product Describer")).toBeInTheDocument();
  });

  test("starts open on an agent route", () => {
    h.pathname = "/agents/a1";
    renderList();

    expect(screen.getByTestId("ExpandLessIcon")).toBeInTheDocument();
    expect(agentButton("Blog Writer")).toBeInTheDocument();
  });

  test("highlights the header only once the section is closed again", async () => {
    h.pathname = "/agents/a1";
    renderList();

    expect(header()).not.toHaveClass("Mui-selected");

    fireEvent.click(header());

    expect(header()).toHaveClass("Mui-selected");
    expect(screen.getByTestId("ExpandMoreIcon")).toBeInTheDocument();
    await waitForElementToBeRemoved(() =>
      screen.queryByRole("button", { name: "Blog Writer" }),
    );
  });

  test("bolds the header label on an agent route", () => {
    h.pathname = "/agents/a1";
    renderList();

    expect(screen.getByText("agents")).toHaveStyle({ fontWeight: "600" });
  });

  test("keeps the header label regular elsewhere", () => {
    renderList();

    expect(screen.getByText("agents")).toHaveStyle({ fontWeight: "400" });
  });

  test("marks the agent of the current route and leaves the others alone", () => {
    h.pathname = "/agents/a2";
    renderList();

    expect(agentButton("Product Describer")).toHaveClass("Mui-selected");
    expect(screen.getByText("Product Describer")).toHaveStyle({
      fontWeight: "600",
    });
    expect(agentButton("Blog Writer")).not.toHaveClass("Mui-selected");
    expect(screen.getByText("Blog Writer")).toHaveStyle({ fontWeight: "400" });
  });

  test("navigates to an agent from the list", () => {
    h.pathname = "/agents/a1";
    renderList();

    fireEvent.click(agentButton("Product Describer"));

    expect(h.push).toHaveBeenCalledWith("/agents/a2");
  });
});

describe("AgentsNavList, collapsed", () => {
  test("renders a single icon entry without the section label", () => {
    renderList({ collapsed: true });

    expect(screen.getByTestId("SmartToyIcon")).toBeInTheDocument();
    expect(screen.queryByText("agents")).not.toBeInTheDocument();
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  test("highlights the icon on an agent route", () => {
    h.pathname = "/agents/a1";
    renderList({ collapsed: true });

    expect(iconButton()).toHaveClass("Mui-selected");
  });

  test("does not highlight the icon elsewhere", () => {
    renderList({ collapsed: true });

    expect(iconButton()).not.toHaveClass("Mui-selected");
  });

  test("shows the agents tooltip", async () => {
    renderList({ collapsed: true });

    fireEvent.mouseOver(iconButton());

    expect(await screen.findByRole("tooltip")).toHaveTextContent("agents");
  });

  test("opens a menu listing every agent under a heading", () => {
    h.pathname = "/agents/a1";
    renderList({ collapsed: true });

    fireEvent.click(iconButton());

    expect(within(menu()).getByText("agents")).toBeInTheDocument();
    const items = within(menu()).getAllByRole("menuitem");
    expect(items.map((item) => item.textContent)).toEqual([
      "Blog Writer",
      "Product Describer",
    ]);
    expect(items[0]).toHaveClass("Mui-selected");
    expect(items[1]).not.toHaveClass("Mui-selected");
  });

  test("shows an empty state when there are no agents", () => {
    h.agentsData = { items: [] };
    renderList({ collapsed: true });

    fireEvent.click(iconButton());

    expect(within(menu()).getByText("noProjects")).toBeInTheDocument();
    expect(within(menu()).getAllByRole("menuitem")).toHaveLength(1);
  });

  test("navigates and closes the menu when an agent is picked", () => {
    renderList({ collapsed: true });
    fireEvent.click(iconButton());

    fireEvent.click(
      within(menu()).getByRole("menuitem", { name: "Product Describer" }),
    );

    expect(h.push).toHaveBeenCalledWith("/agents/a2");
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  test("closes the menu when it is dismissed", () => {
    renderList({ collapsed: true });
    fireEvent.click(iconButton());

    fireEvent.keyDown(menu(), { key: "Escape" });

    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    expect(h.push).not.toHaveBeenCalled();
  });
});
