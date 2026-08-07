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
