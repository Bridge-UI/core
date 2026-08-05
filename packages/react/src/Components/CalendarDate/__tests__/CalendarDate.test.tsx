// ** External Imports
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";

afterEach(() => {
  cleanup();
});

// ** Local Imports
import { CalendarDate } from "@/Components/CalendarDate";

test("it should render weekday labels by default", () => {
  render(<CalendarDate viewDate={new Date(2021, 4, 1)} />);

  expect(screen.getByText(/sun/i)).toBeTruthy();
});

test("it should hide weekdays when hideWeekdays is set", () => {
  render(<CalendarDate hideWeekdays viewDate={new Date(2021, 4, 1)} />);

  expect(screen.queryByText(/sun/i)).toBeNull();
});

test("it should call onChange when a day is selected", () => {
  const onChange = vi.fn();

  render(<CalendarDate onChange={onChange} viewDate={new Date(2021, 4, 1)} />);

  fireEvent.click(screen.getByRole("button", { name: "21" }));

  expect(onChange).toHaveBeenCalled();
  const value = onChange.mock.calls[0]?.[0] as Date;

  expect(value.getFullYear()).toBe(2021);
  expect(value.getMonth()).toBe(4);
  expect(value.getDate()).toBe(21);
});

test("it should mark the selected day", () => {
  render(
    <CalendarDate
      value={new Date(2021, 4, 21)}
      viewDate={new Date(2021, 4, 1)}
    />,
  );

  expect(
    screen.getByRole("button", { name: "21" }).getAttribute("aria-pressed"),
  ).toBe("true");
});

test("it should disable dates before minDate", () => {
  render(
    <CalendarDate
      viewDate={new Date(2021, 4, 1)}
      minDate={new Date(2021, 4, 20)}
    />,
  );

  expect(
    (screen.getByRole("button", { name: "10" }) as HTMLButtonElement).disabled,
  ).toBe(true);
  expect(
    (screen.getByRole("button", { name: "21" }) as HTMLButtonElement).disabled,
  ).toBe(false);
});
