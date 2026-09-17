import { beforeEach, describe, expect, test, vi } from "vitest";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import { renderWithProviders } from "./test-utils";
import ProjectContextSection from "@/features/project/ProjectContextSection";
import type { ProjectContextResponse } from "@/api/model";

type MutateCallbacks = { onSuccess?: () => void; onError?: () => void };

const baseData: ProjectContextResponse = {
  project_id: "project-1",
  fields: [
    {
      key: "business",
      input_type: "text",
      required: true,
      label_i18n_key: "ProjectContext.business.label",
    },
    {
      key: "audience",
      input_type: "textarea",
      required: false,
      label_i18n_key: "ProjectContext.audience.label",
    },
  ],
  values: { business: "Acme Inc", audience: "" },
};

const h = vi.hoisted(() => ({
  data: undefined as ProjectContextResponse | undefined,
  isLoading: false,
  mutate: vi.fn(),
  isPending: false,
}));

vi.mock("@/api/endpoints/agent-runs/agent-runs", () => ({
  useAgentRunsGetProjectContext: () => ({
    data: h.data,
    isLoading: h.isLoading,
  }),
  useAgentRunsPutProjectContext: () => ({
    mutate: h.mutate,
    isPending: h.isPending,
  }),
}));

beforeEach(() => {
  h.data = undefined;
  h.isLoading = false;
  h.mutate.mockReset();
  h.isPending = false;
});

describe("ProjectContextSection", () => {
  test("shows skeletons while loading", () => {
    h.isLoading = true;
    const { container } = renderWithProviders(
      <ProjectContextSection projectId="project-1" />,
    );
    expect(
      container.querySelectorAll(".MuiSkeleton-root").length,
    ).toBeGreaterThan(0);
  });

  test("renders nothing when there are no context fields", () => {
    h.data = { ...baseData, fields: [] };
    const { container } = renderWithProviders(
      <ProjectContextSection projectId="project-1" />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  test("renders each field pre-filled with its saved value", () => {
    h.data = baseData;
    renderWithProviders(<ProjectContextSection projectId="project-1" />);
    expect(screen.getByLabelText(/About your business/)).toHaveValue(
      "Acme Inc",
    );
    expect(screen.getByLabelText("Target audience")).toHaveValue("");
  });

  test("shows a validation error when a required field is cleared", async () => {
    h.data = baseData;
    const { container } = renderWithProviders(
      <ProjectContextSection projectId="project-1" />,
    );
    fireEvent.change(screen.getByLabelText(/About your business/), {
      target: { value: "" },
    });
    // The field has a native `required` attribute and this form has no
    // `noValidate`, so a button click would be swallowed by the browser's
    // own constraint validation before React ever sees it — submit the
    // form directly to reach the custom RHF rule instead.
    fireEvent.submit(container.querySelector("form")!);

    expect(await screen.findByText("Required")).toBeInTheDocument();
    expect(h.mutate).not.toHaveBeenCalled();
  });

  test("submits the updated context values", async () => {
    h.data = baseData;
    renderWithProviders(<ProjectContextSection projectId="project-1" />);
    fireEvent.change(screen.getByLabelText(/About your business/), {
      target: { value: "Acme Inc. v2" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Save changes" }));

    await waitFor(() =>
      expect(h.mutate).toHaveBeenCalledWith(
        {
          projectId: "project-1",
          data: { values: { business: "Acme Inc. v2", audience: "" } },
        },
        expect.anything(),
      ),
    );
  });

  test("shows a success alert after saving", async () => {
    h.data = baseData;
    h.mutate.mockImplementation((_: unknown, callbacks: MutateCallbacks) =>
      callbacks.onSuccess?.(),
    );
    renderWithProviders(<ProjectContextSection projectId="project-1" />);
    fireEvent.change(screen.getByLabelText(/About your business/), {
      target: { value: "Acme Inc. v2" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Save changes" }));

    expect(await screen.findByText("Configuration saved")).toBeInTheDocument();
  });

  test("shows an error alert when saving fails", async () => {
    h.data = baseData;
    h.mutate.mockImplementation((_: unknown, callbacks: MutateCallbacks) =>
      callbacks.onError?.(),
    );
    renderWithProviders(<ProjectContextSection projectId="project-1" />);
    fireEvent.change(screen.getByLabelText(/About your business/), {
      target: { value: "Acme Inc. v2" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Save changes" }));

    expect(
      await screen.findByText("Could not save changes"),
    ).toBeInTheDocument();
  });
});
