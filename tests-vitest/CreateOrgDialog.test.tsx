import type { ComponentProps } from "react";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { act, fireEvent, screen, waitFor } from "@testing-library/react";
import { renderWithProviders } from "./test-utils";
import { makeRouter } from "./mocks/router";
import CreateOrgDialog from "@/components/layout/CreateOrgDialog";

type MutationOptions = {
  mutation: {
    onSuccess: (org: { id: string }) => Promise<void> | void;
    onError: () => void;
  };
};

const h = vi.hoisted(() => ({
  push: vi.fn(),
  invalidateQueries: vi.fn(),
  selectAfterCreate: vi.fn(),
  mutate: vi.fn(),
  isPending: false,
  options: undefined as unknown,
}));

vi.mock("next/navigation", () => ({
  useRouter: () => makeRouter({ push: h.push }),
}));

vi.mock("next-intl", async (importOriginal) => ({
  ...(await importOriginal<typeof import("next-intl")>()),
  useTranslations: () => (key: string) => key,
}));

vi.mock("@tanstack/react-query", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@tanstack/react-query")>()),
  useQueryClient: () => ({ invalidateQueries: h.invalidateQueries }),
}));

vi.mock("@/api/endpoints/orgs/orgs", () => ({
  useOrgsCreateOrg: (options: unknown) => {
    h.options = options;
    return { mutate: h.mutate, isPending: h.isPending };
  },
  getOrgsGetMyOrgsQueryKey: () => ["orgs", "my"],
}));

vi.mock("@/features/shell/ActiveContext", () => ({
  useActiveContext: () => ({ selectAfterCreate: h.selectAfterCreate }),
}));

const onClose = vi.fn();

function renderDialog(
  props: Partial<ComponentProps<typeof CreateOrgDialog>> = {},
) {
  return renderWithProviders(
    <CreateOrgDialog open onClose={onClose} {...props} />,
  );
}

const nameField = () => screen.getByLabelText("name") as HTMLInputElement;
const submitButton = () =>
  screen.getByRole("button", { name: /create|creating/ });
const cancelButton = () => screen.getByRole("button", { name: "cancel" });
const mutationOptions = () => h.options as MutationOptions;

async function fillAndSubmit(name: string) {
  fireEvent.change(nameField(), { target: { value: name } });
  fireEvent.submit(submitButton().closest("form")!);
  await waitFor(() => expect(h.mutate).toHaveBeenCalled());
}

beforeEach(() => {
  h.push.mockClear();
  h.invalidateQueries.mockClear();
  h.selectAfterCreate.mockClear();
  h.mutate.mockClear();
  h.isPending = false;
  h.options = undefined;
  onClose.mockClear();
});

describe("CreateOrgDialog", () => {
  test("renders the form when open", () => {
    renderDialog();

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("newOrg")).toBeInTheDocument();
    expect(nameField()).toBeInTheDocument();
    expect(cancelButton()).toBeInTheDocument();
    expect(submitButton()).toHaveTextContent("create");
  });

  test("renders nothing when closed", () => {
    renderDialog({ open: false });

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  test("shows no error alert before submitting", () => {
    renderDialog();

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(nameField()).toHaveAttribute("aria-invalid", "false");
  });

  test("rejects an empty name and does not call the API", async () => {
    renderDialog();

    fireEvent.submit(submitButton().closest("form")!);

    expect(await screen.findByText("nameRequired")).toBeInTheDocument();
    expect(nameField()).toHaveAttribute("aria-invalid", "true");
    expect(h.mutate).not.toHaveBeenCalled();
  });

  test("submits the form values to the API", async () => {
    renderDialog();

    await fillAndSubmit("Acme");

    expect(h.mutate).toHaveBeenCalledTimes(1);
    expect(h.mutate).toHaveBeenCalledWith({ data: { name: "Acme" } });
    expect(screen.queryByText("nameRequired")).not.toBeInTheDocument();
  });

  test("clears the validation error once a name is typed", async () => {
    renderDialog();

    fireEvent.submit(submitButton().closest("form")!);
    expect(await screen.findByText("nameRequired")).toBeInTheDocument();

    await fillAndSubmit("Acme");

    await waitFor(() =>
      expect(screen.queryByText("nameRequired")).not.toBeInTheDocument(),
    );
  });

  test("on success: refreshes the org list, selects the org, navigates and closes", async () => {
    renderDialog();
    await fillAndSubmit("Acme");

    await act(async () => {
      await mutationOptions().mutation.onSuccess({ id: "org-1" });
    });

    expect(h.invalidateQueries).toHaveBeenCalledWith({
      queryKey: ["orgs", "my"],
    });
    expect(h.selectAfterCreate).toHaveBeenCalledWith("org-1");
    expect(h.push).toHaveBeenCalledWith("/org");
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(nameField().value).toBe("");
  });

  test("on error: shows the error alert and keeps the dialog open", async () => {
    renderDialog();
    await fillAndSubmit("Acme");

    await act(async () => {
      mutationOptions().mutation.onError();
    });

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent("createOrgError");
    expect(onClose).not.toHaveBeenCalled();
    expect(nameField().value).toBe("Acme");
  });

  test("disables the submit button and shows a pending label while creating", () => {
    h.isPending = true;
    renderDialog();

    expect(submitButton()).toBeDisabled();
    expect(submitButton()).toHaveTextContent("creating");
  });

  test("resets the form and closes when cancel is clicked", () => {
    renderDialog();
    fireEvent.change(nameField(), { target: { value: "Acme" } });

    fireEvent.click(cancelButton());

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(nameField().value).toBe("");
    expect(h.mutate).not.toHaveBeenCalled();
  });

  test("resets the form and closes when Escape is pressed", () => {
    renderDialog();
    fireEvent.change(nameField(), { target: { value: "Acme" } });

    fireEvent.keyDown(screen.getByRole("dialog"), { key: "Escape" });

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(nameField().value).toBe("");
  });
});
