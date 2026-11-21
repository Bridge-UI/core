// ** External Imports
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, test } from "vitest";

afterEach(() => {
  cleanup();
});

// ** Local Imports
import { Checkbox } from "@/Components/Checkbox";

test("it should render a checkbox control", () => {
  render(<Checkbox endLabel="Accept terms" />);

  expect(screen.getByRole("checkbox", { name: "Accept terms" })).toBeTruthy();
});

test("it should render description when description prop is provided", () => {
  render(
    <Checkbox endLabel="Accept" description="You must accept to continue" />,
  );

  expect(screen.getByText("You must accept to continue")).toBeTruthy();
});

test("it should render error message when error is set", () => {
  render(<Checkbox error endLabel="Accept" errorMessage="Required" />);

  expect(screen.getByText("Required")).toBeTruthy();
});

test("it should apply disabled attribute when disabled", () => {
  render(<Checkbox disabled endLabel="Accept" />);

  expect((screen.getByRole("checkbox") as HTMLInputElement).disabled).toBe(
    true,
  );
});

test("it should set aria-invalid when error is set", () => {
  render(<Checkbox error endLabel="Accept" />);

  expect(screen.getByRole("checkbox").getAttribute("aria-invalid")).toBe(
    "true",
  );
});

test("it should toggle when clicked in uncontrolled mode", () => {
  render(<Checkbox endLabel="Accept" defaultChecked={false} />);

  const checkbox = screen.getByRole("checkbox") as HTMLInputElement;

  expect(checkbox.checked).toBe(false);

  fireEvent.click(checkbox);

  expect(checkbox.checked).toBe(true);
});

test("it should reflect checked state when controlled", () => {
  render(<Checkbox checked endLabel="Accept" />);

  expect((screen.getByRole("checkbox") as HTMLInputElement).checked).toBe(true);
});

test("it should set indeterminate on the native input when indeterminate is true", () => {
  render(
    <Checkbox indeterminate endLabel="Select all" defaultChecked={false} />,
  );

  expect((screen.getByRole("checkbox") as HTMLInputElement).indeterminate).toBe(
    true,
  );
});

test("it should link end label to control id", () => {
  render(<Checkbox endLabel="Accept" controlId="terms-checkbox" />);

  expect(screen.getByLabelText("Accept").id).toBe("terms-checkbox");
});

test("it should forward extra HTML props only to the checkbox input", () => {
  const { container } = render(
    <Checkbox
      id="field-attrs"
      name="field-attrs"
      data-test="field-attrs"
      aria-describedby="field-help"
    />,
  );

  const control = container.querySelector('input[type="checkbox"]');
  const tagged = container.querySelectorAll('[data-test="field-attrs"]');

  expect(tagged).toHaveLength(1);
  expect(tagged[0]).toBe(control);
  expect(control?.getAttribute("id")).toBe("field-attrs");
  expect(control?.getAttribute("name")).toBe("field-attrs");
  expect(container.querySelectorAll("#field-attrs")).toHaveLength(1);
  expect(control?.getAttribute("aria-describedby")).toBe("field-help");
});

test("it should apply className and style to the root, not the checkbox input", () => {
  const { container } = render(
    <Checkbox className="field-root" style={{ width: 240 }} />,
  );

  const root = container.querySelector<HTMLElement>(".field-root");
  const control = container.querySelector('input[type="checkbox"]');

  expect(root?.style.width).toBe("240px");
  expect(root?.contains(control)).toBe(true);
  expect(control?.getAttribute("style")).toBeNull();
  expect(control?.classList.contains("field-root")).toBe(false);
});

test("it should keep a consumer aria-describedby next to the description id", () => {
  render(
    <Checkbox
      id="field-id"
      endLabel="Accept"
      description="Helper"
      aria-describedby="field-help"
    />,
  );

  expect(screen.getByRole("checkbox").getAttribute("aria-describedby")).toBe(
    "field-id-description field-help",
  );
});
