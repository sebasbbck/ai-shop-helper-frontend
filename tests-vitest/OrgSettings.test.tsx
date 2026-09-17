import { beforeEach, describe, expect, test, vi } from "vitest";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import { renderWithProviders } from "./test-utils";
import { makeActiveContext } from "./mocks/active-context";
import OrgSettings from "@/features/org/OrgSettings";

type UpdateOrgOptions = {
  mutation?: { onSuccess?: () => void; onError?: () => void };
};

const h = vi.hoisted(() => ({
  mutate: vi.fn(),
  isPending: false,
  options: undefined as UpdateOrgOptions | undefined,
}));

vi.mock("@/features/shell/ActiveContext", () => ({
  useActiveContext: () =>
    makeActiveContext({
      activeOrgId: "org-1",
      activeOrg: { id: "org-1", name: "Acme" },
    }),
}));

vi.mock("@/api/endpoints/orgs/orgs", () => ({
  useOrgsUpdateOrg: (options: UpdateOrgOptions) => {
    h.options = options;
    return { mutate: h.mutate, isPending: h.isPending };
  },
  getOrgsGetMyOrgsQueryKey: () => ["orgs"],
}));

beforeEach(() => {
  h.mutate.mockClear();
  h.isPending = false;
  h.options = undefined;
});

describe("OrgSettings", () => {
  test("pre-fills the form with the active org's name", () => {
    renderWithProviders(<OrgSettings />);
    expect(screen.getByLabelText("Name")).toHaveValue("Acme");
  });

  test("submits the updated name", async () => {
    renderWithProviders(<OrgSettings />);
    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "New Name" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Save changes" }));

    await waitFor(() =>
      expect(h.mutate).toHaveBeenCalledWith({
        orgId: "org-1",
        data: { name: "New Name" },
      }),
    );
  });

  test("shows a validation error and does not submit when the name is empty", () => {
    renderWithProviders(<OrgSettings />);
    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Save changes" }));

    expect(h.mutate).not.toHaveBeenCalled();
  });

  test("shows a success alert after a successful submit", async () => {
    renderWithProviders(<OrgSettings />);
    fireEvent.click(screen.getByRole("button", { name: "Save changes" }));
    expect(await screen.findByText("Changes saved")).toBeInTheDocument();
  });

  test("shows an error alert when the update fails", async () => {
    renderWithProviders(<OrgSettings />);
    fireEvent.click(screen.getByRole("button", { name: "Save changes" }));
    await waitFor(() => expect(h.mutate).toHaveBeenCalled());

    h.options?.mutation?.onError?.();
    expect(
      await screen.findByText("Could not save changes"),
    ).toBeInTheDocument();
    expect(screen.queryByText("Changes saved")).not.toBeInTheDocument();
  });
});
