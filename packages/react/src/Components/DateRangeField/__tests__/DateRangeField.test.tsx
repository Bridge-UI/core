// ** External Imports
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";

// ** Core Imports
import { resetLayerStackForTests } from "@bridge-ui/core/Layer";

// ** Local Imports
import { DateRangeField } from "@/Components/DateRangeField";

afterEach(() => {
  cleanup();
  resetLayerStackForTests();
});

test("it should render a text input", () => {
  const { container } = render(<DateRangeField />);

  expect(container.querySelector("input")).not.toBeNull();
});

test("it should open the picker on focus", () => {
  render(
    <DateRangeField
      defaultValue={[new Date(2021, 4, 1), new Date(2021, 4, 10)]}
    />,
  );

  fireEvent.focus(screen.getByRole("textbox"));

  expect(screen.getAllByRole("button", { name: "Select year" }).length).toBe(1);
});

test("it should call onChange when a day is selected", () => {
  const onChange = vi.fn();

  render(<DateRangeField onChange={onChange} />);

  fireEvent.focus(screen.getByRole("textbox"));
  fireEvent.click(screen.getAllByRole("button", { name: "15" })[0]!);

  expect(onChange).toHaveBeenCalled();
});

test("it should pass color to the nested DateRangePicker", () => {
  render(
    <DateRangeField
      color="secondary"
      defaultValue={[new Date(2021, 4, 1), new Date(2021, 4, 10)]}
    />,
  );

  fireEvent.focus(screen.getByRole("textbox"));

  const day = screen.getAllByRole("button", { name: "15" })[0]!;

  expect(day.className).toMatch(/secondary/);
});

test("it should apply invalidated calendar colors when error is set", () => {
  render(
    <DateRangeField
      error
      color="secondary"
      defaultValue={[new Date(2021, 4, 1), new Date(2021, 4, 10)]}
    />,
  );

  fireEvent.focus(screen.getByRole("textbox"));

  const day = screen.getAllByRole("button", { name: "15" })[0]!;

  expect(day.className).toMatch(/error/);
  expect(day.className).not.toMatch(/secondary/);
});

test("it should call onChange and onClear when the clear control is clicked", () => {
  const onChange = vi.fn();
  const onClear = vi.fn();

  render(
    <DateRangeField
      onClear={onClear}
      onChange={onChange}
      defaultValue={[new Date(2021, 4, 1), new Date(2021, 4, 10)]}
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
    <DateRangeField
      showFooter
      onApply={onApply}
      onClose={onClose}
      onChange={onChange}
      defaultValue={[new Date(2021, 4, 1), new Date(2021, 4, 10)]}
    />,
  );

  fireEvent.focus(screen.getByRole("textbox"));
  fireEvent.click(screen.getAllByRole("button", { name: "21" })[0]!);
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
    <DateRangeField
      showFooter
      onClose={onClose}
      onChange={onChange}
      onCancel={onCancel}
      defaultValue={[new Date(2021, 4, 1), new Date(2021, 4, 10)]}
    />,
  );

  fireEvent.focus(screen.getByRole("textbox"));
  fireEvent.click(screen.getAllByRole("button", { name: "21" })[0]!);

  fireEvent.click(screen.getByRole("button", { name: "Cancel" }));

  expect(onCancel).toHaveBeenCalledTimes(1);
  expect(onClose).toHaveBeenCalledTimes(1);
  expect(onChange).not.toHaveBeenCalled();
  expect(screen.queryByRole("button", { name: "Cancel" })).toBeNull();
});
