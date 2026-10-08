import { beforeEach, describe, expect, test, vi } from "vitest";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import { renderWithProviders } from "./test-utils";
import ResetPasswordForm from "@/features/auth/components/ResetPasswordForm";

const h = vi.hoisted(() => ({
  reset: vi.fn(),
  isPending: false,
  isSuccess: false,
  isError: false,
  params: new URLSearchParams("token=reset-token"),
}));

vi.mock("next/navigation", () => ({
  useSearchParams: () => h.params,
}));

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...rest
  }: {
    href: string;
    children: React.ReactNode;
  }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

vi.mock("next-intl", async (importOriginal) => ({
  ...(await importOriginal<typeof import("next-intl")>()),
  useTranslations: () => (key: string) => key,
}));

vi.mock("@/api/endpoints/auth/auth", () => ({
  useAuthResetPassword: () => ({
    mutate: h.reset,
    isPending: h.isPending,
    isSuccess: h.isSuccess,
    isError: h.isError,
  }),
}));

const passwordField = () =>
  screen.getByLabelText("resetPassword.newPassword") as HTMLInputElement;
const confirmField = () =>
  screen.getByLabelText("resetPassword.confirmPassword") as HTMLInputElement;
const submitButton = () =>
  screen.getByRole("button", {
    name: /resetPassword\.submitButton|resetPassword\.submitting/,
  });
const loginLink = () =>
  screen.getByRole("link", { name: "resetPassword.goToLogin" });

function submitPasswords(password: string, confirm = password) {
  fireEvent.change(passwordField(), { target: { value: password } });
  fireEvent.change(confirmField(), { target: { value: confirm } });
  fireEvent.submit(submitButton().closest("form")!);
}

beforeEach(() => {
  h.reset.mockClear();
  h.isPending = false;
  h.isSuccess = false;
  h.isError = false;
  h.params = new URLSearchParams("token=reset-token");
});

describe("ResetPasswordForm, without a token", () => {
  test("refuses to show the form when the link carries no token", () => {
    h.params = new URLSearchParams();
    renderWithProviders(<ResetPasswordForm />);

    expect(
      screen.getByRole("heading", { name: "resetPassword.heading" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveTextContent("resetPassword.error");
    expect(
      screen.queryByLabelText("resetPassword.newPassword"),
    ).not.toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(loginLink()).toHaveAttribute("href", "/login");
  });

  test("treats an empty token the same as a missing one", () => {
    h.params = new URLSearchParams("token=");
    renderWithProviders(<ResetPasswordForm />);

    expect(screen.getByRole("alert")).toHaveTextContent("resetPassword.error");
    expect(
      screen.queryByLabelText("resetPassword.newPassword"),
    ).not.toBeInTheDocument();
  });
});

describe("ResetPasswordForm, with a token", () => {
  test("renders both password fields, the button and the login link", () => {
    renderWithProviders(<ResetPasswordForm />);

    expect(passwordField()).toHaveAttribute("type", "password");
    expect(confirmField()).toHaveAttribute("type", "password");
    expect(submitButton()).toHaveTextContent("resetPassword.submitButton");
    expect(loginLink()).toHaveAttribute("href", "/login");
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  test("rejects a password shorter than the minimum", async () => {
    renderWithProviders(<ResetPasswordForm />);

    submitPasswords("short");

    expect(await screen.findByText("passwordMin")).toBeInTheDocument();
    expect(h.reset).not.toHaveBeenCalled();
  });

  test("rejects an empty confirmation", async () => {
    renderWithProviders(<ResetPasswordForm />);

    submitPasswords("longenough123", "");

    expect(await screen.findByText("required")).toBeInTheDocument();
    expect(h.reset).not.toHaveBeenCalled();
  });

  test("rejects two passwords that do not match", async () => {
    renderWithProviders(<ResetPasswordForm />);

    submitPasswords("longenough123", "longenough124");

    expect(
      await screen.findByText("resetPassword.mismatch"),
    ).toBeInTheDocument();
    expect(h.reset).not.toHaveBeenCalled();
  });

  test("submits the new password together with the token from the link", async () => {
    renderWithProviders(<ResetPasswordForm />);

    submitPasswords("longenough123");

    await waitFor(() =>
      expect(h.reset).toHaveBeenCalledWith({
        data: { token: "reset-token", new_password: "longenough123" },
      }),
    );
    expect(h.reset).toHaveBeenCalledTimes(1);
    expect(h.reset).not.toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ confirm: expect.anything() }),
      }),
    );
  });

  test("clears the mismatch error once the passwords agree", async () => {
    renderWithProviders(<ResetPasswordForm />);
    submitPasswords("longenough123", "longenough124");
    expect(
      await screen.findByText("resetPassword.mismatch"),
    ).toBeInTheDocument();

    submitPasswords("longenough123");

    await waitFor(() => expect(h.reset).toHaveBeenCalled());
    expect(
      screen.queryByText("resetPassword.mismatch"),
    ).not.toBeInTheDocument();
  });

  test("disables the button while the reset is in flight", () => {
    h.isPending = true;
    renderWithProviders(<ResetPasswordForm />);

    expect(submitButton()).toBeDisabled();
    expect(submitButton()).toHaveTextContent("resetPassword.submitting");
  });

  test("shows an error above the form when the token is rejected", () => {
    h.isError = true;
    renderWithProviders(<ResetPasswordForm />);

    expect(screen.getByRole("alert")).toHaveTextContent("resetPassword.error");
    expect(passwordField()).toBeInTheDocument();
    expect(submitButton()).toBeEnabled();
  });
});

describe("ResetPasswordForm, after the reset", () => {
  test("replaces the form with a confirmation", () => {
    h.isSuccess = true;
    renderWithProviders(<ResetPasswordForm />);

    expect(screen.getByRole("alert")).toHaveTextContent(
      "resetPassword.success",
    );
    expect(
      screen.queryByLabelText("resetPassword.newPassword"),
    ).not.toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(loginLink()).toHaveAttribute("href", "/login");
  });

  test("shows the missing-token view even after a success when the token is gone", () => {
    h.params = new URLSearchParams();
    h.isSuccess = true;
    renderWithProviders(<ResetPasswordForm />);

    expect(screen.getByRole("alert")).toHaveTextContent("resetPassword.error");
  });
});
