import { beforeEach, describe, expect, test, vi } from "vitest";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import { renderWithProviders } from "./test-utils";
import RunProgress from "@/features/agents/RunProgress";
import { RunStatus } from "@/api/model/runStatus";
import { InputType } from "@/api/model/inputType";
import { InputScope } from "@/api/model/inputScope";
import type { AgentRunPublic } from "@/api/model/agentRunPublic";
import type { AgentRunStepPublic } from "@/api/model/agentRunStepPublic";
import type { AgentStepSchema } from "@/api/model/agentStepSchema";

function makeRunStep(
  overrides: Partial<AgentRunStepPublic> = {},
): AgentRunStepPublic {
  return {
    id: "run-step-1",
    step_id: "step-1",
    status: RunStatus.success,
    input_snapshot: {},
    output: null,
    external_ref: null,
    started_at: null,
    finished_at: null,
    error: null,
    ...overrides,
  };
}

function makeRun(overrides: Partial<AgentRunPublic> = {}): AgentRunPublic {
  return {
    id: "run-1",
    project_id: "project-1",
    agent_id: "agent-1",
    status: RunStatus.running,
    current_step_order: 0,
    error: null,
    credits_debited: 0,
    created_by: "user-1",
    created_at: "2026-09-01T00:00:00Z",
    finished_at: null,
    steps: [],
    ...overrides,
  };
}

const schema: AgentStepSchema[] = [
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
        required: false,
        label_i18n_key: "AgentInputs.chosen_title.label",
      },
    ],
  },
];

const h = vi.hoisted(() => ({
  run: undefined as AgentRunPublic | undefined,
  submitMutate: vi.fn(),
  submitIsPending: false,
  submitIsError: false,
}));

vi.mock("@/api/endpoints/agent-runs/agent-runs", () => ({
  useAgentRunsGetRun: () => ({ data: h.run }),
  useAgentRunsSubmitRunInputs: () => ({
    mutate: h.submitMutate,
    isPending: h.submitIsPending,
    isError: h.submitIsError,
  }),
}));

beforeEach(() => {
  h.run = undefined;
  h.submitMutate.mockClear();
  h.submitIsPending = false;
  h.submitIsError = false;
});

describe("RunProgress", () => {
  test("shows a spinner until the run loads", () => {
    renderWithProviders(
      <RunProgress runId="run-1" schema={schema} onReset={vi.fn()} />,
    );
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  test("lists each step with its status", () => {
    h.run = makeRun({
      status: RunStatus.running,
      steps: [
        makeRunStep({
          id: "rs-1",
          step_id: "step-1",
          status: RunStatus.success,
        }),
      ],
    });
    renderWithProviders(
      <RunProgress runId="run-1" schema={schema} onReset={vi.fn()} />,
    );
    expect(screen.getByText("generate")).toBeInTheDocument();
    expect(screen.getByText("success")).toBeInTheDocument();
  });

  test("shows a running indicator while pending", () => {
    h.run = makeRun({ status: RunStatus.running });
    renderWithProviders(
      <RunProgress runId="run-1" schema={schema} onReset={vi.fn()} />,
    );
    expect(screen.getByText("Running…")).toBeInTheDocument();
  });

  test("shows the completion link on success", () => {
    h.run = makeRun({
      status: RunStatus.success,
      steps: [
        makeRunStep({
          status: RunStatus.success,
          output: {
            title: "My Post",
            url_post: "https://my-store.com/blog/post",
          },
        }),
      ],
    });
    renderWithProviders(
      <RunProgress runId="run-1" schema={schema} onReset={vi.fn()} />,
    );
    expect(screen.getByText("Completed successfully")).toBeInTheDocument();
    expect(screen.getByText("My Post")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /View post/ })).toHaveAttribute(
      "href",
      "https://my-store.com/blog/post",
    );
  });

  test("calls onReset when running again after success", () => {
    const onReset = vi.fn();
    h.run = makeRun({ status: RunStatus.success, steps: [] });
    renderWithProviders(
      <RunProgress runId="run-1" schema={schema} onReset={onReset} />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Run again" }));
    expect(onReset).toHaveBeenCalledTimes(1);
  });

  test("shows the run error and a refund note when credits were debited", () => {
    h.run = makeRun({
      status: RunStatus.failed,
      error: "Something broke upstream",
      credits_debited: 10,
      steps: [],
    });
    renderWithProviders(
      <RunProgress runId="run-1" schema={schema} onReset={vi.fn()} />,
    );
    expect(screen.getByText("Something broke upstream")).toBeInTheDocument();
    expect(screen.getByText("Credits have been refunded.")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Try again" }),
    ).toBeInTheDocument();
  });

  test("submits the awaited step's inputs", async () => {
    h.run = makeRun({
      status: RunStatus.awaiting_input,
      current_step_order: 0,
      steps: [],
    });
    renderWithProviders(
      <RunProgress runId="run-1" schema={schema} onReset={vi.fn()} />,
    );

    expect(screen.getByText("Input required")).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Choose a title"), {
      target: { value: "New topic" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Continue" }));

    await waitFor(() =>
      expect(h.submitMutate).toHaveBeenCalledWith({
        runId: "run-1",
        data: { inputs: { topic: "New topic" } },
      }),
    );
  });

  test("shows an error alert when submitting awaited inputs fails", () => {
    h.run = makeRun({
      status: RunStatus.awaiting_input,
      current_step_order: 0,
      steps: [],
    });
    h.submitIsError = true;
    renderWithProviders(
      <RunProgress runId="run-1" schema={schema} onReset={vi.fn()} />,
    );
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  });
});
