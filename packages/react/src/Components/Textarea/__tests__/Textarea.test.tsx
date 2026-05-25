// ** External Imports
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, test } from "vitest";

afterEach(() => {
  cleanup();
});

// ** Local Imports
import { Textarea } from "@/Components/Textarea";

test("it should render the root element", () => {
  const { container } = render(<Textarea aria-label="Field" />);

  expect(screen.getByRole("textbox")).toBeTruthy();
  expect(container.querySelector(".w-full")).not.toBeNull();
});

test("it should render a label when label prop is provided", () => {
  render(<Textarea label="Notes" id="notes-field" />);

  expect(screen.getByText("Notes")).toBeTruthy();
  expect(screen.getByLabelText("Notes")).toBeTruthy();
});

test("it should render corner text when corner prop is provided", () => {
  render(<Textarea corner="Optional" aria-label="Field" />);

  expect(screen.getByText("Optional")).toBeTruthy();
});

test("it should render description when description prop is provided", () => {
  render(<Textarea description="Helper text" aria-label="Field" />);

  expect(screen.getByText("Helper text")).toBeTruthy();
});

test("it should hide description when field is invalid", () => {
  render(<Textarea error description="Helper text" aria-label="Field" />);

  expect(screen.queryByText("Helper text")).toBeNull();
});

test("it should render error message when errorMessage prop is provided", () => {
  render(<Textarea error errorMessage="Required" aria-label="Field" />);

  expect(screen.getByText("Required")).toBeTruthy();
});

test("it should not render error message when only error is true", () => {
  render(<Textarea error aria-label="Field" />);

  expect(screen.queryByRole("paragraph")).toBeNull();
});

test("it should apply disabled attribute when disabled", () => {
  render(<Textarea disabled aria-label="Field" />);

  expect((screen.getByRole("textbox") as HTMLTextAreaElement).disabled).toBe(
    true,
  );
});

test("it should apply readOnly attribute when readonly", () => {
  render(<Textarea readonly aria-label="Field" />);

  expect((screen.getByRole("textbox") as HTMLTextAreaElement).readOnly).toBe(
    true,
  );
});

test("it should set aria-invalid on the textarea when error is set", () => {
  render(<Textarea error aria-label="Field" />);

  expect(screen.getByRole("textbox").getAttribute("aria-invalid")).toBe("true");
});

test("it should set aria-describedby to description id when description is shown", () => {
  render(<Textarea description="Helper" id="field-id" aria-label="Field" />);

  const textarea = screen.getByRole("textbox");

  expect(document.getElementById("field-id-description")).not.toBeNull();
  expect(textarea.getAttribute("aria-describedby")).toBe(
    "field-id-description",
  );
});

test("it should set aria-describedby to error id when error is shown", () => {
  render(
    <Textarea error errorMessage="Required" id="field-id" aria-label="Field" />,
  );

  const textarea = screen.getByRole("textbox");

  expect(document.getElementById("field-id-error")).not.toBeNull();
  expect(textarea.getAttribute("aria-describedby")).toBe("field-id-error");
});

test("it should set data-invalid on the root when error is set", () => {
  const { container } = render(<Textarea error aria-label="Field" />);

  expect(container.querySelector("[data-invalid='true']")).not.toBeNull();
});

test("it should render required asterisk when required is true", () => {
  render(<Textarea label="Notes" required aria-label="Notes" />);

  expect(screen.getByText("*")).toBeTruthy();
});

test("it should apply error color on the label when error is set", () => {
  const { container } = render(
    <Textarea label="Notes" error aria-label="Notes" />,
  );

  expect(container.querySelector(".text-error-600")).not.toBeNull();
});

test("it should merge className with root classes", () => {
  const { container } = render(
    <Textarea className="custom-field" aria-label="Field" />,
  );

  expect(
    container.querySelector(".w-full")?.classList.contains("custom-field"),
  ).toBe(true);
});

test("it should forward additional attributes to the textarea", () => {
  render(
    <Textarea
      rows={4}
      id="field-id"
      aria-label="Notes"
      placeholder="Enter notes"
      data-testid="textarea-input"
    />,
  );

  const textarea = screen.getByTestId("textarea-input");

  expect(textarea.id).toBe("field-id");
  expect(textarea.getAttribute("rows")).toBe("4");
  expect(textarea.getAttribute("placeholder")).toBe("Enter notes");
});

test("it should forward partsProps to the textarea", () => {
  render(
    <Textarea
      aria-label="Field"
      partsProps={{
        input: { "data-testid": "textarea-input" },
      }}
    />,
  );

  expect(screen.getByTestId("textarea-input")).toBeTruthy();
});

test("it should forward partsProps to description", () => {
  render(
    <Textarea
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
    <Textarea className="p-4" classes={{ root: "p-2" }} aria-label="Field" />,
  );

  const root = container.querySelector(".w-full");

  expect(root?.classList.contains("p-4")).toBe(true);
  expect(root?.classList.contains("p-2")).toBe(false);
});

test("it should forward FormField classes and partsProps to chrome", () => {
  render(
    <Textarea
      label="Notes"
      corner="Optional"
      aria-label="Notes"
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
    <Textarea
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
    <Textarea
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
    <Textarea label="First" aria-label="Field" description="Helper" />,
  );

  expect(screen.getByText("First")).toBeTruthy();
  expect(screen.getByText("Helper")).toBeTruthy();

  rerender(
    <Textarea
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

test("it should update the textarea value when changed", () => {
  render(<Textarea defaultValue="" aria-label="Notes" />);

  const textarea = screen.getByRole("textbox") as HTMLTextAreaElement;

  fireEvent.change(textarea, { target: { value: "hello" } });

  expect(textarea.value).toBe("hello");
});

test("it should apply resize-none when autosize is enabled", () => {
  render(<Textarea autosize aria-label="Field" />);

  expect(screen.getByRole("textbox").classList.contains("resize-none")).toBe(
    true,
  );
});

test("it should apply resize-y when autosize is disabled", () => {
  render(<Textarea aria-label="Field" />);

  expect(screen.getByRole("textbox").classList.contains("resize-y")).toBe(true);
});

test("it should apply error border classes on the textarea when invalid", () => {
  render(<Textarea error aria-label="Field" />);

  expect(
    screen.getByRole("textbox").classList.contains("border-error-500"),
  ).toBe(true);
});
