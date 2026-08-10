// ** External Imports
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";

afterEach(() => {
  cleanup();
});

// ** Local Imports
import { TimeField } from "@/Components/TimeField";

test("it should render a text input", () => {
  const { container } = render(<TimeField />);

  expect(container.querySelector("input")).not.toBeNull();
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
