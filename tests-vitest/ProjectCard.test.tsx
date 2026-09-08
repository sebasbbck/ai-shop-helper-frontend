import { describe, expect, test, vi } from "vitest";
import { fireEvent, screen } from "@testing-library/react";
import { renderWithProviders } from "./test-utils";
import ProjectCard from "@/features/org/ProjectCard";

describe("ProjectCard", () => {
  test("clicking anywhere on the card triggers onOpen", () => {
    const onOpen = vi.fn();
    renderWithProviders(
      <ProjectCard name="My Shop" typeName="WordPress" onOpen={onOpen} />,
    );

    fireEvent.click(screen.getByRole("button"));

    expect(onOpen).toHaveBeenCalledTimes(1);
  });

  test("renders the project name and type", () => {
    renderWithProviders(
      <ProjectCard name="My Shop" typeName="WordPress" onOpen={vi.fn()} />,
    );

    expect(screen.getByText("My Shop")).toBeInTheDocument();
    expect(screen.getByText("WordPress")).toBeInTheDocument();
  });
});
