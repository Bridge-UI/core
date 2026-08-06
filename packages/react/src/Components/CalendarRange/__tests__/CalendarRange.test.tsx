// ** External Imports
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";

afterEach(() => {
  cleanup();
});

// ** Local Imports
import { CalendarRange } from "@/Components/CalendarRange";

test("it should render a shared year selector and dual date panels", () => {
  render(
    <CalendarRange
      defaultValue={[new Date(2021, 4, 1), new Date(2021, 4, 10)]}
    />,
  );

  expect(screen.getAllByRole("button", { name: "Select year" })).toHaveLength(
    1,
  );
});

test("it should keep end month one month ahead of start", () => {
  render(
    <CalendarRange
      onViewDateChange={() => {}}
      viewDate={new Date(2021, 4, 1)}
    />,
  );

  expect(screen.getByText("May")).toBeTruthy();
  expect(screen.getByText("June")).toBeTruthy();
});

test("it should call onChange when a range is selected", () => {
  const onChange = vi.fn();

  render(
    <CalendarRange
      onChange={onChange}
      onViewDateChange={() => {}}
      viewDate={new Date(2021, 4, 1)}
    />,
  );

  fireEvent.click(screen.getAllByRole("button", { name: "10" })[0]!);
  fireEvent.click(screen.getAllByRole("button", { name: "15" })[0]!);

  expect(onChange).toHaveBeenCalled();
});
