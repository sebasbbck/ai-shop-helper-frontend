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
import BootstrapWizard from "@/features/shell/BootstrapWizard";

type OrgMutationOptions = {
  mutation: { onSuccess: (org: { id: string }) => void; onError: () => void };
};
type ProjectMutationOptions = {
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
  createOrg: vi.fn(),
  createProject: vi.fn(),
  orgIsPending: false,
  projectIsPending: false,
  orgOptions: undefined as unknown,
  projectOptions: undefined as unknown,
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

vi.mock("@/api/endpoints/orgs/orgs", () => ({
  useOrgsCreateOrg: (options: unknown) => {
    h.orgOptions = options;
    return { mutate: h.createOrg, isPending: h.orgIsPending };
  },
  getOrgsGetMyOrgsQueryKey: () => ["orgs", "my"],
}));

vi.mock("@/api/endpoints/projects/projects", () => ({
  useProjectsCreateProject: (options: unknown) => {
    h.projectOptions = options;
    return { mutate: h.createProject, isPending: h.projectIsPending };
  },
}));

vi.mock("@/api/endpoints/project-types/project-types", () => ({
  useProjectTypesGetProjectTypes: (...args: unknown[]) => {
    h.typesArgs = args;
    return { data: h.typesData };
  },
}));

vi.mock("@/features/shell/ActiveContext", () => ({
  useActiveContext: () => ({ selectAfterCreate: h.selectAfterCreate }),
}));

const nameField = () => screen.getByLabelText("name") as HTMLInputElement;
const submitButton = () =>
  screen.getByRole("button", { name: /continueButton|finishButton|creating/ });
const submitForm = () => fireEvent.submit(submitButton().closest("form")!);
const orgOptions = () => h.orgOptions as OrgMutationOptions;
const projectOptions = () => h.projectOptions as ProjectMutationOptions;
const typesQueryEnabled = () =>
  (h.typesArgs?.[1] as { query: { enabled: boolean } }).query.enabled;

async function reachProjectStep(orgId = "org-1") {
  fireEvent.change(nameField(), { target: { value: "Acme" } });
  submitForm();
  await waitFor(() => expect(h.createOrg).toHaveBeenCalled());
  act(() => {
    orgOptions().mutation.onSuccess({ id: orgId });
  });
  await screen.findByText("projectHeading");
}

function selectProjectType(name: string) {
  fireEvent.mouseDown(screen.getByRole("combobox"));
  fireEvent.click(
    within(screen.getByRole("listbox")).getByRole("option", { name }),
  );
}

beforeEach(() => {
  h.push.mockClear();
  h.invalidateQueries.mockClear();
  h.selectAfterCreate.mockClear();
  h.createOrg.mockClear();
  h.createProject.mockClear();
  h.orgIsPending = false;
  h.projectIsPending = false;
  h.orgOptions = undefined;
  h.projectOptions = undefined;
  h.typesArgs = undefined;
  h.typesData = { items: types };
});

afterEach(cleanup);

describe("BootstrapWizard, org step", () => {
  test("opens on the org step", () => {
    renderWithProviders(<BootstrapWizard />);

    expect(screen.getByText("stepOf")).toBeInTheDocument();
    expect(screen.getByText("orgHeading")).toBeInTheDocument();
    expect(nameField()).toBeInTheDocument();
    expect(submitButton()).toHaveTextContent("continueButton");
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  test("does not load the project types before they are needed", () => {
    renderWithProviders(<BootstrapWizard />);

    expect(h.typesArgs?.[0]).toEqual({});
    expect(typesQueryEnabled()).toBe(false);
  });

  test("rejects an empty org name", async () => {
    renderWithProviders(<BootstrapWizard />);

    submitForm();

    expect(await screen.findByText("nameRequired")).toBeInTheDocument();
    expect(h.createOrg).not.toHaveBeenCalled();
  });

  test("creates the org with the typed name", async () => {
    renderWithProviders(<BootstrapWizard />);

    fireEvent.change(nameField(), { target: { value: "Acme" } });
    submitForm();

    await waitFor(() =>
      expect(h.createOrg).toHaveBeenCalledWith({ data: { name: "Acme" } }),
    );
  });

  test("disables the button while the org is being created", () => {
    h.orgIsPending = true;
    renderWithProviders(<BootstrapWizard />);

    expect(submitButton()).toBeDisabled();
    expect(submitButton()).toHaveTextContent("creating");
  });

  test("shows an error and stays on the org step when creation fails", async () => {
    renderWithProviders(<BootstrapWizard />);
    fireEvent.change(nameField(), { target: { value: "Acme" } });
    submitForm();
    await waitFor(() => expect(h.createOrg).toHaveBeenCalled());

    act(() => {
      orgOptions().mutation.onError();
    });

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "createOrgError",
    );
    expect(screen.getByText("orgHeading")).toBeInTheDocument();
  });
});

describe("BootstrapWizard, project step", () => {
  test("moves to the project step once the org exists", async () => {
    renderWithProviders(<BootstrapWizard />);

    await reachProjectStep();

    expect(screen.queryByText("orgHeading")).not.toBeInTheDocument();
    expect(submitButton()).toHaveTextContent("finishButton");
    expect(screen.getByRole("combobox")).toBeInTheDocument();
    expect(screen.getAllByText("projectTypeLabel").length).toBeGreaterThan(0);
  });

  test("loads the project types on the project step", async () => {
    renderWithProviders(<BootstrapWizard />);

    await reachProjectStep();

    expect(typesQueryEnabled()).toBe(true);
  });

  test("offers every project type returned by the API", async () => {
    renderWithProviders(<BootstrapWizard />);
    await reachProjectStep();

    fireEvent.mouseDown(screen.getByRole("combobox"));

    const options = within(screen.getByRole("listbox")).getAllByRole("option");
    expect(options.map((o) => o.textContent)).toEqual(["E-commerce", "Blog"]);
  });

  test("renders an empty type list while the types are still loading", async () => {
    h.typesData = undefined;
    renderWithProviders(<BootstrapWizard />);
    await reachProjectStep();

    fireEvent.mouseDown(screen.getByRole("combobox"));

    expect(
      within(screen.getByRole("listbox")).queryAllByRole("option"),
    ).toHaveLength(0);
  });

  test("rejects an empty project name and an unchosen type", async () => {
    renderWithProviders(<BootstrapWizard />);
    await reachProjectStep();

    submitForm();

    expect(await screen.findByText("nameRequired")).toBeInTheDocument();
    expect(screen.getByText("required")).toBeInTheDocument();
    expect(h.createProject).not.toHaveBeenCalled();
  });

  test("creates the project in the org that was just created", async () => {
    renderWithProviders(<BootstrapWizard />);
    await reachProjectStep("org-7");

    fireEvent.change(nameField(), { target: { value: "Shop" } });
    selectProjectType("Blog");
    submitForm();

    await waitFor(() =>
      expect(h.createProject).toHaveBeenCalledWith({
        orgId: "org-7",
        data: { org_id: "org-7", name: "Shop", project_type_id: "pt2" },
      }),
    );
  });

  test("does not create a project when the org id went missing", async () => {
    renderWithProviders(<BootstrapWizard />);
    await reachProjectStep("");

    fireEvent.change(nameField(), { target: { value: "Shop" } });
    selectProjectType("Blog");
    submitForm();

    await waitFor(() =>
      expect(screen.queryByText("nameRequired")).not.toBeInTheDocument(),
    );
    expect(h.createProject).not.toHaveBeenCalled();
  });

  test("disables the button while the project is being created", async () => {
    renderWithProviders(<BootstrapWizard />);
    await reachProjectStep();
    h.projectIsPending = true;

    fireEvent.change(nameField(), { target: { value: "Shop" } });
    submitForm();

    await waitFor(() => expect(submitButton()).toBeDisabled());
    expect(submitButton()).toHaveTextContent("creating");
  });

  test("on success: refreshes the orgs, selects org and project, then navigates", async () => {
    renderWithProviders(<BootstrapWizard />);
    await reachProjectStep("org-7");
    fireEvent.change(nameField(), { target: { value: "Shop" } });
    selectProjectType("E-commerce");
    submitForm();
    await waitFor(() => expect(h.createProject).toHaveBeenCalled());

    await act(async () => {
      await projectOptions().mutation.onSuccess({ id: "proj-9" });
    });

    expect(h.invalidateQueries).toHaveBeenCalledWith({
      queryKey: ["orgs", "my"],
    });
    expect(h.selectAfterCreate).toHaveBeenCalledWith("org-7", "proj-9");
    expect(h.push).toHaveBeenCalledWith("/project");
  });

  test("on error: shows the error and stays on the project step", async () => {
    renderWithProviders(<BootstrapWizard />);
    await reachProjectStep();
    fireEvent.change(nameField(), { target: { value: "Shop" } });
    selectProjectType("E-commerce");
    submitForm();
    await waitFor(() => expect(h.createProject).toHaveBeenCalled());

    act(() => {
      projectOptions().mutation.onError();
    });

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "createProjectError",
    );
    expect(screen.getByText("projectHeading")).toBeInTheDocument();
    expect(h.push).not.toHaveBeenCalled();
  });
});
