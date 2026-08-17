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

test("it should allow typing when editable is set", () => {
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
