import type { ComponentProps } from "react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { cleanup, fireEvent, screen } from "@testing-library/react";
import { renderWithProviders } from "./test-utils";
import { makeRouter } from "./mocks/router";
import NavItem from "@/components/layout/NavItem";

const h = vi.hoisted(() => ({ push: vi.fn() }));

vi.mock("next/navigation", () => ({
  useRouter: () => makeRouter({ push: h.push }),
}));

const onClick = vi.fn();
const icon = <svg data-testid="nav-icon" />;

function renderNavItem(props: Partial<ComponentProps<typeof NavItem>> = {}) {
  return renderWithProviders(
    <NavItem
      href="/dashboard"
      icon={icon}
      label="Nav Item"
      active={false}
      collapsed={false}
      onClick={onClick}
      {...props}
    />,
  );
}

const button = () => screen.getByRole("button");

beforeEach(() => {
  h.push.mockClear();
  onClick.mockClear();
});

afterEach(cleanup);

describe("NavItem", () => {
  test("renders the icon and the label when expanded", () => {
    renderNavItem();

    expect(screen.getByTestId("nav-icon")).toBeInTheDocument();
    expect(screen.getByText("Nav Item")).toBeInTheDocument();
  });

  test("navigates to href and calls onClick when clicked", () => {
    renderNavItem({ href: "/settings" });

    fireEvent.click(button());

    expect(h.push).toHaveBeenCalledTimes(1);
    expect(h.push).toHaveBeenCalledWith("/settings");
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  test("navigates without failing when no onClick is given", () => {
    renderNavItem({ onClick: undefined });

    fireEvent.click(button());

    expect(h.push).toHaveBeenCalledWith("/dashboard");
    expect(onClick).not.toHaveBeenCalled();
  });

  test("marks the button as selected and bolds the label when active", () => {
    renderNavItem({ active: true });

    expect(button()).toHaveClass("Mui-selected");
    expect(screen.getByText("Nav Item")).toHaveStyle({ fontWeight: "600" });
  });

  test("is not selected and keeps a regular label when inactive", () => {
    renderNavItem({ active: false });

    expect(button()).not.toHaveClass("Mui-selected");
    expect(screen.getByText("Nav Item")).toHaveStyle({ fontWeight: "400" });
  });

  test("hides the label and centers the icon when collapsed", () => {
    renderNavItem({ collapsed: true });

    expect(screen.queryByText("Nav Item")).not.toBeInTheDocument();
    expect(screen.getByTestId("nav-icon")).toBeInTheDocument();
    expect(button()).toHaveStyle({ justifyContent: "center", paddingLeft: "0px" });
  });

  test("shows the label in a tooltip when collapsed", async () => {
    renderNavItem({ collapsed: true });

    fireEvent.mouseOver(button());

    expect(await screen.findByRole("tooltip")).toHaveTextContent("Nav Item");
  });

  test("does not wrap the button in a tooltip when expanded", () => {
    renderNavItem({ collapsed: false });

    fireEvent.mouseOver(button());

    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    expect(button()).toHaveStyle({ justifyContent: "flex-start" });
  });

  test("still navigates when collapsed inside the tooltip", () => {
    renderNavItem({ collapsed: true, href: "/collapsed" });

    fireEvent.click(button());

    expect(h.push).toHaveBeenCalledWith("/collapsed");
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
