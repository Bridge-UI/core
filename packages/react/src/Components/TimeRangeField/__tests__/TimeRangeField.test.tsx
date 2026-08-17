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
