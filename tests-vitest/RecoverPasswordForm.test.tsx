import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { cleanup, fireEvent, screen, waitFor } from "@testing-library/react";
import { renderWithProviders } from "./test-utils";
import RecoverPasswordForm from "@/features/auth/components/RecoverPasswordForm";

const h = vi.hoisted(() => ({
  forgot: vi.fn(),
  isPending: false,
  isSuccess: false,
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

// Only useTranslations is replaced; NextIntlClientProvider and the rest of the
// module are kept so the app's own providers keep working.
vi.mock("next-intl", async (importOriginal) => ({
  ...(await importOriginal<typeof import("next-intl")>()),
  useTranslations: () => (key: string) => key,
}));

vi.mock("@/api/endpoints/auth/auth", () => ({
  useAuthForgotPassword: () => ({
    mutate: h.forgot,
    isPending: h.isPending,
    isSuccess: h.isSuccess,
  }),
}));

const emailField = () => screen.getByLabelText("email") as HTMLInputElement;
const submitButton = () =>
  screen.getByRole("button", {
    name: /recoverPassword\.submitButton|recoverPassword\.submitting/,
  });
const loginLink = () =>
  screen.getByRole("link", { name: "recoverPassword.goToLogin" });

beforeEach(() => {
  h.forgot.mockClear();
  h.isPending = false;
  h.isSuccess = false;
});

afterEach(cleanup);

describe("RecoverPasswordForm, request", () => {
  test("renders the heading, the description, the field and the login link", () => {
    renderWithProviders(<RecoverPasswordForm />);

    expect(
      screen.getByRole("heading", { name: "recoverPassword.heading" }),
    ).toBeInTheDocument();
    expect(screen.getByText("recoverPassword.description")).toBeInTheDocument();
    expect(emailField()).toHaveAttribute("type", "email");
    expect(submitButton()).toHaveTextContent("recoverPassword.submitButton");
    expect(loginLink()).toHaveAttribute("href", "/login");
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  test("rejects a malformed email without calling the API", async () => {
    renderWithProviders(<RecoverPasswordForm />);

    fireEvent.change(emailField(), { target: { value: "not-an-email" } });
    fireEvent.submit(submitButton().closest("form")!);

    expect(await screen.findByText("emailInvalid")).toBeInTheDocument();
    expect(h.forgot).not.toHaveBeenCalled();
  });

  test("rejects an empty email as well", async () => {
    renderWithProviders(<RecoverPasswordForm />);

    fireEvent.submit(submitButton().closest("form")!);

    expect(await screen.findByText("emailInvalid")).toBeInTheDocument();
    expect(h.forgot).not.toHaveBeenCalled();
  });

  test("requests the reset email for a valid address", async () => {
    renderWithProviders(<RecoverPasswordForm />);

    fireEvent.change(emailField(), { target: { value: "user@example.com" } });
    fireEvent.submit(submitButton().closest("form")!);

    await waitFor(() =>
      expect(h.forgot).toHaveBeenCalledWith({
        data: { email: "user@example.com" },
      }),
    );
    expect(h.forgot).toHaveBeenCalledTimes(1);
  });

  test("clears the validation error once the address is fixed", async () => {
    renderWithProviders(<RecoverPasswordForm />);
    fireEvent.submit(submitButton().closest("form")!);
    expect(await screen.findByText("emailInvalid")).toBeInTheDocument();

    fireEvent.change(emailField(), { target: { value: "user@example.com" } });
    fireEvent.submit(submitButton().closest("form")!);

    await waitFor(() => expect(h.forgot).toHaveBeenCalled());
    expect(screen.queryByText("emailInvalid")).not.toBeInTheDocument();
  });

  test("disables the button while the request is in flight", () => {
    h.isPending = true;
    renderWithProviders(<RecoverPasswordForm />);

    expect(submitButton()).toBeDisabled();
    expect(submitButton()).toHaveTextContent("recoverPassword.submitting");
  });
});

describe("RecoverPasswordForm, sent", () => {
  test("replaces the form with a confirmation once the email is on its way", () => {
    h.isSuccess = true;
    renderWithProviders(<RecoverPasswordForm />);

    expect(
      screen.getByRole("heading", { name: "recoverPassword.heading" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveTextContent("recoverPassword.sent");
    expect(screen.queryByLabelText("email")).not.toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(
      screen.queryByText("recoverPassword.description"),
    ).not.toBeInTheDocument();
  });

  test("still offers the way back to the login page", () => {
    h.isSuccess = true;
    renderWithProviders(<RecoverPasswordForm />);

    expect(loginLink()).toHaveAttribute("href", "/login");
  });
});
