// ** External Imports
import { cleanup, render, screen } from "@testing-library/react";
import { CircleAlert } from "lucide-react";
import { afterEach, expect, test } from "vitest";

// ** Local Imports
import { FormField, useFormField } from "@/Components/FormField";
import type { FormFieldOwnProps } from "@/Components/FormField/formField.types";

afterEach(() => {
  cleanup();
});

const libDefaults = {
  size: "md",
  rounded: "md",
  color: "primary",
  variant: "outline",
  withErrorIcon: true,
} satisfies Partial<FormFieldOwnProps>;

function FormFieldHarness(props: Omit<FormFieldOwnProps, "field">) {
  const field = useFormField(props, libDefaults);

  return (
    <FormField field={field}>
      <input {...field.inputBind} />
    </FormField>
  );
}

test("it should render the control element", () => {
  render(<FormFieldHarness />);

  expect(screen.getByRole("textbox")).toBeTruthy();
});

test("it should render a label when label prop is provided", () => {
  render(<FormFieldHarness label="Email" />);

  expect(screen.getByText("Email")).toBeTruthy();
  expect(screen.getByText("Email").tagName).toBe("LABEL");
});

test("it should render description when description prop is provided", () => {
  render(<FormFieldHarness description="Helper text" />);

  expect(screen.getByText("Helper text")).toBeTruthy();
});

test("it should render error message when errorMessage prop is provided", () => {
  render(<FormFieldHarness error errorMessage="Required" />);

  expect(screen.getByText("Required")).toBeTruthy();
});

test("it should apply disabled attribute on the input when disabled", () => {
  render(<FormFieldHarness disabled />);

  expect(screen.getByRole("textbox")).toHaveProperty("disabled", true);
});

test("it should set aria-invalid on the input when error is set", () => {
  render(<FormFieldHarness error />);

  expect(screen.getByRole("textbox").getAttribute("aria-invalid")).toBe("true");
});

test("it should render start icon when startIcon prop is set", () => {
  const { container } = render(<FormFieldHarness startIcon={CircleAlert} />);

  expect(container.querySelector("svg")).not.toBeNull();
});

test("it should render end slot content", () => {
  function EndSlotHarness() {
    const field = useFormField(
      {
        label: "Amount",
        slots: { end: <span>€</span> },
      },
      libDefaults,
    );

    return (
      <FormField field={field}>
        <input {...field.inputBind} />
      </FormField>
    );
  }

  render(<EndSlotHarness />);

  expect(screen.getByText("€")).toBeTruthy();
});
