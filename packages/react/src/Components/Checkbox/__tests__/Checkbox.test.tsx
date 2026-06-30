// ** External Imports
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, test } from "vitest";

afterEach(() => {
  cleanup();
});

// ** Local Imports
import { Checkbox } from "@/Components/Checkbox";

test("it should render a checkbox control", () => {
  render(<Checkbox mainLabel="Accept terms" />);

  expect(screen.getByRole("checkbox", { name: "Accept terms" })).toBeTruthy();
});

test("it should render description when description prop is provided", () => {
  render(
    <Checkbox mainLabel="Accept" description="You must accept to continue" />,
  );

  expect(screen.getByText("You must accept to continue")).toBeTruthy();
});

test("it should render error message when error is set", () => {
  render(<Checkbox error mainLabel="Accept" errorMessage="Required" />);

  expect(screen.getByText("Required")).toBeTruthy();
});

test("it should apply disabled attribute when disabled", () => {
  render(<Checkbox disabled mainLabel="Accept" />);

  expect((screen.getByRole("checkbox") as HTMLInputElement).disabled).toBe(
    true,
  );
});

test("it should set aria-invalid when error is set", () => {
  render(<Checkbox error mainLabel="Accept" />);

  expect(screen.getByRole("checkbox").getAttribute("aria-invalid")).toBe(
    "true",
  );
});

test("it should toggle when clicked in uncontrolled mode", () => {
  render(<Checkbox mainLabel="Accept" defaultChecked={false} />);

  const checkbox = screen.getByRole("checkbox") as HTMLInputElement;

  expect(checkbox.checked).toBe(false);

  fireEvent.click(checkbox);

  expect(checkbox.checked).toBe(true);
});

test("it should reflect checked state when controlled", () => {
  render(<Checkbox checked mainLabel="Accept" />);

  expect((screen.getByRole("checkbox") as HTMLInputElement).checked).toBe(true);
});

test("it should set indeterminate on the native input when indeterminate is true", () => {
  render(
    <Checkbox indeterminate mainLabel="Select all" defaultChecked={false} />,
  );

  expect((screen.getByRole("checkbox") as HTMLInputElement).indeterminate).toBe(
    true,
  );
});

test("it should link main label to control id", () => {
  render(<Checkbox mainLabel="Accept" controlId="terms-checkbox" />);

  expect(screen.getByLabelText("Accept").id).toBe("terms-checkbox");
});
