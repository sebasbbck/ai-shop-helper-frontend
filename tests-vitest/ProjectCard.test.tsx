import { describe, expect, test, vi } from "vitest";
import { fireEvent, screen } from "@testing-library/react";
import { renderWithProviders } from "./test-utils";
import ProjectCard from "@/features/org/ProjectCard";

describe("ProjectCard", () => {
  test("shows the project name and type", () => {
    renderWithProviders(
      <ProjectCard name="My Store" typeName="WooCommerce" onOpen={vi.fn()} />,
    );
    expect(screen.getByText("My Store")).toBeInTheDocument();
    expect(screen.getByText("WooCommerce")).toBeInTheDocument();
  });

  test("calls onOpen when the open button is clicked", () => {
    const onOpen = vi.fn();
    renderWithProviders(
      <ProjectCard name="My Store" typeName="WooCommerce" onOpen={onOpen} />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Open" }));
    expect(onOpen).toHaveBeenCalledTimes(1);
  });
});
