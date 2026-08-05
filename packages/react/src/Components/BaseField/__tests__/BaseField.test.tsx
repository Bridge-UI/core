// ** External Imports
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, test } from "vitest";

afterEach(() => {
  cleanup();
});

// ** Local Imports
import {
  BaseField,
  useBaseField,
  type BaseFieldOwnProps,
} from "@/Components/BaseField";

const libDefaults = {
  size: "md",
  error: false,
  hideErrorMessage: false,
} satisfies Partial<BaseFieldOwnProps>;

function BaseFieldHarness(props: Omit<BaseFieldOwnProps, "field"> = {}) {
  const field = useBaseField(props, libDefaults);

  return (
    <BaseField field={field}>
      <input type="text" aria-label="Control" />
    </BaseField>
  );
}

test("it should render the control element inside the group", () => {
  render(<BaseFieldHarness />);

  expect(screen.getByRole("textbox", { name: "Control" })).toBeTruthy();
  expect(screen.getByRole("group")).toBeTruthy();
});

test("it should render a label when label prop is provided", () => {
  render(<BaseFieldHarness label="Email address" />);

  expect(screen.getByText("Email address")).toBeTruthy();
});

test("it should render a corner label when corner prop is provided", () => {
  render(<BaseFieldHarness corner="Optional" />);

  expect(screen.getByText("Optional")).toBeTruthy();
});

test("it should render description when description prop is provided", () => {
  render(<BaseFieldHarness description="Helper text" />);

  expect(screen.getByText("Helper text")).toBeTruthy();
});

test("it should hide description when field is invalid", () => {
  render(<BaseFieldHarness error description="Helper text" />);

  expect(screen.queryByText("Helper text")).toBeNull();
});

test("it should render error message when errorMessage prop is provided", () => {
  render(<BaseFieldHarness error errorMessage="Required" />);

  expect(screen.getByText("Required")).toBeTruthy();
});

test("it should render start slot content", () => {
  render(
    <BaseFieldHarness
      slots={{ start: <span data-testid="start-slot">🔒</span> }}
    />,
  );

  expect(screen.getByTestId("start-slot")).toBeTruthy();
});

test("it should render end slot content", () => {
  render(
    <BaseFieldHarness
      slots={{ end: <span data-testid="end-slot">Clear</span> }}
    />,
  );

  expect(screen.getByTestId("end-slot")).toBeTruthy();
});

test("it should set data-invalid on the root when error is set", () => {
  const { container } = render(<BaseFieldHarness error />);

  expect(container.querySelector(".group")?.getAttribute("data-invalid")).toBe(
    "true",
  );
});

test("it should set aria-describedby on the group when description is shown", () => {
  render(<BaseFieldHarness description="Helper" controlId="field-id" />);

  const group = screen.getByRole("group");

  expect(document.getElementById("field-id-description")).not.toBeNull();
  expect(group.getAttribute("aria-describedby")).toBe("field-id-description");
});

test("it should set aria-describedby on the group when error is shown", () => {
  render(
    <BaseFieldHarness error controlId="field-id" errorMessage="Required" />,
  );

  const group = screen.getByRole("group");

  expect(document.getElementById("field-id-error")).not.toBeNull();
  expect(group.getAttribute("aria-describedby")).toBe("field-id-error");
});

test("it should render a required asterisk on the label when required", () => {
  render(<BaseFieldHarness required label="Email address" />);

  expect(screen.getByText("*")).toBeTruthy();
});
