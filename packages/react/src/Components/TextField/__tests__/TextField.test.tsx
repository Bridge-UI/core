// ** External Imports
import { cleanup, render, screen } from "@testing-library/react";
import { CircleAlert } from "lucide-react";
import { afterEach, expect, test } from "vitest";

afterEach(() => {
  cleanup();
});

// ** Local Imports
import { TextField } from "@/Components/TextField";

test("it should render the root element", () => {
  const { container } = render(<TextField />);

  expect(container.querySelector("input")).not.toBeNull();
  expect(container.querySelector(".w-full")).not.toBeNull();
});

test("it should render a label when label prop is provided", () => {
  render(<TextField label="Email" />);

  expect(screen.getByText("Email")).toBeTruthy();
  expect(screen.getByText("Email").tagName).toBe("LABEL");
});

test("it should render description when description prop is provided", () => {
  render(<TextField description="Helper text" />);

  expect(screen.getByText("Helper text")).toBeTruthy();
});

test("it should hide description when field is invalid", () => {
  render(<TextField error description="Helper text" />);

  expect(screen.queryByText("Helper text")).toBeNull();
});

test("it should render error message when errorMessage prop is provided", () => {
  render(<TextField error errorMessage="Required" />);

  expect(screen.getByText("Required")).toBeTruthy();
});

test("it should apply disabled attribute on the input when disabled", () => {
  render(<TextField disabled />);

  expect(screen.getByRole("textbox")).toHaveProperty("disabled", true);
});

test("it should set aria-invalid on the input when error is set", () => {
  render(<TextField error />);

  expect(screen.getByRole("textbox").getAttribute("aria-invalid")).toBe("true");
});

test("it should render start icon when startIcon prop is set", () => {
  const { container } = render(<TextField startIcon={CircleAlert} />);

  expect(container.querySelector("svg")).not.toBeNull();
});

test("it should render end slot content", () => {
  render(
    <TextField
      slots={{
        end: <span>€</span>,
      }}
    />,
  );

  expect(screen.getByText("€")).toBeTruthy();
});

test("it should merge className with root classes", () => {
  const { container } = render(<TextField className="custom-field" />);

  expect(container.querySelector(".custom-field")).not.toBeNull();
});

test("it should forward placeholder to the input", () => {
  const { container } = render(<TextField placeholder="Enter email" />);

  expect(
    container.querySelector('input[placeholder="Enter email"]'),
  ).not.toBeNull();
});
