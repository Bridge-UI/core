// ** External Imports
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";

afterEach(() => {
  cleanup();
});

// ** Local Imports
import { CalendarMonth } from "@/Components/CalendarMonth";

test("it should render twelve months", () => {
  render(<CalendarMonth year={2021} />);

  expect(screen.getAllByRole("button")).toHaveLength(12);
});

test("it should call onChange when a month is selected", () => {
  const onChange = vi.fn();

  render(<CalendarMonth year={2021} onChange={onChange} />);

  fireEvent.click(screen.getByRole("button", { name: /may/i }));

  expect(onChange).toHaveBeenCalledWith(4);
});

test("it should mark the selected month", () => {
  render(<CalendarMonth value={4} year={2021} />);

  expect(
    screen.getByRole("button", { name: /may/i }).getAttribute("aria-pressed"),
  ).toBe("true");
});
