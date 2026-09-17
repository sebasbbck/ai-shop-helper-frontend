import { describe, expect, test } from "vitest";
import { useForm } from "react-hook-form";
import { fireEvent, screen } from "@testing-library/react";
import { renderWithProviders } from "./test-utils";
import SchemaInputField from "@/features/agents/SchemaInputField";
import { InputType } from "@/api/model/inputType";
import { InputScope } from "@/api/model/inputScope";
import type { AgentInputSchema } from "@/api/model/agentInputSchema";

function makeInput(
  overrides: Partial<AgentInputSchema> = {},
): AgentInputSchema {
  return {
    id: "input-1",
    key: "field",
    input_type: InputType.text,
    options: null,
    options_from_step_slug: null,
    scope: InputScope.run,
    order: 0,
    required: false,
    label_i18n_key: "AgentInputs.chosen_title.label",
    ...overrides,
  };
}

function Probe({
  input,
  dynamicOptions,
}: {
  input: AgentInputSchema;
  dynamicOptions?: string[];
}) {
  const { control, handleSubmit } = useForm<{ field: string }>({
    defaultValues: { field: "" },
  });
  return (
    <form onSubmit={handleSubmit(() => {})} noValidate>
      <SchemaInputField
        input={input}
        control={control}
        name="field"
        dynamicOptions={dynamicOptions}
      />
      <button type="submit">Submit</button>
    </form>
  );
}

describe("SchemaInputField", () => {
  test("resolves the label from the translation key", () => {
    renderWithProviders(<Probe input={makeInput()} />);
    expect(screen.getByLabelText("Choose a title")).toBeInTheDocument();
  });

  test("falls back to the raw key when the translation is missing", () => {
    renderWithProviders(
      <Probe input={makeInput({ label_i18n_key: "Unknown.missing_key" })} />,
    );
    expect(screen.getByLabelText("Unknown.missing_key")).toBeInTheDocument();
  });

  test("renders a multiline field for the textarea type", () => {
    renderWithProviders(
      <Probe input={makeInput({ input_type: InputType.textarea })} />,
    );
    expect(screen.getByLabelText("Choose a title").tagName).toBe("TEXTAREA");
  });

  test("shows a required error when submitted empty", async () => {
    renderWithProviders(<Probe input={makeInput({ required: true })} />);
    fireEvent.click(screen.getByRole("button", { name: "Submit" }));
    expect(await screen.findByText("Required")).toBeInTheDocument();
  });

  test("renders the given static options for a select field", () => {
    renderWithProviders(
      <Probe
        input={makeInput({
          input_type: InputType.select,
          options: ["short", "long"],
        })}
      />,
    );
    fireEvent.mouseDown(screen.getByRole("combobox"));
    expect(screen.getByRole("option", { name: "short" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "long" })).toBeInTheDocument();
  });

  test("prefers dynamicOptions over the schema's static options", () => {
    renderWithProviders(
      <Probe
        input={makeInput({
          input_type: InputType.select,
          options: ["short", "long"],
        })}
        dynamicOptions={["from-api-1", "from-api-2"]}
      />,
    );
    fireEvent.mouseDown(screen.getByRole("combobox"));
    expect(
      screen.getByRole("option", { name: "from-api-1" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("option", { name: "short" }),
    ).not.toBeInTheDocument();
  });
});
