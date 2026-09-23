// ** External Imports
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";

afterEach(() => {
  cleanup();
});

// ** Local Imports
import { DateRangePicker } from "@/Components/DateRangePicker";

test("it should render a shared year selector over dual date panels", () => {
  render(
    <DateRangePicker
      defaultValue={[new Date(2021, 4, 1), new Date(2021, 4, 10)]}
    />,
  );

  expect(screen.getAllByRole("button", { name: "Select year" })).toHaveLength(
    1,
  );
});

test("it should commit immediately without footer", () => {
  const onChange = vi.fn();

  render(<DateRangePicker onChange={onChange} />);

  fireEvent.click(screen.getAllByRole("button", { name: "15" })[0]!);

  expect(onChange).toHaveBeenCalled();
});

test("it should show footer actions when showFooter is set", () => {
  render(<DateRangePicker showFooter />);

  expect(screen.getByRole("button", { name: "Apply" })).toBeTruthy();
  expect(screen.getByRole("button", { name: "Cancel" })).toBeTruthy();
});

test("it should commit a month range when granularity is month", () => {
  const onChange = vi.fn();

  render(
    <DateRangePicker
      granularity="month"
      onChange={onChange}
      defaultValue={[new Date(2021, 4, 1), new Date(2021, 5, 1)]}
    />,
  );

  fireEvent.click(screen.getByRole("button", { name: /march/i }));
  fireEvent.click(screen.getByRole("button", { name: /june/i }));

  const range = onChange.mock.calls.at(-1)?.[0] as [Date, Date];

  expect(range[0].getDate()).toBe(1);
  expect(range[1].getDate()).toBe(1);
  expect(range[0].getMonth()).toBe(2);
  expect(range[1].getMonth()).toBe(5);
  expect(range[0].getFullYear()).toBe(2021);
  expect(range[1].getFullYear()).toBe(2021);
});

test("it should commit a year range when granularity is year", () => {
  const onChange = vi.fn();

  render(
    <DateRangePicker
      granularity="year"
      onChange={onChange}
      defaultValue={[new Date(2021, 0, 1), new Date(2022, 0, 1)]}
    />,
  );

  fireEvent.click(screen.getByRole("button", { name: "2018" }));
  fireEvent.click(screen.getByRole("button", { name: "2021" }));

  const range = onChange.mock.calls.at(-1)?.[0] as [Date, Date];

  expect(range[0].getDate()).toBe(1);
  expect(range[1].getDate()).toBe(1);
  expect(range[0].getMonth()).toBe(0);
  expect(range[1].getMonth()).toBe(0);
  expect(range[0].getFullYear()).toBe(2018);
  expect(range[1].getFullYear()).toBe(2021);
});
