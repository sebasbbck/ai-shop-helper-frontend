import { describe, expect, test, vi } from "vitest";
import { fireEvent, screen } from "@testing-library/react";
import { renderWithProviders } from "./test-utils";
import { makeRouter } from "./mocks/router";
import LoginForm from "@/features/auth/components/LoginForm";

vi.mock("next/navigation", () => ({
  useRouter: () => makeRouter(),
  useSearchParams: () => new URLSearchParams(),
}));

describe("LoginForm", () => {
  test("renders heading, fields and submit", () => {
    renderWithProviders(<LoginForm />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Sign in" }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sign in" })).toBeInTheDocument();
  });

  test("offers Google sign-in", () => {
    renderWithProviders(<LoginForm />);

    expect(screen.getByRole("button", { name: /google/i })).toBeInTheDocument();
  });

  test("shows validation errors on empty submit", async () => {
    renderWithProviders(<LoginForm />);

    fireEvent.click(screen.getByRole("button", { name: "Sign in" }));

    expect(await screen.findByText("Invalid email")).toBeInTheDocument();
    expect(await screen.findByText("Required")).toBeInTheDocument();
  });
});
