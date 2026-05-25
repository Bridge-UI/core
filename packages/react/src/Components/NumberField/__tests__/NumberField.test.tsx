// ** External Imports
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";

afterEach(() => {
  cleanup();
});

// ** Local Imports
import { NumberField } from "@/Components/NumberField";

test("it should render the root element", () => {
  const { container } = render(<NumberField aria-label="Amount" />);

  expect(screen.getByRole("spinbutton")).toBeTruthy();
  expect(container.querySelector(".w-full")).not.toBeNull();
});

test("it should use number type", () => {
  render(<NumberField aria-label="Amount" />);

  expect(screen.getByRole("spinbutton").getAttribute("type")).toBe("number");
});

test("it should render increment and decrement buttons", () => {
  render(<NumberField aria-label="Amount" />);

  expect(screen.getByRole("button", { name: "Increment value" })).toBeTruthy();
  expect(screen.getByRole("button", { name: "Decrement value" })).toBeTruthy();
});

test("it should call onChange with number when input changes", () => {
  const onChange = vi.fn();

  render(<NumberField aria-label="Amount" onChange={onChange} />);

  fireEvent.change(screen.getByRole("spinbutton"), {
    target: { value: "7" },
  });

  expect(onChange).toHaveBeenCalledWith(7);
});

test("it should increment value when increment button is clicked", () => {
  const onChange = vi.fn();

  render(
    <NumberField value={2} step={2} onChange={onChange} aria-label="Amount" />,
  );

  fireEvent.click(screen.getByRole("button", { name: "Increment value" }));

  expect(onChange).toHaveBeenCalledWith(4);
});

test("it should decrement value when decrement button is clicked", () => {
  const onChange = vi.fn();

  render(
    <NumberField value={4} step={2} onChange={onChange} aria-label="Amount" />,
  );

  fireEvent.click(screen.getByRole("button", { name: "Decrement value" }));

  expect(onChange).toHaveBeenCalledWith(2);
});

test("it should forward min, max, and step to the input", () => {
  render(
    <NumberField min={0} max={10} step={2} aria-label="Amount" value={4} />,
  );

  const input = screen.getByRole("spinbutton");

  expect(input.getAttribute("min")).toBe("0");
  expect(input.getAttribute("max")).toBe("10");
  expect(input.getAttribute("step")).toBe("2");
  expect(input.getAttribute("value")).toBe("4");
});

test("it should disable stepper buttons when field is disabled", () => {
  render(<NumberField disabled aria-label="Amount" />);

  expect(
    (
      screen.getByRole("button", {
        name: "Increment value",
      }) as HTMLButtonElement
    ).disabled,
  ).toBe(true);
  expect(
    (
      screen.getByRole("button", {
        name: "Decrement value",
      }) as HTMLButtonElement
    ).disabled,
  ).toBe(true);
});

test("it should not render error icon when error is set", () => {
  const { container } = render(<NumberField error aria-label="Amount" />);

  expect(container.querySelector(".lucide-circle-alert")).toBeNull();
});

test("it should hide native spin buttons via input classes", () => {
  render(<NumberField aria-label="Amount" />);

  expect(screen.getByRole("spinbutton").className).toContain(
    "appearance:textfield",
  );
});

test("it should render a label when label prop is provided", () => {
  render(<NumberField label="Quantity" id="quantity-field" />);

  expect(screen.getByText("Quantity")).toBeTruthy();
  expect(screen.getByLabelText("Quantity")).toBeTruthy();
});

test("it should render description when description prop is provided", () => {
  render(<NumberField description="Helper text" aria-label="Amount" />);

  expect(screen.getByText("Helper text")).toBeTruthy();
});

test("it should render error message when errorMessage prop is provided", () => {
  render(<NumberField error errorMessage="Required" aria-label="Amount" />);

  expect(screen.getByText("Required")).toBeTruthy();
});

test("it should set aria-invalid on the input when error is set", () => {
  render(<NumberField error aria-label="Amount" />);

  expect(screen.getByRole("spinbutton").getAttribute("aria-invalid")).toBe(
    "true",
  );
});

test("it should merge classes.increment and classes.decrement onto buttons", () => {
  render(
    <NumberField
      aria-label="Amount"
      classes={{
        increment: "custom-increment",
        decrement: "custom-decrement",
      }}
    />,
  );

  expect(
    screen
      .getByRole("button", { name: "Increment value" })
      .classList.contains("custom-increment"),
  ).toBe(true);
  expect(
    screen
      .getByRole("button", { name: "Decrement value" })
      .classList.contains("custom-decrement"),
  ).toBe(true);
});

test("it should forward additional attributes to the input", () => {
  render(
    <NumberField
      id="field-id"
      placeholder="0"
      aria-label="Amount"
      data-testid="number-input"
    />,
  );

  const input = screen.getByTestId("number-input");

  expect(input.id).toBe("field-id");
  expect(input.getAttribute("placeholder")).toBe("0");
});

test("it should apply variant classes from TextField", () => {
  const { container } = render(
    <NumberField variant="outline" aria-label="Amount" />,
  );

  expect(container.querySelector(".group\\/field")).not.toBeNull();
});
