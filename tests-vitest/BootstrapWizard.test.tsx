import { beforeEach, describe, expect, test, vi } from "vitest";
import { fireEvent, screen } from "@testing-library/react";
import { renderWithProviders } from "./test-utils";
import BootstrapWizard from "@/features/shell/BootstrapWizard";

const h = vi.hoisted(() => ({
  push: vi.fn(),
  selectAfterCreate: vi.fn(),
  createOrgMutate: vi.fn(),
  createProjectMutate: vi.fn(),
  failOrg: false,
  failProject: false,
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: h.push, replace: vi.fn(), prefetch: vi.fn() }),
}));

vi.mock("@/features/shell/ActiveContext", () => ({
  useActiveContext: () => ({ selectAfterCreate: h.selectAfterCreate }),
}));

type MutationOptions<TData> = {
  onSuccess?: (data: TData) => void;
  onError?: () => void;
};

vi.mock("@/api/endpoints/orgs/orgs", () => ({
  useOrgsCreateOrg: () => ({
    mutate: (
      vars: { data: { name: string } },
      opts: MutationOptions<{ id: string }>,
    ) => {
      h.createOrgMutate(vars);
      if (h.failOrg) opts.onError?.();
      else opts.onSuccess?.({ id: "org-1" });
    },
    isPending: false,
  }),
  getOrgsGetMyOrgsQueryKey: () => ["/orgs/"],
}));

vi.mock("@/api/endpoints/projects/projects", () => ({
  useProjectsCreateProject: () => ({
    mutate: (
      vars: { orgId: string; data: { name: string; project_type_id: string } },
      opts: MutationOptions<{ id: string }>,
    ) => {
      h.createProjectMutate(vars);
      if (h.failProject) opts.onError?.();
      else opts.onSuccess?.({ id: "project-1" });
    },
    isPending: false,
  }),
}));

vi.mock("@/api/endpoints/project-types/project-types", () => ({
  useProjectTypesGetProjectTypes: () => ({
    data: { items: [{ id: "pt-1", name: "WordPress" }] },
  }),
}));

beforeEach(() => {
  h.push.mockClear();
  h.selectAfterCreate.mockClear();
  h.createOrgMutate.mockClear();
  h.createProjectMutate.mockClear();
  h.failOrg = false;
  h.failProject = false;
});

function fillAndSubmit() {
  fireEvent.change(screen.getByLabelText("Organization name"), {
    target: { value: "Acme" },
  });
  fireEvent.change(screen.getByLabelText("Project name"), {
    target: { value: "Acme Shop" },
  });
  fireEvent.mouseDown(screen.getByRole("combobox"));
  fireEvent.click(screen.getByRole("option", { name: "WordPress" }));
  fireEvent.click(screen.getByRole("button", { name: "Continue" }));
}

describe("BootstrapWizard", () => {
  test("asks for org name, project name and project type in one step", () => {
    renderWithProviders(<BootstrapWizard />);

    expect(screen.getByLabelText("Organization name")).toBeInTheDocument();
    expect(screen.getByLabelText("Project name")).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  test("rejects empty fields without creating anything", async () => {
    renderWithProviders(<BootstrapWizard />);

    fireEvent.click(screen.getByRole("button", { name: "Continue" }));

    expect(await screen.findAllByText("Name is required")).toHaveLength(2);
    expect(screen.getByText("Required")).toBeInTheDocument();
    expect(h.createOrgMutate).not.toHaveBeenCalled();
  });

  test("creates the org and project together, then redirects to billing onboarding", async () => {
    renderWithProviders(<BootstrapWizard />);

    fillAndSubmit();

    await vi.waitFor(() => {
      expect(h.createProjectMutate).toHaveBeenCalledWith({
        orgId: "org-1",
        data: { org_id: "org-1", name: "Acme Shop", project_type_id: "pt-1" },
      });
    });
    expect(h.selectAfterCreate).toHaveBeenCalledWith("org-1", "project-1");
    expect(h.push).toHaveBeenCalledWith("/billing?onboarding=1");
  });

  test("shows an error and does not create a project when org creation fails", async () => {
    h.failOrg = true;
    renderWithProviders(<BootstrapWizard />);

    fillAndSubmit();

    expect(
      await screen.findByText("Could not create organization"),
    ).toBeInTheDocument();
    expect(h.createProjectMutate).not.toHaveBeenCalled();
    expect(h.push).not.toHaveBeenCalled();
  });

  test("retrying after a project-creation failure reuses the already-created org", async () => {
    h.failProject = true;
    renderWithProviders(<BootstrapWizard />);

    fillAndSubmit();

    expect(
      await screen.findByText("Could not create project"),
    ).toBeInTheDocument();
    expect(h.createOrgMutate).toHaveBeenCalledTimes(1);

    h.failProject = false;
    fireEvent.click(screen.getByRole("button", { name: "Continue" }));

    await vi.waitFor(() => {
      expect(h.push).toHaveBeenCalledWith("/billing?onboarding=1");
    });
    // The org endpoint was only ever hit once — the retry reused createdOrgId.
    expect(h.createOrgMutate).toHaveBeenCalledTimes(1);
  });
});
