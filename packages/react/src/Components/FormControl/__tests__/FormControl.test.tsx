// ** External Imports
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, test } from "vitest";

afterEach(() => {
  cleanup();
});

// ** Local Imports
import {
  FormControl,
  useFormControl,
  type FormControlOwnProps,
} from "@/Components/FormControl";

const libDefaults = {
  size: "md",
  error: false,
  withoutErrorMessage: false,
} satisfies Partial<FormControlOwnProps>;

function FormControlHarness(props: Omit<FormControlOwnProps, "field"> = {}) {
  const field = useFormControl(props, libDefaults);

  return (
    <FormControl field={field}>
      <input
        type="checkbox"
        aria-label="Control"
        {...field.controlBind}
        {...field.inputInheritedAttrs}
      />
    </FormControl>
  );
}

test("it should render the control element", () => {
  const { container } = render(<FormControlHarness />);

  expect(container.querySelector(".group\\/form-control")).not.toBeNull();
  expect(screen.getByRole("checkbox", { name: "Control" })).toBeTruthy();
});

test("it should render main label when mainLabel prop is provided", () => {
  render(<FormControlHarness mainLabel="Email notifications" />);

  expect(screen.getByText("Email notifications")).toBeTruthy();
});

test("it should link label to inherited input id when id is provided", () => {
  render(
    <FormControlHarness id="form-control-id" mainLabel="Email notifications" />,
  );

  expect(screen.getByLabelText("Email notifications").id).toBe(
    "form-control-id",
  );
});

test("it should render start and end labels when provided", () => {
  render(
    <FormControlHarness endLabel="End" mainLabel="Main" startLabel="Start" />,
  );

  expect(screen.getByText("End")).toBeTruthy();
  expect(screen.getByText("Main")).toBeTruthy();
  expect(screen.getByText("Start")).toBeTruthy();
});

test("it should render description when description prop is provided", () => {
  render(<FormControlHarness description="Helper text" />);

  expect(screen.getByText("Helper text")).toBeTruthy();
});

test("it should hide description when field is invalid", () => {
  render(<FormControlHarness error description="Helper text" />);

  expect(screen.queryByText("Helper text")).toBeNull();
});

test("it should render error message when errorMessage prop is provided", () => {
  render(<FormControlHarness error errorMessage="Required" />);

  expect(screen.getByText("Required")).toBeTruthy();
});

test("it should hide error message content when only error is true", () => {
  const { container } = render(<FormControlHarness error />);

  const errorRegion = container.querySelector('[id$="-error"]');

  expect(errorRegion).not.toBeNull();
  expect(errorRegion?.textContent).toBe("");
  expect(errorRegion?.getAttribute("aria-hidden")).toBe("true");
});

test("it should apply disabled attribute on the control when disabled", () => {
  render(<FormControlHarness disabled />);

  expect((screen.getByRole("checkbox") as HTMLInputElement).disabled).toBe(
    true,
  );
});

test("it should apply readOnly attribute on the control when readonly", () => {
  render(<FormControlHarness readonly />);

  expect((screen.getByRole("checkbox") as HTMLInputElement).readOnly).toBe(
    true,
  );
});

test("it should set aria-invalid on the control when error is set", () => {
  render(<FormControlHarness error />);

  expect(screen.getByRole("checkbox").getAttribute("aria-invalid")).toBe(
    "true",
  );
});

test("it should set aria-describedby to description id when description is shown", () => {
  render(<FormControlHarness description="Helper" controlId="field-id" />);

  const input = screen.getByRole("checkbox");

  expect(document.getElementById("field-id-description")).not.toBeNull();
  expect(input.getAttribute("aria-describedby")).toBe("field-id-description");
});

test("it should set aria-describedby to error id when error is shown", () => {
  render(
    <FormControlHarness error errorMessage="Required" controlId="field-id" />,
  );

  const input = screen.getByRole("checkbox");

  expect(document.getElementById("field-id-error")).not.toBeNull();
  expect(input.getAttribute("aria-describedby")).toBe("field-id-error");
});

test("it should set data-invalid on the root when error is set", () => {
  const { container } = render(<FormControlHarness error />);

  expect(
    container
      .querySelector(".group\\/form-control")
      ?.getAttribute("data-invalid"),
  ).toBe("true");
});

test("it should apply error color on labels when error is set", () => {
  const { container } = render(<FormControlHarness error mainLabel="Label" />);

  expect(container.querySelector("label")?.className).toContain(
    "text-error-600",
  );
});

test("it should not render error region when withoutErrorMessage is true", () => {
  const { container } = render(
    <FormControlHarness error withoutErrorMessage errorMessage="Required" />,
  );

  expect(container.querySelector('[id$="-error"]')).toBeNull();
});

test("it should render main label from slots", () => {
  render(
    <FormControlHarness
      slots={{
        mainLabel: <span>Slot label</span>,
      }}
    />,
  );

  expect(screen.getByText("Slot label")).toBeTruthy();
});
