// ** External Imports
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";

afterEach(() => {
  cleanup();
});

// ** Local Imports
import { TimePanel } from "@/Components/TimePanel";

test("it should render hour buttons", () => {
  render(<TimePanel value={new Date(2021, 4, 21, 9, 30)} />);

  expect(screen.getByRole("button", { name: "Hour 09" })).toBeTruthy();
  expect(screen.getByRole("button", { name: "Minute 30" })).toBeTruthy();
});

test("it should call onChange when an hour is selected", () => {
  const onChange = vi.fn();

  render(
    <TimePanel onChange={onChange} value={new Date(2021, 4, 21, 9, 30)} />,
  );

  fireEvent.click(screen.getByRole("button", { name: "Hour 10" }));

  expect(onChange).toHaveBeenCalled();
});

test("it should render AM/PM when ampm is set", () => {
  render(<TimePanel ampm value={new Date(2021, 4, 21, 9, 30)} />);

  expect(screen.getByRole("button", { name: "AM" })).toBeTruthy();
  expect(screen.getByRole("button", { name: "PM" })).toBeTruthy();
});

test("it should render seconds when showSeconds is set", () => {
  render(<TimePanel showSeconds value={new Date(2021, 4, 21, 9, 30, 45)} />);

  expect(screen.getByRole("button", { name: "Second 45" })).toBeTruthy();
});
