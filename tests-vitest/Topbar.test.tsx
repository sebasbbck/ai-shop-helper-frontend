import type { ComponentProps } from "react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { cleanup, fireEvent, screen, within } from "@testing-library/react";
import { renderWithProviders } from "./test-utils";
import Topbar from "@/components/layout/Topbar";

vi.mock("@/features/i18n/LocaleSwitcher", () => ({
  default: () => <div data-testid="locale-switcher" />,
}));

vi.mock("@/features/notifications/NotificationsMenu", () => ({
  default: () => <div data-testid="notifications-menu" />,
}));

vi.mock("@/components/layout/UserMenu", () => ({
  default: () => <div data-testid="user-menu" />,
}));

const onMobileMenuToggle = vi.fn();

function renderTopbar(props: Partial<ComponentProps<typeof Topbar>> = {}) {
  return renderWithProviders(
    <Topbar onMobileMenuToggle={onMobileMenuToggle} {...props} />,
  );
}

const menuButton = () => screen.getByRole("button");

beforeEach(() => {
  onMobileMenuToggle.mockClear();
});

describe("Topbar", () => {
  test("renders a sticky app bar with a toolbar", () => {
    renderTopbar();

    const appBar = screen.getByRole("banner");
    expect(appBar).toBeInTheDocument();
    expect(appBar).toHaveClass("MuiAppBar-positionSticky");
    expect(appBar.querySelector(".MuiToolbar-root")).not.toBeNull();
  });

  test("renders the locale switcher, notifications and user menu", () => {
    renderTopbar();

    expect(screen.getByTestId("locale-switcher")).toBeInTheDocument();
    expect(screen.getByTestId("notifications-menu")).toBeInTheDocument();
    expect(screen.getByTestId("user-menu")).toBeInTheDocument();
  });

  test("groups the three widgets together on the right of the toolbar", () => {
    renderTopbar();

    const group = screen.getByTestId("locale-switcher").parentElement!;
    expect(within(group).getByTestId("notifications-menu")).toBeInTheDocument();
    expect(within(group).getByTestId("user-menu")).toBeInTheDocument();
    expect(group).toHaveStyle({ display: "flex", alignItems: "center" });
  });

  test("renders a single menu button carrying an icon", () => {
    renderTopbar();

    expect(menuButton()).toHaveClass("MuiIconButton-sizeSmall");
    expect(menuButton().querySelector("svg")).not.toBeNull();
  });

  test("calls onMobileMenuToggle when the menu button is clicked", () => {
    renderTopbar();

    fireEvent.click(menuButton());

    expect(onMobileMenuToggle).toHaveBeenCalledTimes(1);
  });

  test("calls onMobileMenuToggle once per click", () => {
    renderTopbar();

    fireEvent.click(menuButton());
    fireEvent.click(menuButton());

    expect(onMobileMenuToggle).toHaveBeenCalledTimes(2);
  });

  test("does not call onMobileMenuToggle on render", () => {
    renderTopbar();

    expect(onMobileMenuToggle).not.toHaveBeenCalled();
  });
});
