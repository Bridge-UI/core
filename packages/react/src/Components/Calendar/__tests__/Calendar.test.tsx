// ** External Imports
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";

afterEach(() => {
  cleanup();
});

// ** Local Imports
import { Calendar } from "@/Components/Calendar";

test("it should render year and month selectors", () => {
  render(<Calendar viewDate={new Date(2021, 4, 1)} />);

  expect(screen.getByRole("button", { name: "Select year" })).toBeTruthy();
  expect(screen.getByRole("button", { name: "Select month" })).toBeTruthy();
});

test("it should open the month panel", () => {
  render(<Calendar viewDate={new Date(2021, 4, 1)} />);

  fireEvent.click(screen.getByRole("button", { name: "Select month" }));

  expect(screen.getByRole("button", { name: /january/i })).toBeTruthy();
});

test("it should open the year panel", () => {
  render(<Calendar viewDate={new Date(2021, 4, 1)} />);

  fireEvent.click(screen.getByRole("button", { name: "Select year" }));

  expect(screen.getByRole("button", { name: "2021" })).toBeTruthy();
});

test("it should call onChange when a day is selected", () => {
  const onChange = vi.fn();

  render(<Calendar onChange={onChange} viewDate={new Date(2021, 4, 1)} />);

  fireEvent.click(screen.getByRole("button", { name: "21" }));

  expect(onChange).toHaveBeenCalled();
});

test("it should hide year selector when hideYears is set", () => {
  render(<Calendar hideYears viewDate={new Date(2021, 4, 1)} />);

  expect(screen.queryByRole("button", { name: "Select year" })).toBeNull();
});
