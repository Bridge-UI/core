// ** External Imports
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";

afterEach(() => {
  cleanup();
});

// ** Local Imports
import { CalendarYear } from "@/Components/CalendarYear";

test("it should render a page of years", () => {
  render(<CalendarYear value={2021} pageSize={15} />);

  expect(screen.getAllByRole("button")).toHaveLength(15);
});

test("it should call onChange when a year is selected", () => {
  const onChange = vi.fn();

  render(<CalendarYear value={2021} onChange={onChange} />);

  fireEvent.click(screen.getByRole("button", { name: "2021" }));

  expect(onChange).toHaveBeenCalledWith(2021);
});

test("it should mark the selected year", () => {
  render(<CalendarYear value={2021} />);

  expect(
    screen.getByRole("button", { name: "2021" }).getAttribute("aria-pressed"),
  ).toBe("true");
});
