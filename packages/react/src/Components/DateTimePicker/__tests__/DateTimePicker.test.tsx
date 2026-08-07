// ** External Imports
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";

afterEach(() => {
  cleanup();
});

// ** Local Imports
import { DateTimePicker } from "@/Components/DateTimePicker";

test("it should render the calendar and time panel", () => {
  render(<DateTimePicker defaultValue={new Date(2021, 4, 21, 9, 30)} />);

  expect(screen.getByRole("button", { name: "Select year" })).toBeTruthy();
  expect(screen.getByRole("button", { name: "Hour 09" })).toBeTruthy();
});

test("it should commit immediately without footer", () => {
  const onChange = vi.fn();

  render(
    <DateTimePicker
      onChange={onChange}
      defaultValue={new Date(2021, 4, 1, 9, 30)}
    />,
  );

  fireEvent.click(screen.getByRole("button", { name: "21" }));

  expect(onChange).toHaveBeenCalled();
});

test("it should show footer actions when showFooter is set", () => {
  render(<DateTimePicker showFooter />);

  expect(screen.getByRole("button", { name: "Cancel" })).toBeTruthy();
  expect(screen.getByRole("button", { name: "Apply" })).toBeTruthy();
});
