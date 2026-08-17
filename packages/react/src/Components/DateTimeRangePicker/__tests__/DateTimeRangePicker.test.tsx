// ** External Imports
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";

afterEach(() => {
  cleanup();
});

// ** Local Imports
import { DateTimeRangePicker } from "@/Components/DateTimeRangePicker";

test("it should render the calendar and time panels", () => {
  const { container } = render(
    <DateTimeRangePicker
      defaultValue={[
        new Date(2021, 4, 21, 9, 30),
        new Date(2021, 4, 25, 17, 0),
      ]}
    />,
  );

  expect(screen.getByRole("button", { name: "Select year" })).toBeTruthy();
  expect(
    screen.getAllByRole("button", { name: "Hour 09" }).length,
  ).toBeGreaterThan(0);
  expect(
    screen.getAllByRole("button", { name: "Hour 17" }).length,
  ).toBeGreaterThan(0);
  expect(container.querySelector(".min-w-72")).toBeTruthy();
});

test("it should commit immediately without footer", () => {
  const onChange = vi.fn();

  render(
    <DateTimeRangePicker
      onChange={onChange}
      defaultValue={[new Date(2021, 4, 1, 9, 30), new Date(2021, 4, 10, 17, 0)]}
    />,
  );

  fireEvent.click(screen.getAllByRole("button", { name: "21" })[0]!);

  expect(onChange).toHaveBeenCalled();
});

test("it should show footer actions when showFooter is set", () => {
  render(<DateTimeRangePicker showFooter />);

  expect(screen.getByRole("button", { name: "Cancel" })).toBeTruthy();
  expect(screen.getByRole("button", { name: "Apply" })).toBeTruthy();
});
