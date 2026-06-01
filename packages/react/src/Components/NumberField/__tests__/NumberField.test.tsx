// ** External Imports
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";

afterEach(() => {
  cleanup();
});

// ** Local Imports
import { NumberField } from "@/Components/NumberField";

test("it should render a number input", () => {
  const { container } = render(<NumberField />);

  expect(container.querySelector('input[type="number"]')).not.toBeNull();
});

test("it should render increment and decrement buttons", () => {
  render(<NumberField />);

  expect(screen.getByRole("button", { name: "Increment value" })).toBeTruthy();
  expect(screen.getByRole("button", { name: "Decrement value" })).toBeTruthy();
});

test("it should increment value when increment button is clicked", () => {
  const onChange = vi.fn();

  render(<NumberField modelValue={2} step={2} onChange={onChange} />);

  fireEvent.click(screen.getByRole("button", { name: "Increment value" }));

  expect(onChange).toHaveBeenCalledWith(4);
});

test("it should decrement value when decrement button is clicked", () => {
  const onChange = vi.fn();

  render(<NumberField modelValue={4} step={2} onChange={onChange} />);

  fireEvent.click(screen.getByRole("button", { name: "Decrement value" }));

  expect(onChange).toHaveBeenCalledWith(2);
});

test("it should disable stepper buttons when disabled", () => {
  render(<NumberField disabled />);

  expect(
    screen.getByRole("button", { name: "Increment value" }),
  ).toHaveProperty("disabled", true);
});

test("it should render a label when label prop is provided", () => {
  render(<NumberField label="Quantity" />);

  expect(screen.getByText("Quantity")).toBeTruthy();
});
