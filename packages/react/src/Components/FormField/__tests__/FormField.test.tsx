// ** External Imports
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
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

function FormFieldHarness(props: Omit<FormFieldOwnProps, "field"> = {}) {
  const field = useFormField(props, libDefaults);

  return (
    <FormField field={field}>
      <input {...field.inputBind} aria-label="Field" />
    </FormField>
  );
}

function TextareaFormFieldHarness(
  props: Omit<FormFieldOwnProps, "field"> = {},
) {
  const field = useFormField(props, libDefaults, { control: () => "textarea" });

  return (
    <FormField field={field}>
      <textarea {...field.inputBind} aria-label="Field" />
    </FormField>
  );
}

test("it should render the control element", () => {
  render(<FormFieldHarness />);

  expect(screen.getByRole("textbox")).toBeTruthy();
});

test("it should render a label when label prop is provided", () => {
  render(<FormFieldHarness label="Email" id="email-field" />);

  expect(screen.getByText("Email")).toBeTruthy();
  expect(screen.getByLabelText("Email")).toBeTruthy();
});

test("it should render corner text when corner prop is provided", () => {
  render(<FormFieldHarness corner="Optional" />);

  expect(screen.getByText("Optional")).toBeTruthy();
});

test("it should render description when description prop is provided", () => {
  render(<FormFieldHarness description="Helper text" />);

  expect(screen.getByText("Helper text")).toBeTruthy();
});

test("it should hide description when field is invalid", () => {
  render(<FormFieldHarness error description="Helper text" />);

  expect(screen.queryByText("Helper text")).toBeNull();
});

test("it should render error message when errorMessage prop is provided", () => {
  render(<FormFieldHarness error errorMessage="Required" />);

  expect(screen.getByText("Required")).toBeTruthy();
});

test("it should hide error message content when only error is true", () => {
  const { container } = render(<FormFieldHarness error />);

  const errorRegion = container.querySelector('[id$="-error"]');

  expect(errorRegion).not.toBeNull();
  expect(errorRegion?.textContent).toBe("");
  expect(errorRegion?.getAttribute("aria-hidden")).toBe("true");
});

test("it should apply disabled attribute on the input when disabled", () => {
  render(<FormFieldHarness disabled />);

  expect((screen.getByRole("textbox") as HTMLInputElement).disabled).toBe(true);
});

test("it should apply readOnly attribute when readonly", () => {
  render(<FormFieldHarness readonly />);

  expect((screen.getByRole("textbox") as HTMLInputElement).readOnly).toBe(true);
});

test("it should set aria-invalid on the input when error is set", () => {
  render(<FormFieldHarness error />);

  expect(screen.getByRole("textbox").getAttribute("aria-invalid")).toBe("true");
});

test("it should set aria-describedby to description id when description is shown", () => {
  render(<FormFieldHarness id="field-id" description="Helper" />);

  const input = screen.getByRole("textbox");

  expect(document.getElementById("field-id-description")).not.toBeNull();
  expect(input.getAttribute("aria-describedby")).toBe("field-id-description");
});

test("it should set aria-describedby to error id when error is shown", () => {
  render(<FormFieldHarness error id="field-id" errorMessage="Required" />);

  const input = screen.getByRole("textbox");

  expect(document.getElementById("field-id-error")).not.toBeNull();
  expect(input.getAttribute("aria-describedby")).toBe("field-id-error");
});

test("it should set data-invalid on the root when error is set", () => {
  const { container } = render(<FormFieldHarness error />);

  expect(container.querySelector("[data-invalid='true']")).not.toBeNull();
});

test("it should render start text when start prop is set", () => {
  render(<FormFieldHarness label="Website" start="https://" />);

  expect(screen.getByText("https://")).toBeTruthy();
});

test("it should render start icon when startIcon prop is set", () => {
  const { container } = render(<FormFieldHarness startIcon={CircleAlert} />);

  expect(container.querySelector("svg")).not.toBeNull();
});

test("it should render end icon when endIcon prop is set", () => {
  const { container } = render(<FormFieldHarness endIcon={CircleAlert} />);

  expect(container.querySelectorAll("svg").length).toBeGreaterThan(0);
});

test("it should render error icon when invalid and withErrorIcon is enabled", () => {
  const { container } = render(<FormFieldHarness error />);

  expect(container.querySelector("svg")).not.toBeNull();
});

test("it should render error icon instead of end icon when error is set", () => {
  const { container } = render(
    <FormFieldHarness error endIcon={CircleAlert} />,
  );

  expect(container.querySelectorAll("svg").length).toBe(1);
});

test("it should render error icon when end slot is empty and error is set", () => {
  const { container } = render(
    <FormFieldHarness error slots={{ end: null }} />,
  );

  expect(container.querySelector("svg")).not.toBeNull();
});

test("it should hide error icon when withErrorIcon is false", () => {
  const { container } = render(
    <FormFieldHarness error withErrorIcon={false} />,
  );

  expect(container.querySelector("svg")).toBeNull();
});

test("it should render required asterisk when required is true", () => {
  render(<FormFieldHarness required label="Email" />);

  expect(screen.getByText("*")).toBeTruthy();
});

test("it should apply error color on the label when error is set", () => {
  const { container } = render(<FormFieldHarness error label="Email" />);

  expect(container.querySelector(".text-error-600")).not.toBeNull();
});

test("it should render start slot content", () => {
  render(
    <FormFieldHarness
      slots={{ start: <span data-testid="start-slot">$</span> }}
    />,
  );

  expect(screen.getByTestId("start-slot")).toBeTruthy();
});

test("it should render end slot content", () => {
  render(
    <FormFieldHarness slots={{ end: <span data-testid="end-slot">€</span> }} />,
  );

  expect(screen.getByTestId("end-slot")).toBeTruthy();
});

test("it should merge className with root classes", () => {
  const { container } = render(<FormFieldHarness className="custom-field" />);

  expect(
    container.querySelector(".w-full")?.classList.contains("custom-field"),
  ).toBe(true);
});

test("it should forward additional attributes to the input", () => {
  render(
    <FormFieldHarness
      id="field-id"
      placeholder="Enter email"
      customProps={{
        input: { "data-testid": "form-field-input" },
      }}
    />,
  );

  const input = screen.getByTestId("form-field-input");

  expect(input.id).toBe("field-id");
  expect(input.getAttribute("placeholder")).toBe("Enter email");
});

test("it should forward customProps to the input", () => {
  render(
    <FormFieldHarness
      customProps={{
        input: { "data-testid": "form-field-input" },
      }}
    />,
  );

  expect(screen.getByTestId("form-field-input")).toBeTruthy();
});

test("it should forward customProps to description", () => {
  render(
    <FormFieldHarness
      description="Helper"
      customProps={{
        description: { "data-testid": "field-description" },
      }}
    />,
  );

  expect(screen.getByTestId("field-description")).toBeTruthy();
});

test("it should apply user className after classes.root (tailwind-merge)", () => {
  const { container } = render(
    <FormFieldHarness className="p-4" classes={{ root: "p-2" }} />,
  );

  const root = container.querySelector(".w-full");

  expect(root?.classList.contains("p-4")).toBe(true);
  expect(root?.classList.contains("p-2")).toBe(false);
});

test("it should forward classes and customProps to chrome", () => {
  render(
    <FormFieldHarness
      label="Email"
      corner="Optional"
      classes={{
        label: "custom-label-class",
        corner: "custom-corner-class",
      }}
      customProps={{
        label: { "data-testid": "field-label" },
        corner: { "data-testid": "field-corner" },
      }}
    />,
  );

  expect(
    screen.getByTestId("field-label").classList.contains("custom-label-class"),
  ).toBe(true);
  expect(
    screen
      .getByTestId("field-corner")
      .classList.contains("custom-corner-class"),
  ).toBe(true);
});

test("it should merge classes.input onto the control", () => {
  render(
    <FormFieldHarness
      placeholder="Type here"
      classes={{ input: "placeholder:italic" }}
    />,
  );

  expect(
    screen.getByRole("textbox").classList.contains("placeholder:italic"),
  ).toBe(true);
});

test("it should render slots.errorMessage as the error region", () => {
  render(
    <FormFieldHarness
      error
      slots={{
        errorMessage: <span data-testid="custom-error">Validation failed</span>,
      }}
    />,
  );

  expect(screen.getByTestId("custom-error")).toBeTruthy();
});

test("it should update chrome when label and error props change", () => {
  const { rerender } = render(
    <FormFieldHarness label="First" description="Helper" />,
  );

  expect(screen.getByText("First")).toBeTruthy();
  expect(screen.getByText("Helper")).toBeTruthy();

  rerender(<FormFieldHarness error label="Second" errorMessage="Required" />);

  expect(screen.queryByText("First")).toBeNull();
  expect(screen.getByText("Second")).toBeTruthy();
  expect(screen.queryByText("Helper")).toBeNull();
  expect(screen.getByText("Required")).toBeTruthy();
});

test("it should update the input value when changed", () => {
  render(<FormFieldHarness defaultValue="" />);

  const input = screen.getByRole("textbox") as HTMLInputElement;

  fireEvent.change(input, { target: { value: "hello" } });

  expect(input.value).toBe("hello");
});

test("it should render filled variant container styles", () => {
  const { container } = render(
    <FormFieldHarness label="Email" variant="filled" />,
  );

  expect(container.querySelector(".bg-gray-100")).not.toBeNull();
});

test("it should render notched variant with floating label row", () => {
  const { container } = render(
    <FormFieldHarness label="Email" variant="notched" />,
  );

  expect(container.querySelector(".-translate-y-1\\/2")).not.toBeNull();
});

test("it should render stacked variant with stacked body layout", () => {
  const { container } = render(
    <FormFieldHarness label="Quantity" variant="stacked" />,
  );

  expect(
    container.querySelector(".flex.min-h-0.min-w-0.flex-1.flex-col"),
  ).not.toBeNull();
});

test("it should render underlined variant with bottom border", () => {
  const { container } = render(<FormFieldHarness variant="underlined" />);

  expect(container.querySelector(".border-b-2")).not.toBeNull();
});

test("it should render textarea control with textarea sizing", () => {
  const { container } = render(<TextareaFormFieldHarness />);

  expect(container.querySelector("textarea")).not.toBeNull();
  expect(screen.getByRole("textbox").className).toContain("py-2");
});

test("it should apply error styles on the container when error is set", () => {
  const { container } = render(<FormFieldHarness error />);

  expect(container.querySelector(".group\\/field")?.className).toContain(
    "ring-error-500",
  );
});
