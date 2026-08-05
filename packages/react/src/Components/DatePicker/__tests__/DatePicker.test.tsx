// ** External Imports
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";

afterEach(() => {
  cleanup();
});

// ** Local Imports
import { DatePicker } from "@/Components/DatePicker";

test("it should render the calendar", () => {
  render(<DatePicker defaultValue={new Date(2021, 4, 21)} />);

  expect(screen.getByRole("button", { name: "Select year" })).toBeTruthy();
});

test("it should commit immediately without footer", () => {
  const onChange = vi.fn();

  render(
    <DatePicker onChange={onChange} defaultValue={new Date(2021, 4, 1)} />,
  );

  fireEvent.click(screen.getByRole("button", { name: "21" }));

  expect(onChange).toHaveBeenCalled();
});

test("it should show footer actions when showFooter is set", () => {
  render(<DatePicker showFooter />);

  expect(screen.getByRole("button", { name: "Cancel" })).toBeTruthy();
  expect(screen.getByRole("button", { name: "Apply" })).toBeTruthy();
});

test("it should commit draft value on Apply", () => {
  const onChange = vi.fn();

  render(
    <DatePicker
      showFooter
      onChange={onChange}
      defaultValue={new Date(2021, 4, 1)}
    />,
  );

  fireEvent.click(screen.getByRole("button", { name: "21" }));
  expect(onChange).not.toHaveBeenCalled();

  fireEvent.click(screen.getByRole("button", { name: "Apply" }));
  expect(onChange).toHaveBeenCalled();
});
