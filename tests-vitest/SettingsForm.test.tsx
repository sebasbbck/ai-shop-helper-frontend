import { beforeEach, describe, expect, test, vi } from "vitest";
import { act, fireEvent, screen, waitFor } from "@testing-library/react";
import { renderWithProviders } from "./test-utils";
import SettingsForm from "@/features/settings/SettingsForm";

type UpdateOptions = { mutation?: { onSuccess?: () => void } };

const h = vi.hoisted(() => ({
  user: undefined as { name: string; email: string } | undefined,
  mutate: vi.fn(),
  isPending: false,
  isError: false,
  options: undefined as UpdateOptions | undefined,
}));

vi.mock("@/api/endpoints/users/users", () => ({
  getUsersGetMeQueryKey: () => ["users", "me"],
  useUsersGetMe: () => ({ data: h.user }),
  useUsersUpdateMe: (options: UpdateOptions) => {
    h.options = options;
    return { mutate: h.mutate, isPending: h.isPending, isError: h.isError };
  },
}));

beforeEach(() => {
  h.user = { name: "Ada Lovelace", email: "ada@example.com" };
  h.mutate.mockClear();
  h.isPending = false;
  h.isError = false;
  h.options = undefined;
});

describe("SettingsForm", () => {
  test("pre-fills the form with the current user", () => {
    renderWithProviders(<SettingsForm />);
    expect(screen.getByLabelText("Name")).toHaveValue("Ada Lovelace");
    expect(screen.getByLabelText("Email")).toHaveValue("ada@example.com");
  });

  test("disables save until the form is dirty", () => {
    renderWithProviders(<SettingsForm />);
    expect(screen.getByRole("button", { name: "Save changes" })).toBeDisabled();

    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "Ada L." },
    });
    expect(screen.getByRole("button", { name: "Save changes" })).toBeEnabled();
  });

  test("submits the updated profile", async () => {
    renderWithProviders(<SettingsForm />);
    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "Ada L." },
    });
    fireEvent.click(screen.getByRole("button", { name: "Save changes" }));

    await waitFor(() =>
      expect(h.mutate).toHaveBeenCalledWith({
        data: { name: "Ada L.", email: "ada@example.com" },
      }),
    );
  });

  test("shows a validation error when the name is cleared", async () => {
    renderWithProviders(<SettingsForm />);
    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Save changes" }));

    expect(await screen.findByText("Name is required")).toBeInTheDocument();
    expect(h.mutate).not.toHaveBeenCalled();
  });

  test("shows a success alert after saving", () => {
    renderWithProviders(<SettingsForm />);
    act(() => {
      h.options?.mutation?.onSuccess?.();
    });
    expect(screen.getByText("Profile updated")).toBeInTheDocument();
  });

  test("shows an error alert when saving fails", () => {
    h.isError = true;
    renderWithProviders(<SettingsForm />);
    expect(screen.getByText("Could not save changes")).toBeInTheDocument();
  });
});
