import { beforeEach, describe, expect, test, vi } from "vitest";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import { renderWithProviders } from "./test-utils";
import { makeActiveContext } from "./mocks/active-context";
import AgentRun from "@/features/agents/AgentRun";
import { InputType } from "@/api/model/inputType";
import { InputScope } from "@/api/model/inputScope";
import type { AgentStepSchema } from "@/api/model/agentStepSchema";

type RunCallbacks = {
  onSuccess?: (run: { id: string }) => void;
  onError?: (err: unknown) => void;
};

const stepsWithRunInput: AgentStepSchema[] = [
  {
    id: "step-1",
    order: 0,
    slug: "generate",
    inputs: [
      {
        id: "input-1",
        key: "topic",
        input_type: InputType.text,
        options: null,
        options_from_step_slug: null,
        scope: InputScope.run,
        order: 0,
        required: true,
        label_i18n_key: "AgentInputs.chosen_title.label",
      },
      {
        id: "input-2",
        key: "tone",
        input_type: InputType.text,
        options: null,
        options_from_step_slug: null,
        scope: InputScope.project,
        order: 1,
        required: false,
        label_i18n_key: "AgentInputs.image_method.label",
      },
    ],
  },
];

const h = vi.hoisted(() => ({
  projectId: "project-1" as string | undefined,
  contextLoading: false,
  schema: undefined as { steps: AgentStepSchema[] } | undefined,
  schemaLoading: false,
  createMutate: vi.fn(),
  createIsPending: false,
}));

vi.mock("@/features/shell/ActiveContext", () => ({
  useActiveContext: () =>
    makeActiveContext({
      activeProject: h.projectId ? { id: h.projectId } : undefined,
      isLoading: h.contextLoading,
    }),
}));

vi.mock("@/api/endpoints/agent-runs/agent-runs", () => ({
  useAgentRunsGetAgentSchema: () => ({
    data: h.schema,
    isLoading: h.schemaLoading,
  }),
  useAgentRunsCreateRun: () => ({
    mutate: h.createMutate,
    isPending: h.createIsPending,
  }),
}));

vi.mock("@/features/agents/RunProgress", () => ({
  default: ({ runId, onReset }: { runId: string; onReset: () => void }) => (
    <div data-testid="run-progress">
      <span data-testid="run-id">{runId}</span>
      <button onClick={onReset}>Reset</button>
    </div>
  ),
}));

vi.mock("@/features/agents/RunHistory", () => ({
  default: () => <div data-testid="run-history" />,
}));

beforeEach(() => {
  h.projectId = "project-1";
  h.contextLoading = false;
  h.schema = undefined;
  h.schemaLoading = false;
  h.createMutate.mockReset();
  h.createIsPending = false;
});

describe("AgentRun", () => {
  test("shows skeletons while loading", () => {
    h.schemaLoading = true;
    const { container } = renderWithProviders(<AgentRun agentId="agent-1" />);
    expect(
      container.querySelectorAll(".MuiSkeleton-root").length,
    ).toBeGreaterThan(0);
  });

  test("shows a message when there is no active project", () => {
    h.projectId = undefined;
    renderWithProviders(<AgentRun agentId="agent-1" />);
    expect(
      screen.getByText(
        "This agent does not exist or is not available for your current project.",
      ),
    ).toBeInTheDocument();
  });

  test("shows a message when the agent has no live schema", () => {
    h.schema = undefined;
    renderWithProviders(<AgentRun agentId="agent-1" />);
    expect(screen.getByText("Execution not available yet")).toBeInTheDocument();
  });

  test("only renders run-scoped inputs in the form", () => {
    h.schema = { steps: stepsWithRunInput };
    renderWithProviders(<AgentRun agentId="agent-1" />);
    expect(screen.getByLabelText("Choose a title")).toBeInTheDocument();
    expect(screen.queryByLabelText("Image method")).not.toBeInTheDocument();
  });

  test("starts a run with the entered run inputs", async () => {
    h.schema = { steps: stepsWithRunInput };
    renderWithProviders(<AgentRun agentId="agent-1" />);
    fireEvent.change(screen.getByLabelText("Choose a title"), {
      target: { value: "My topic" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Run agent" }));

    await waitFor(() =>
      expect(h.createMutate).toHaveBeenCalledWith(
        {
          projectId: "project-1",
          agentId: "agent-1",
          data: { run_inputs: { topic: "My topic" } },
        },
        expect.anything(),
      ),
    );
  });

  test("shows the progress view once a run has started", async () => {
    h.schema = { steps: stepsWithRunInput };
    h.createMutate.mockImplementation((_: unknown, callbacks: RunCallbacks) =>
      callbacks.onSuccess?.({ id: "run-123" }),
    );
    renderWithProviders(<AgentRun agentId="agent-1" />);
    fireEvent.change(screen.getByLabelText("Choose a title"), {
      target: { value: "My topic" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Run agent" }));

    expect(await screen.findByTestId("run-progress")).toBeInTheDocument();
    expect(screen.getByTestId("run-id").textContent).toBe("run-123");
  });

  test("returns to the form when the progress view resets", async () => {
    h.schema = { steps: stepsWithRunInput };
    h.createMutate.mockImplementation((_: unknown, callbacks: RunCallbacks) =>
      callbacks.onSuccess?.({ id: "run-123" }),
    );
    renderWithProviders(<AgentRun agentId="agent-1" />);
    fireEvent.change(screen.getByLabelText("Choose a title"), {
      target: { value: "My topic" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Run agent" }));
    fireEvent.click(await screen.findByRole("button", { name: "Reset" }));

    expect(
      screen.getByRole("button", { name: "Run agent" }),
    ).toBeInTheDocument();
  });

  test("shows the insufficient-credits message for a 402 error", async () => {
    h.schema = { steps: stepsWithRunInput };
    h.createMutate.mockImplementation((_: unknown, callbacks: RunCallbacks) =>
      callbacks.onError?.({ response: { status: 402 } }),
    );
    renderWithProviders(<AgentRun agentId="agent-1" />);
    fireEvent.change(screen.getByLabelText("Choose a title"), {
      target: { value: "My topic" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Run agent" }));

    expect(
      await screen.findByText(
        "Not enough credits. Top up your balance to run this agent.",
      ),
    ).toBeInTheDocument();
  });

  test("toggles the run history panel", () => {
    h.schema = { steps: [] };
    renderWithProviders(<AgentRun agentId="agent-1" />);
    expect(screen.queryByTestId("run-history")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Previous runs" }));
    expect(screen.getByTestId("run-history")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Previous runs" }));
    expect(screen.queryByTestId("run-history")).not.toBeInTheDocument();
  });
});
