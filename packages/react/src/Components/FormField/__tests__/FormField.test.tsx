// ** External Imports
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, test } from "vitest";

// ** Local Imports
import { FormField } from "@/Components/FormField";

afterEach(() => {
  cleanup();
});

test("it should render label text from prop", () => {
  render(
    <FormField label="Email" controlId="field-id">
      <input id="field-id" aria-label="Email" />
    </FormField>,
  );

  const label = screen.getByText("Email");

  expect(label.tagName).toBe("LABEL");
  expect(label.getAttribute("for")).toBe("field-id");
});

test("it should apply error color when error is true", () => {
  const { container } = render(<FormField label="Email" error />);

  expect(container.querySelector(".text-error-600")).not.toBeNull();
});

test("it should render required asterisk when required is true", () => {
  render(<FormField label="Email" required />);

  expect(screen.getByText("*")).toBeTruthy();
});

test("it should render description when description prop is provided", () => {
  render(<FormField description="Helper text" />);

  expect(screen.getByText("Helper text")).toBeTruthy();
});

test("it should hide description when field is invalid", () => {
  render(<FormField error={true} description="Helper text" />);

  expect(screen.queryByText("Helper text")).toBeNull();
});

test("it should render error message when errorMessage prop is provided", () => {
  render(<FormField errorMessage="Required" />);

  expect(screen.getByText("Required")).toBeTruthy();
});

test("it should render corner text when corner prop is provided", () => {
  render(<FormField corner="Optional" />);

  expect(screen.getByText("Optional")).toBeTruthy();
});

test("it should apply size typography on corner", () => {
  const { container } = render(<FormField corner="Optional" size="2xl" />);

  expect(container.querySelector(".text-lg")).not.toBeNull();
});
