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

  render(<NumberField step={2} value={2} onChange={onChange} />);

  fireEvent.click(screen.getByRole("button", { name: "Increment value" }));

  expect(onChange).toHaveBeenCalledWith(4);
});

test("it should decrement value when decrement button is clicked", () => {
  const onChange = vi.fn();

  render(<NumberField step={2} value={4} onChange={onChange} />);

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

test("it should stack increment above decrement by default", () => {
  render(<NumberField />);

  const increment = screen.getByRole("button", { name: "Increment value" });
  const decrement = screen.getByRole("button", { name: "Decrement value" });

  expect(increment.compareDocumentPosition(decrement)).toBe(
    Node.DOCUMENT_POSITION_FOLLOWING,
  );
  expect(increment.querySelector(".lucide-chevron-up")).not.toBeNull();
  expect(decrement.querySelector(".lucide-chevron-down")).not.toBeNull();
});

test("it should place decrement before increment for default controls", () => {
  render(<NumberField controlVariant="default" />);

  const increment = screen.getByRole("button", { name: "Increment value" });
  const decrement = screen.getByRole("button", { name: "Decrement value" });

  expect(decrement.compareDocumentPosition(increment)).toBe(
    Node.DOCUMENT_POSITION_FOLLOWING,
  );
});

test("it should place decrement before the input when split", () => {
  const { container } = render(<NumberField controlVariant="split" />);

  const input = container.querySelector("input");
  const increment = screen.getByRole("button", { name: "Increment value" });
  const decrement = screen.getByRole("button", { name: "Decrement value" });

  expect(input).not.toBeNull();
  expect(decrement.compareDocumentPosition(input!)).toBe(
    Node.DOCUMENT_POSITION_FOLLOWING,
  );
  expect(input!.compareDocumentPosition(increment)).toBe(
    Node.DOCUMENT_POSITION_FOLLOWING,
  );
  expect(decrement.querySelector(".lucide-minus")).not.toBeNull();
  expect(increment.querySelector(".lucide-plus")).not.toBeNull();
});
