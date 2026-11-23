// ** External Imports
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";

afterEach(() => {
  cleanup();
});

// ** Local Imports
import { TimeRangeField } from "@/Components/TimeRangeField";

test("it should render a text input", () => {
  const { container } = render(<TimeRangeField />);

  expect(container.querySelector("input")).not.toBeNull();
});

test("it should keep the input read-only by default", () => {
  render(<TimeRangeField />);

  expect((screen.getByRole("textbox") as HTMLInputElement).readOnly).toBe(true);
});

test("it should unlock the input when editable is set", () => {
  render(<TimeRangeField editable />);

  expect((screen.getByRole("textbox") as HTMLInputElement).readOnly).toBe(
    false,
  );
});

test("it should open the picker on focus and show dual time panels", () => {
  render(
    <TimeRangeField
      defaultValue={[
        new Date(2021, 4, 21, 9, 30),
        new Date(2021, 4, 21, 17, 0),
      ]}
    />,
  );

  fireEvent.focus(screen.getByRole("textbox"));

  expect(
    screen.getAllByRole("button", { name: "Hour 09" }).length,
  ).toBeGreaterThan(0);
  expect(
    screen.getAllByRole("button", { name: "Hour 17" }).length,
  ).toBeGreaterThan(0);
});

test("it should call onChange and onClear when the clear control is clicked", () => {
  const onChange = vi.fn();
  const onClear = vi.fn();

  render(
    <TimeRangeField
      clearable
      onClear={onClear}
      onChange={onChange}
      defaultValue={[
        new Date(2021, 4, 21, 9, 30),
        new Date(2021, 4, 21, 17, 0),
      ]}
    />,
  );

  fireEvent.click(screen.getByLabelText("Clear"));

  expect(onChange).toHaveBeenCalledWith(null);
  expect(onClear).toHaveBeenCalled();
});

test("it should forward extra HTML props only to the input", () => {
  const { container } = render(
    <TimeRangeField
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
    <TimeRangeField className="field-root" style={{ width: 240 }} />,
  );

  const root = container.querySelector<HTMLElement>(".field-root");
  const control = container.querySelector("input");

  expect(root?.style.width).toBe("240px");
  expect(root?.contains(control)).toBe(true);
  expect(control?.getAttribute("style")).toBeNull();
  expect(control?.classList.contains("field-root")).toBe(false);
});
