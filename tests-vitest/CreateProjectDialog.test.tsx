import type { ComponentProps } from "react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import {
  act,
  cleanup,
  fireEvent,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { renderWithProviders } from "./test-utils";
import { makeRouter } from "./mocks/router";
import CreateProjectDialog from "@/components/layout/CreateProjectDialog";

type MutationOptions = {
  mutation: {
    onSuccess: (project: { id: string }) => Promise<void> | void;
    onError: () => void;
  };
};

const types = [
  { id: "pt1", name: "E-commerce" },
  { id: "pt2", name: "Blog" },
];

const h = vi.hoisted(() => ({
  push: vi.fn(),
  invalidateQueries: vi.fn(),
  selectAfterCreate: vi.fn(),
  createProject: vi.fn(),
  isPending: false,
  activeOrgId: "org-1" as string | null,
  mutationOptions: undefined as unknown,
  typesArgs: undefined as unknown[] | undefined,
  typesData: undefined as { items: { id: string; name: string }[] } | undefined,
}));

vi.mock("next/navigation", () => {
  let router: ReturnType<typeof makeRouter> | undefined;
  return { useRouter: () => (router ??= makeRouter({ push: h.push })) };
});

vi.mock("next-intl", async (importOriginal) => ({
  ...(await importOriginal<typeof import("next-intl")>()),
  useTranslations: () => (key: string) => key,
}));

vi.mock("@tanstack/react-query", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@tanstack/react-query")>()),
  useQueryClient: () => ({ invalidateQueries: h.invalidateQueries }),
}));

vi.mock("@/api/endpoints/projects/projects", () => ({
  useProjectsCreateProject: (options: unknown) => {
    h.mutationOptions = options;
    return { mutate: h.createProject, isPending: h.isPending };
  },
}));

vi.mock("@/api/endpoints/project-types/project-types", () => ({
  useProjectTypesGetProjectTypes: (...args: unknown[]) => {
    h.typesArgs = args;
    return { data: h.typesData };
  },
}));

vi.mock("@/api/endpoints/orgs/orgs", () => ({
  getOrgsGetMyOrgsQueryKey: () => ["orgs", "my"],
}));

vi.mock("@/features/shell/ActiveContext", () => ({
  useActiveContext: () => ({
    activeOrgId: h.activeOrgId,
    selectAfterCreate: h.selectAfterCreate,
  }),
}));

const onClose = vi.fn();

function renderDialog(
  props: Partial<ComponentProps<typeof CreateProjectDialog>> = {},
) {
  return renderWithProviders(
    <CreateProjectDialog open onClose={onClose} {...props} />,
  );
}

const nameField = () => screen.getByLabelText("name") as HTMLInputElement;
const typeSelect = () => screen.getByRole("combobox");
const submitButton = () =>
  screen.getByRole("button", { name: /create|creating/ });
const cancelButton = () => screen.getByRole("button", { name: "cancel" });
const submitForm = () => fireEvent.submit(submitButton().closest("form")!);
const mutationOptions = () => h.mutationOptions as MutationOptions;
const typesQueryEnabled = () =>
  (h.typesArgs?.[1] as { query: { enabled: boolean } }).query.enabled;

function selectType(name: string) {
  fireEvent.mouseDown(typeSelect());
  fireEvent.click(
    within(screen.getByRole("listbox")).getByRole("option", { name }),
  );
}

async function fillAndSubmit(name = "Shop", type = "Blog") {
  fireEvent.change(nameField(), { target: { value: name } });
  selectType(type);
  submitForm();
  await waitFor(() => expect(h.createProject).toHaveBeenCalled());
}

beforeEach(() => {
  h.push.mockClear();
  h.invalidateQueries.mockClear();
  h.selectAfterCreate.mockClear();
  h.createProject.mockClear();
  h.isPending = false;
  h.activeOrgId = "org-1";
  h.mutationOptions = undefined;
  h.typesArgs = undefined;
  h.typesData = { items: types };
  onClose.mockClear();
});

afterEach(cleanup);

describe("CreateProjectDialog", () => {
  test("renders the form when open", () => {
    renderDialog();

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("newProject")).toBeInTheDocument();
    expect(nameField()).toBeInTheDocument();
    expect(typeSelect()).toBeInTheDocument();
    expect(submitButton()).toHaveTextContent("create");
    expect(cancelButton()).toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  test("renders nothing and skips the type request while closed", () => {
    renderDialog({ open: false });

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(h.typesArgs?.[0]).toEqual({});
    expect(typesQueryEnabled()).toBe(false);
  });

  test("loads the project types once it opens", () => {
    renderDialog();

    expect(typesQueryEnabled()).toBe(true);
  });

  test("offers every project type returned by the API", () => {
    renderDialog();

    fireEvent.mouseDown(typeSelect());

    const options = within(screen.getByRole("listbox")).getAllByRole("option");
    expect(options.map((option) => option.textContent)).toEqual([
      "E-commerce",
      "Blog",
    ]);
  });

  test("offers nothing while the types are still loading", () => {
    h.typesData = undefined;
    renderDialog();

    fireEvent.mouseDown(typeSelect());

    expect(
      within(screen.getByRole("listbox")).queryAllByRole("option"),
    ).toHaveLength(0);
  });

  test("rejects an empty name and an unchosen type", async () => {
    renderDialog();

    submitForm();

    expect(await screen.findByText("nameRequired")).toBeInTheDocument();
    expect(screen.getByText("required")).toBeInTheDocument();
    expect(h.createProject).not.toHaveBeenCalled();
  });

  test("creates the project in the active org", async () => {
    renderDialog();

    await fillAndSubmit("Shop", "Blog");

    expect(h.createProject).toHaveBeenCalledWith({
      orgId: "org-1",
      data: { org_id: "org-1", name: "Shop", project_type_id: "pt2" },
    });
  });

  test("does nothing on submit when no org is active", async () => {
    h.activeOrgId = null;
    renderDialog();

    fireEvent.change(nameField(), { target: { value: "Shop" } });
    selectType("Blog");
    submitForm();

    await waitFor(() =>
      expect(screen.queryByText("nameRequired")).not.toBeInTheDocument(),
    );
    expect(h.createProject).not.toHaveBeenCalled();
  });

  test("disables the submit button when no org is active", () => {
    h.activeOrgId = null;
    renderDialog();

    expect(submitButton()).toBeDisabled();
  });

  test("disables the submit button and shows a pending label while creating", () => {
    h.isPending = true;
    renderDialog();

    expect(submitButton()).toBeDisabled();
    expect(submitButton()).toHaveTextContent("creating");
  });

  test("on success: refreshes the orgs, selects the project, navigates and closes", async () => {
    renderDialog();
    await fillAndSubmit();

    await act(async () => {
      await mutationOptions().mutation.onSuccess({ id: "proj-9" });
    });

    expect(h.invalidateQueries).toHaveBeenCalledWith({
      queryKey: ["orgs", "my"],
    });
    expect(h.selectAfterCreate).toHaveBeenCalledWith("org-1", "proj-9");
    expect(h.push).toHaveBeenCalledWith("/project");
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(nameField().value).toBe("");
  });

  test("on error: shows the error alert and keeps the dialog open", async () => {
    renderDialog();
    await fillAndSubmit();

    await act(async () => {
      mutationOptions().mutation.onError();
    });

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "createProjectError",
    );
    expect(onClose).not.toHaveBeenCalled();
    expect(nameField().value).toBe("Shop");
  });

  test("resets the form and closes when cancel is clicked", () => {
    renderDialog();
    fireEvent.change(nameField(), { target: { value: "Shop" } });

    fireEvent.click(cancelButton());

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(nameField().value).toBe("");
    expect(h.createProject).not.toHaveBeenCalled();
  });

  test("resets the form and closes when Escape is pressed", () => {
    renderDialog();
    fireEvent.change(nameField(), { target: { value: "Shop" } });

    fireEvent.keyDown(screen.getByRole("dialog"), { key: "Escape" });

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(nameField().value).toBe("");
  });
});
