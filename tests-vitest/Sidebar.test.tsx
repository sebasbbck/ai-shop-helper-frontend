import type { ComponentProps } from "react";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { fireEvent, screen, within } from "@testing-library/react";
import { renderWithProviders } from "./test-utils";
import Sidebar from "@/components/layout/Sidebar";
import {
  SIDEBAR_MINI,
  SIDEBAR_WIDTH,
} from "@/components/layout/shell-constants";

vi.mock("@/components/layout/SidebarContent", () => ({
  default: ({
    collapsed,
    onToggleCollapse,
  }: {
    collapsed: boolean;
    onToggleCollapse: () => void;
  }) => (
    <div data-testid="sidebar-content" data-collapsed={String(collapsed)}>
      <button type="button" onClick={onToggleCollapse}>
        toggle
      </button>
    </div>
  ),
}));

const onToggleCollapse = vi.fn();
const onMobileClose = vi.fn();

function renderSidebar(props: Partial<ComponentProps<typeof Sidebar>> = {}) {
  return renderWithProviders(
    <Sidebar
      collapsed={false}
      mobileOpen={false}
      onToggleCollapse={onToggleCollapse}
      onMobileClose={onMobileClose}
      {...props}
    />,
  );
}

const mobileDrawer = () =>
  document.querySelector<HTMLElement>(".MuiDrawer-modal");
const desktopDrawer = () =>
  document.querySelector<HTMLElement>(".MuiDrawer-docked");
const paperOf = (drawer: HTMLElement | null) =>
  drawer!.querySelector<HTMLElement>(".MuiDrawer-paper")!;
const contentOf = (drawer: HTMLElement | null) =>
  within(paperOf(drawer)).getByTestId("sidebar-content");
const toggleOf = (drawer: HTMLElement | null) =>
  within(paperOf(drawer)).getByRole("button", { name: "toggle", hidden: true });

beforeEach(() => {
  onToggleCollapse.mockClear();
  onMobileClose.mockClear();
});

describe("Sidebar", () => {
  test("renders a temporary drawer for mobile and a permanent one for desktop", () => {
    renderSidebar();

    expect(mobileDrawer()).not.toBeNull();
    expect(desktopDrawer()).not.toBeNull();
    expect(screen.getAllByTestId("sidebar-content")).toHaveLength(2);
  });

  test("keeps the mobile drawer mounted but hidden while it is closed", () => {
    renderSidebar({ mobileOpen: false });

    expect(contentOf(mobileDrawer())).toBeInTheDocument();
    expect(paperOf(mobileDrawer())).not.toBeVisible();
  });

  test("shows the mobile drawer when mobileOpen is true", () => {
    renderSidebar({ mobileOpen: true });

    expect(paperOf(mobileDrawer())).toBeVisible();
    expect(document.querySelector(".MuiBackdrop-root")).toBeVisible();
  });

  test("calls onMobileClose when the backdrop is clicked", () => {
    renderSidebar({ mobileOpen: true });

    fireEvent.click(document.querySelector(".MuiBackdrop-root")!);

    expect(onMobileClose).toHaveBeenCalledTimes(1);
  });

  test("calls onMobileClose when Escape is pressed", () => {
    renderSidebar({ mobileOpen: true });

    fireEvent.keyDown(paperOf(mobileDrawer()), { key: "Escape" });

    expect(onMobileClose).toHaveBeenCalledTimes(1);
  });

  test("does not call onMobileClose on its own", () => {
    renderSidebar({ mobileOpen: true });

    expect(onMobileClose).not.toHaveBeenCalled();
  });

  test("never collapses the content of the mobile drawer", () => {
    renderSidebar({ collapsed: true, mobileOpen: true });

    expect(contentOf(mobileDrawer())).toHaveAttribute(
      "data-collapsed",
      "false",
    );
  });

  test("renders the desktop drawer at full width when expanded", () => {
    renderSidebar({ collapsed: false });

    expect(contentOf(desktopDrawer())).toHaveAttribute(
      "data-collapsed",
      "false",
    );
    expect(paperOf(desktopDrawer())).toHaveStyle({
      width: `${SIDEBAR_WIDTH}px`,
    });
    expect(desktopDrawer()!.parentElement).toHaveStyle({
      width: `${SIDEBAR_WIDTH}px`,
    });
  });

  test("renders the desktop drawer at mini width when collapsed", () => {
    renderSidebar({ collapsed: true });

    expect(contentOf(desktopDrawer())).toHaveAttribute(
      "data-collapsed",
      "true",
    );
    expect(paperOf(desktopDrawer())).toHaveStyle({
      width: `${SIDEBAR_MINI}px`,
    });
    expect(desktopDrawer()!.parentElement).toHaveStyle({
      width: `${SIDEBAR_MINI}px`,
    });
  });

  test("forwards onToggleCollapse from both drawers", () => {
    renderSidebar({ mobileOpen: true });

    fireEvent.click(toggleOf(mobileDrawer()));
    expect(onToggleCollapse).toHaveBeenCalledTimes(1);

    fireEvent.click(toggleOf(desktopDrawer()));
    expect(onToggleCollapse).toHaveBeenCalledTimes(2);
  });
});
