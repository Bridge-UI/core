// ** External Imports
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, test } from "vitest";

afterEach(() => {
  cleanup();
});

// ** Local Imports
import { Textarea } from "@/Components/Textarea";

test("it should render a textarea element", () => {
  const { container } = render(<Textarea />);

  expect(container.querySelector(".w-full")).not.toBeNull();
  expect(container.querySelector("textarea")).not.toBeNull();
});

test("it should render a label when label prop is provided", () => {
  render(<Textarea label="Notes" />);

  expect(screen.getByText("Notes")).toBeTruthy();
});

test("it should render description when description prop is provided", () => {
  render(<Textarea description="Helper text" />);

  expect(screen.getByText("Helper text")).toBeTruthy();
});

test("it should set aria-invalid when error is set", () => {
  render(<Textarea error />);

  expect(screen.getByRole("textbox").getAttribute("aria-invalid")).toBe("true");
});

test("it should apply disabled attribute when disabled", () => {
  render(<Textarea disabled />);

  expect(screen.getByRole("textbox")).toHaveProperty("disabled", true);
});

test("it should apply vertical resize class when resize is vertical", () => {
  const { container } = render(<Textarea resize="vertical" />);

  expect(container.querySelector(".resize-y")).not.toBeNull();
});

test("it should forward placeholder to the textarea", () => {
  const { container } = render(<Textarea placeholder="Write here" />);

  expect(
    container.querySelector('textarea[placeholder="Write here"]'),
  ).not.toBeNull();
});
