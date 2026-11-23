// ** External Imports
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";

// ** Core Imports
import { resetLayerStackForTests } from "@bridge-ui/core/Layer";

// ** Local Imports
import { TimeField } from "@/Components/TimeField";

afterEach(() => {
  cleanup();
  resetLayerStackForTests();
});

test("it should keep the input read-only by default", () => {
  render(<TimeField />);

  expect((screen.getByRole("textbox") as HTMLInputElement).readOnly).toBe(true);
});

test("it should unlock the input when editable is set", () => {
  render(<TimeField editable />);

  expect((screen.getByRole("textbox") as HTMLInputElement).readOnly).toBe(
    false,
  );
});

test("it should open the picker on focus and show time buttons", () => {
  render(<TimeField defaultValue={new Date(2021, 4, 21, 9, 30)} />);

  fireEvent.focus(screen.getByRole("textbox"));

  expect(screen.getByRole("button", { name: "Hour 09" })).toBeTruthy();
  expect(screen.getByRole("button", { name: "Minute 30" })).toBeTruthy();
});

test("it should call onChange and onClear when the clear control is clicked", () => {
  const onChange = vi.fn();
  const onClear = vi.fn();

  render(
    <TimeField
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

test("it should close the overlay after Apply when showFooter is set", () => {
  const onApply = vi.fn();
  const onChange = vi.fn();
  const onClose = vi.fn();

  render(
    <TimeField
      showFooter
      onApply={onApply}
      onClose={onClose}
      onChange={onChange}
      defaultValue={new Date(2021, 4, 21, 9, 30)}
    />,
  );

  fireEvent.focus(screen.getByRole("textbox"));
  fireEvent.click(screen.getByRole("button", { name: "Hour 10" }));
  expect(onChange).not.toHaveBeenCalled();

  fireEvent.click(screen.getByRole("button", { name: "Apply" }));

  expect(onApply).toHaveBeenCalledTimes(1);
  expect(onChange).toHaveBeenCalled();
  expect(onClose).toHaveBeenCalledTimes(1);
  expect(screen.queryByRole("button", { name: "Apply" })).toBeNull();
});

test("it should close the overlay after Cancel when showFooter is set", () => {
  const onChange = vi.fn();
  const onCancel = vi.fn();
  const onClose = vi.fn();

  render(
    <TimeField
      showFooter
      onClose={onClose}
      onChange={onChange}
      onCancel={onCancel}
      defaultValue={new Date(2021, 4, 21, 9, 30)}
    />,
  );

  fireEvent.focus(screen.getByRole("textbox"));
  fireEvent.click(screen.getByRole("button", { name: "Hour 10" }));

  fireEvent.click(screen.getByRole("button", { name: "Cancel" }));

  expect(onCancel).toHaveBeenCalledTimes(1);
  expect(onClose).toHaveBeenCalledTimes(1);
  expect(onChange).not.toHaveBeenCalled();
  expect(screen.queryByRole("button", { name: "Cancel" })).toBeNull();
});

test("it should forward extra HTML props only to the input", () => {
  const { container } = render(
    <TimeField
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
    <TimeField className="field-root" style={{ width: 240 }} />,
  );

  const root = container.querySelector<HTMLElement>(".field-root");
  const control = container.querySelector("input");

  expect(root?.style.width).toBe("240px");
  expect(root?.contains(control)).toBe(true);
  expect(control?.getAttribute("style")).toBeNull();
  expect(control?.classList.contains("field-root")).toBe(false);
});

function submittedValues(form: null | HTMLFormElement, name: string) {
  return new FormData(form ?? undefined).getAll(name);
}

test("it should submit the time as HH:mm:ss through a hidden input", () => {
  const { container } = render(
    <form>
      <TimeField
        name="at"
        showSeconds
        timeZone="UTC"
        value={new Date("2024-03-05T09:07:03Z")}
      />
    </form>,
  );

  const form = container.querySelector("form");

  expect(submittedValues(form, "at")).toEqual(["09:07:03"]);
});
