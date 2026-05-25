// ** External Imports
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { CircleAlert } from "lucide-react";
import { afterEach, expect, test } from "vitest";

afterEach(() => {
  cleanup();
});

// ** Local Imports
import { TextField } from "@/Components/TextField";

test("it should render the root element", () => {
  const { container } = render(<TextField aria-label="Field" />);

  expect(screen.getByRole("textbox")).toBeTruthy();
  expect(container.querySelector(".w-full")).not.toBeNull();
});

test("it should render a label when label prop is provided", () => {
  render(<TextField label="Email" id="email-field" />);

  expect(screen.getByText("Email")).toBeTruthy();
  expect(screen.getByLabelText("Email")).toBeTruthy();
});

test("it should render corner text when corner prop is provided", () => {
  render(<TextField corner="Optional" aria-label="Field" />);

  expect(screen.getByText("Optional")).toBeTruthy();
});

test("it should render description when description prop is provided", () => {
  render(<TextField description="Helper text" aria-label="Field" />);

  expect(screen.getByText("Helper text")).toBeTruthy();
});

test("it should hide description when field is invalid", () => {
  render(<TextField error description="Helper text" aria-label="Field" />);

  expect(screen.queryByText("Helper text")).toBeNull();
});

test("it should render error message when errorMessage prop is provided", () => {
  render(<TextField error errorMessage="Required" aria-label="Field" />);

  expect(screen.getByText("Required")).toBeTruthy();
});

test("it should not render error message when only error is true", () => {
  render(<TextField error aria-label="Field" />);

  expect(screen.queryByRole("paragraph")).toBeNull();
});

test("it should apply disabled attribute when disabled", () => {
  render(<TextField disabled aria-label="Field" />);

  expect((screen.getByRole("textbox") as HTMLInputElement).disabled).toBe(true);
});

test("it should apply readOnly attribute when readonly", () => {
  render(<TextField readonly aria-label="Field" />);

  expect((screen.getByRole("textbox") as HTMLInputElement).readOnly).toBe(true);
});

test("it should set aria-invalid on the input when error is set", () => {
  render(<TextField error aria-label="Field" />);

  expect(screen.getByRole("textbox").getAttribute("aria-invalid")).toBe("true");
});

test("it should set aria-describedby to description id when description is shown", () => {
  render(<TextField description="Helper" id="field-id" aria-label="Field" />);

  const input = screen.getByRole("textbox");

  expect(document.getElementById("field-id-description")).not.toBeNull();
  expect(input.getAttribute("aria-describedby")).toBe("field-id-description");
});

test("it should set aria-describedby to error id when error is shown", () => {
  render(
    <TextField
      error
      errorMessage="Required"
      id="field-id"
      aria-label="Field"
    />,
  );

  const input = screen.getByRole("textbox");

  expect(document.getElementById("field-id-error")).not.toBeNull();
  expect(input.getAttribute("aria-describedby")).toBe("field-id-error");
});

test("it should set data-invalid on the root when error is set", () => {
  const { container } = render(<TextField error aria-label="Field" />);

  expect(container.querySelector("[data-invalid='true']")).not.toBeNull();
});

test("it should render start text when start prop is set", () => {
  render(<TextField label="Website" start="https://" aria-label="Website" />);

  expect(screen.getByText("https://")).toBeTruthy();
});

test("it should render start icon when startIcon prop is set", () => {
  const { container } = render(
    <TextField startIcon={CircleAlert} aria-label="Field" />,
  );

  expect(container.querySelector("svg")).not.toBeNull();
});

test("it should render end icon when endIcon prop is set", () => {
  const { container } = render(
    <TextField endIcon={CircleAlert} aria-label="Field" />,
  );

  expect(container.querySelectorAll("svg").length).toBeGreaterThan(0);
});

test("it should render error icon when invalid and withErrorIcon is enabled", () => {
  const { container } = render(<TextField error aria-label="Field" />);

  expect(container.querySelector("svg")).not.toBeNull();
});

test("it should render error icon instead of end icon when error is set", () => {
  const { container } = render(
    <TextField endIcon={CircleAlert} error aria-label="Field" />,
  );

  expect(container.querySelectorAll("svg").length).toBe(1);
});

test("it should render error icon when end slot is empty and error is set", () => {
  const { container } = render(
    <TextField error aria-label="Field" slots={{ end: null }} />,
  );

  expect(container.querySelector("svg")).not.toBeNull();
});

test("it should hide error icon when withErrorIcon is false", () => {
  const { container } = render(
    <TextField error withErrorIcon={false} aria-label="Field" />,
  );

  expect(container.querySelector("svg")).toBeNull();
});

test("it should render required asterisk when required is true", () => {
  render(<TextField label="Email" required aria-label="Email" />);

  expect(screen.getByText("*")).toBeTruthy();
});

test("it should apply error color on the label when error is set", () => {
  const { container } = render(
    <TextField label="Email" error aria-label="Email" />,
  );

  expect(container.querySelector(".text-error-600")).not.toBeNull();
});

test("it should render start slot content", () => {
  render(
    <TextField
      aria-label="Field"
      slots={{ start: <span data-testid="start-slot">$</span> }}
    />,
  );

  expect(screen.getByTestId("start-slot")).toBeTruthy();
});

test("it should render end slot content", () => {
  render(
    <TextField
      aria-label="Field"
      slots={{ end: <span data-testid="end-slot">€</span> }}
    />,
  );

  expect(screen.getByTestId("end-slot")).toBeTruthy();
});

test("it should merge className with root classes", () => {
  const { container } = render(
    <TextField className="custom-field" aria-label="Field" />,
  );

  expect(
    container.querySelector(".w-full")?.classList.contains("custom-field"),
  ).toBe(true);
});

test("it should forward additional attributes to the input", () => {
  render(
    <TextField
      id="field-id"
      aria-label="Email"
      placeholder="Enter email"
      data-testid="text-field-input"
    />,
  );

  const input = screen.getByTestId("text-field-input");

  expect(input.id).toBe("field-id");
  expect(input.getAttribute("placeholder")).toBe("Enter email");
});

test("it should forward partsProps to the input", () => {
  render(
    <TextField
      aria-label="Field"
      partsProps={{
        input: { "data-testid": "text-field-input" },
      }}
    />,
  );

  expect(screen.getByTestId("text-field-input")).toBeTruthy();
});

test("it should forward partsProps to description", () => {
  render(
    <TextField
      aria-label="Field"
      description="Helper"
      partsProps={{
        description: { "data-testid": "field-description" },
      }}
    />,
  );

  expect(screen.getByTestId("field-description")).toBeTruthy();
});

test("it should apply user className after classes.root (tailwind-merge)", () => {
  const { container } = render(
    <TextField className="p-4" classes={{ root: "p-2" }} aria-label="Field" />,
  );

  const root = container.querySelector(".w-full");

  expect(root?.classList.contains("p-4")).toBe(true);
  expect(root?.classList.contains("p-2")).toBe(false);
});

test("it should forward FormField classes and partsProps to chrome", () => {
  render(
    <TextField
      label="Email"
      corner="Optional"
      aria-label="Email"
      classes={{
        label: "custom-label-class",
        corner: "custom-corner-class",
      }}
      partsProps={{
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
    <TextField
      aria-label="Field"
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
    <TextField
      error
      aria-label="Field"
      slots={{
        errorMessage: <span data-testid="custom-error">Validation failed</span>,
      }}
    />,
  );

  expect(screen.getByTestId("custom-error")).toBeTruthy();
});

test("it should update FormField chrome when label and error props change", () => {
  const { rerender } = render(
    <TextField label="First" aria-label="Field" description="Helper" />,
  );

  expect(screen.getByText("First")).toBeTruthy();
  expect(screen.getByText("Helper")).toBeTruthy();

  rerender(
    <TextField
      error
      label="Second"
      aria-label="Field"
      errorMessage="Required"
    />,
  );

  expect(screen.queryByText("First")).toBeNull();
  expect(screen.getByText("Second")).toBeTruthy();
  expect(screen.queryByText("Helper")).toBeNull();
  expect(screen.getByText("Required")).toBeTruthy();
});

test("it should update the input value when changed", () => {
  render(<TextField defaultValue="" aria-label="Email" />);

  const input = screen.getByRole("textbox") as HTMLInputElement;

  fireEvent.change(input, { target: { value: "hello" } });

  expect(input.value).toBe("hello");
});
