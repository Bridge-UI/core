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
  hideErrorMessage: false,
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

  expect(screen.getByRole("checkbox", { name: "Control" })).toBeTruthy();
  expect(container.querySelector(".group\\/form-control")).not.toBeNull();
});

test("it should render end label when endLabel prop is provided", () => {
  render(<FormControlHarness endLabel="Email notifications" />);

  expect(screen.getByText("Email notifications")).toBeTruthy();
});

test("it should link label to inherited input id when id is provided", () => {
  render(
    <FormControlHarness id="form-control-id" endLabel="Email notifications" />,
  );

  expect(screen.getByLabelText("Email notifications").id).toBe(
    "form-control-id",
  );
});

test("it should render start and end labels when provided", () => {
  render(<FormControlHarness endLabel="End" startLabel="Start" />);

  expect(screen.getByText("End")).toBeTruthy();
  expect(screen.getByText("Start")).toBeTruthy();
});

test("it should render start, control, and end in DOM order", () => {
  const { container } = render(
    <FormControlHarness endLabel="End" startLabel="Start" />,
  );

  const row = container.querySelector(".group\\/form-control > div");
  const children = row ? Array.from(row.children) : [];

  expect(children).toHaveLength(3);
  expect(row?.className).toContain("flex-row");
  expect(children[2]?.textContent).toContain("End");
  expect(children[0]?.textContent).toContain("Start");
  expect(children[1]?.getAttribute("type")).toBe("checkbox");
});

test("it should keep logical DOM order under dir=rtl", () => {
  const { container } = render(
    <div dir="rtl">
      <FormControlHarness endLabel="End" startLabel="Start" />
    </div>,
  );

  const row = container.querySelector(".group\\/form-control > div");
  const children = row ? Array.from(row.children) : [];

  expect(children[2]?.textContent).toContain("End");
  expect(children[0]?.textContent).toContain("Start");
  expect(children[1]?.getAttribute("type")).toBe("checkbox");
});

test("it should render a required asterisk on the end label when required", () => {
  render(<FormControlHarness required endLabel="Email notifications" />);

  expect(screen.getByText("*")).toBeTruthy();
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
    <FormControlHarness error controlId="field-id" errorMessage="Required" />,
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
  const { container } = render(<FormControlHarness error endLabel="Label" />);

  expect(container.querySelector("label")?.className).toContain(
    "text-error-600",
  );
});

test("it should not render error region when hideErrorMessage is true", () => {
  const { container } = render(
    <FormControlHarness error hideErrorMessage errorMessage="Required" />,
  );

  expect(container.querySelector('[id$="-error"]')).toBeNull();
});

test("it should render end label from slots", () => {
  render(
    <FormControlHarness
      slots={{
        endLabel: <span>Slot label</span>,
      }}
    />,
  );

  expect(screen.getByText("Slot label")).toBeTruthy();
});
