// ** External Imports
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";

afterEach(() => {
  cleanup();
});

// ** Local Imports
import { DateTimeField } from "@/Components/DateTimeField";

test("it should render a text input", () => {
  const { container } = render(<DateTimeField />);

  expect(container.querySelector("input")).not.toBeNull();
});

test("it should keep the input read-only by default", () => {
  render(<DateTimeField />);

  expect((screen.getByRole("textbox") as HTMLInputElement).readOnly).toBe(true);
});

test("it should unlock the input when editable is set", () => {
  render(<DateTimeField editable />);

  expect((screen.getByRole("textbox") as HTMLInputElement).readOnly).toBe(
    false,
  );
});

test("it should open the picker on focus", () => {
  render(<DateTimeField defaultValue={new Date(2021, 4, 21, 9, 30)} />);

  fireEvent.focus(screen.getByRole("textbox"));

  expect(screen.getByRole("button", { name: "Select year" })).toBeTruthy();
  expect(screen.getByRole("button", { name: "Hour 09" })).toBeTruthy();
});

test("it should call onChange and onClear when the clear control is clicked", () => {
  const onChange = vi.fn();
  const onClear = vi.fn();

  render(
    <DateTimeField
      clearable
      onClear={onClear}
      onChange={onChange}
      defaultValue={new Date(2021, 4, 21, 9, 30)}
    />,
  );

  fireEvent.click(screen.getByLabelText("Clear"));

  expect(onChange).toHaveBeenCalledWith(null);
  expect(onClear).toHaveBeenCalled();
});

test("it should forward extra HTML props only to the input", () => {
  const { container } = render(
    <DateTimeField
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
  expect(control?.getAttribute("name")).toBeNull();
  expect(control?.getAttribute("id")).toBe("field-attrs");
  expect(container.querySelectorAll("#field-attrs")).toHaveLength(1);
  expect(control?.getAttribute("aria-describedby")).toBe("field-help");
});

test("it should apply className and style to the root, not the input", () => {
  const { container } = render(
    <DateTimeField className="field-root" style={{ width: 240 }} />,
  );

  const root = container.querySelector<HTMLElement>(".field-root");
  const control = container.querySelector("input");

  expect(root?.style.width).toBe("240px");
  expect(root?.contains(control)).toBe(true);
  expect(control?.getAttribute("style")).toBeNull();
  expect(control?.classList.contains("field-root")).toBe(false);
});
