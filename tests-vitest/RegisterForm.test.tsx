import { describe, expect, test, vi } from "vitest";
import { fireEvent, screen } from "@testing-library/react";
import { renderWithProviders } from "./test-utils";
import RegisterForm from "@/features/auth/components/RegisterForm";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), prefetch: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));

describe("RegisterForm", () => {
  test("renders heading, fields and submit", () => {
    renderWithProviders(<RegisterForm />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Create account" }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Create account" }),
    ).toBeInTheDocument();
  });

  test("shows validation errors on empty submit", async () => {
    renderWithProviders(<RegisterForm />);

    fireEvent.click(screen.getByRole("button", { name: "Create account" }));

    expect(await screen.findByText("Name is required")).toBeInTheDocument();
    expect(await screen.findByText("Invalid email")).toBeInTheDocument();
    expect(
      await screen.findByText("At least 8 characters"),
    ).toBeInTheDocument();
  });
});
