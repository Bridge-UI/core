// ** External Imports
import { cleanup, render, screen } from "@testing-library/react";
import { CircleAlert } from "lucide-react";
import { afterEach, expect, test } from "vitest";

afterEach(() => {
  cleanup();
});

// ** Local Imports
import { Textarea } from "@/Components/Textarea";

test("it should render a textarea element", () => {
  const { container } = render(<Textarea aria-label="Notes" />);

  expect(container.querySelector(".w-full")).not.toBeNull();
  expect(container.querySelector("textarea")).not.toBeNull();
});

test("it should render a label when label prop is provided", () => {
  render(<Textarea label="Notes" aria-label="Notes" />);

  expect(screen.getByText("Notes")).toBeTruthy();
});

test("it should render description when description prop is provided", () => {
  render(<Textarea aria-label="Notes" description="Helper text" />);

  expect(screen.getByText("Helper text")).toBeTruthy();
});

test("it should hide description when field is invalid", () => {
  render(<Textarea error aria-label="Notes" description="Helper text" />);

  expect(screen.queryByText("Helper text")).toBeNull();
});

test("it should render error message when errorMessage prop is provided", () => {
  render(<Textarea error aria-label="Notes" errorMessage="Required" />);

  expect(screen.getByText("Required")).toBeTruthy();
});

test("it should set aria-invalid when error is set", () => {
  render(<Textarea error aria-label="Notes" />);

  expect(screen.getByRole("textbox").getAttribute("aria-invalid")).toBe("true");
});

test("it should apply disabled attribute when disabled", () => {
  render(<Textarea disabled aria-label="Notes" />);

  expect(screen.getByRole("textbox")).toHaveProperty("disabled", true);
});

test("it should set aria-describedby to description id when description is shown", () => {
  render(<Textarea id="notes-field" aria-label="Notes" description="Helper" />);

  const textarea = screen.getByRole("textbox");

  expect(document.getElementById("notes-field-description")).not.toBeNull();
  expect(textarea.getAttribute("aria-describedby")).toBe(
    "notes-field-description",
  );
});

test("it should render error icon when error is set", () => {
  const { container } = render(<Textarea error aria-label="Notes" />);

  expect(container.querySelector("svg")).not.toBeNull();
});

test("it should render start icon when startIcon prop is set", () => {
  const { container } = render(
    <Textarea aria-label="Notes" startIcon={CircleAlert} />,
  );

  expect(container.querySelector("svg")).not.toBeNull();
});

test("it should apply vertical resize class when resize is vertical", () => {
  const { container } = render(
    <Textarea resize="vertical" aria-label="Notes" />,
  );

  expect(container.querySelector(".resize-y")).not.toBeNull();
});

test("it should forward placeholder to the textarea", () => {
  const { container } = render(
    <Textarea aria-label="Notes" placeholder="Write here" />,
  );

  expect(
    container.querySelector('textarea[placeholder="Write here"]'),
  ).not.toBeNull();
});

test("it should use compact input-like sizing when likeInput is true", () => {
  render(<Textarea likeInput aria-label="Notes" />);

  expect(screen.getByRole("textbox").className).toMatch(/py-\[calc/);
});

test("it should set data-invalid on the root when error is set", () => {
  const { container } = render(<Textarea error aria-label="Notes" />);

  expect(container.querySelector("[data-invalid='true']")).not.toBeNull();
});
