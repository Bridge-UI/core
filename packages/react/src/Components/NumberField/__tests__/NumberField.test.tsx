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

test("it should place decrement before increment for inline controls", () => {
  render(<NumberField controlVariant="inline" />);

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

test("it should forward extra HTML props only to the input", () => {
  const { container } = render(
    <NumberField
      id="field-attrs"
      name="field-attrs"
      data-test="field-attrs"
      aria-describedby="field-help"
    />,
  );

  const control = container.querySelector("input");
  const tagged = container.querySelectorAll('[data-test="field-attrs"]');

  expect(tagged).toHaveLength(1);
  expect(tagged[0]).toBe(control);
  expect(control?.getAttribute("id")).toBe("field-attrs");
  expect(control?.getAttribute("name")).toBe("field-attrs");
  expect(container.querySelectorAll("#field-attrs")).toHaveLength(1);
  expect(control?.getAttribute("aria-describedby")).toBe("field-help");
});

test("it should apply className and style to the root, not the input", () => {
  const { container } = render(
    <NumberField className="field-root" style={{ width: 240 }} />,
  );

  const root = container.querySelector<HTMLElement>(".field-root");
  const control = container.querySelector("input");

  expect(root?.style.width).toBe("240px");
  expect(root?.contains(control)).toBe(true);
  expect(control?.getAttribute("style")).toBeNull();
  expect(control?.classList.contains("field-root")).toBe(false);
});
