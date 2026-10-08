import type { ComponentProps } from "react";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { fireEvent, screen } from "@testing-library/react";
import { renderWithProviders } from "./test-utils";
import SidebarContent from "@/components/layout/SidebarContent";

vi.mock("next/image", () => ({
  default: ({
    src,
    alt,
    style,
  }: {
    src: string;
    alt: string;
    style?: object;
  }) => <img data-testid="logo" src={src} alt={alt} style={style} />,
}));

vi.mock("@/components/layout/OrgSwitcher", () => ({
  default: ({ collapsed }: { collapsed: boolean }) => (
    <div data-testid="org-switcher" data-collapsed={String(collapsed)} />
  ),
}));

vi.mock("@/components/layout/ProjectSwitcher", () => ({
  default: ({ collapsed }: { collapsed: boolean }) => (
    <div data-testid="project-switcher" data-collapsed={String(collapsed)} />
  ),
}));

const onToggleCollapse = vi.fn();

function renderSidebarContent(
  props: Partial<ComponentProps<typeof SidebarContent>> = {},
) {
  return renderWithProviders(
    <SidebarContent
      collapsed={false}
      onToggleCollapse={onToggleCollapse}
      {...props}
    />,
  );
}

const logo = () => screen.getByTestId("logo");
const header = () => logo().parentElement!;

beforeEach(() => {
  onToggleCollapse.mockClear();
});

describe("SidebarContent", () => {
  test("renders the full logo when expanded", () => {
    renderSidebarContent({ collapsed: false });

    expect(logo()).toHaveAttribute("src", "/ai-shop-helper-logo.webp");
    expect(logo()).toHaveAccessibleName("AI Shop Helper");
    expect(logo()).toHaveStyle({ height: "30px", width: "auto" });
  });

  test("renders the cropped logo when collapsed", () => {
    renderSidebarContent({ collapsed: true });

    expect(logo()).toHaveAttribute(
      "src",
      "/ai-shop-helper-logo-recortado.webp",
    );
    expect(logo()).toHaveAccessibleName("AI Shop Helper");
    expect(logo()).toHaveStyle({ height: "28px", width: "auto" });
  });

  test("renders exactly one logo at a time", () => {
    renderSidebarContent({ collapsed: true });

    expect(screen.getAllByTestId("logo")).toHaveLength(1);
  });

  test("calls onToggleCollapse when the header is clicked", () => {
    renderSidebarContent();

    fireEvent.click(header());

    expect(onToggleCollapse).toHaveBeenCalledTimes(1);
  });

  test("does not call onToggleCollapse on render", () => {
    renderSidebarContent();

    expect(onToggleCollapse).not.toHaveBeenCalled();
  });

  test("renders both switchers and passes collapsed=false down", () => {
    renderSidebarContent({ collapsed: false });

    expect(screen.getByTestId("org-switcher")).toHaveAttribute(
      "data-collapsed",
      "false",
    );
    expect(screen.getByTestId("project-switcher")).toHaveAttribute(
      "data-collapsed",
      "false",
    );
  });

  test("passes collapsed=true down to both switchers", () => {
    renderSidebarContent({ collapsed: true });

    expect(screen.getByTestId("org-switcher")).toHaveAttribute(
      "data-collapsed",
      "true",
    );
    expect(screen.getByTestId("project-switcher")).toHaveAttribute(
      "data-collapsed",
      "true",
    );
  });

  test("stacks the header, the switchers and a spacer in a scrollable column", () => {
    const { container } = renderSidebarContent();

    const root = container.firstElementChild as HTMLElement;
    expect(root).toHaveStyle({ flexDirection: "column", overflowY: "auto" });
    expect(root.children).toHaveLength(4);
  });
});
