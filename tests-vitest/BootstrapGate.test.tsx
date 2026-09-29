import { beforeEach, describe, expect, test, vi } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "./test-utils";
import BootstrapGate from "@/features/shell/BootstrapGate";

const h = vi.hoisted(() => ({ isLoading: false, isEmpty: false }));

vi.mock("@/features/shell/ActiveContext", () => ({
  useActiveContext: () => ({ isLoading: h.isLoading, isEmpty: h.isEmpty }),
}));

vi.mock("@/features/shell/BootstrapWizard", () => ({
  default: () => <div data-testid="bootstrap-wizard" />,
}));

function renderGate(children = <div data-testid="app-content" />) {
  return renderWithProviders(<BootstrapGate>{children}</BootstrapGate>);
}

const spinner = () => screen.queryByRole("progressbar");
const wizard = () => screen.queryByTestId("bootstrap-wizard");
const content = () => screen.queryByTestId("app-content");

beforeEach(() => {
  h.isLoading = false;
  h.isEmpty = false;
});

describe("BootstrapGate", () => {
  test("shows a spinner while the context is loading", () => {
    h.isLoading = true;
    renderGate();

    expect(spinner()).toBeInTheDocument();
    expect(wizard()).not.toBeInTheDocument();
    expect(content()).not.toBeInTheDocument();
  });

  test("keeps showing the spinner even when the context is also empty", () => {
    h.isLoading = true;
    h.isEmpty = true;
    renderGate();

    expect(spinner()).toBeInTheDocument();
    expect(wizard()).not.toBeInTheDocument();
  });

  test("shows the bootstrap wizard when there is nothing set up yet", () => {
    h.isEmpty = true;
    renderGate();

    expect(wizard()).toBeInTheDocument();
    expect(spinner()).not.toBeInTheDocument();
    expect(content()).not.toBeInTheDocument();
  });

  test("renders its children once loading has finished and data exists", () => {
    renderGate();

    expect(content()).toBeInTheDocument();
    expect(spinner()).not.toBeInTheDocument();
    expect(wizard()).not.toBeInTheDocument();
  });

  test("renders every child it is given", () => {
    renderGate(
      <>
        <div data-testid="app-content" />
        <p>second child</p>
      </>,
    );

    expect(content()).toBeInTheDocument();
    expect(screen.getByText("second child")).toBeInTheDocument();
  });

  test("centers the spinner in a padded row", () => {
    h.isLoading = true;
    const { container } = renderGate();

    expect(container.firstElementChild).toHaveStyle({
      display: "flex",
      justifyContent: "center",
    });
  });
});
