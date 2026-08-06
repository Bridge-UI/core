// ** External Imports
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, test } from "vitest";

afterEach(() => {
  cleanup();
});

// ** Local Imports
import { TimePicker } from "@/Components/TimePicker";

test("it should render the time panel", () => {
  render(<TimePicker defaultValue={new Date(2021, 4, 21, 9, 30)} />);

  expect(screen.getByRole("button", { name: "Hour 09" })).toBeTruthy();
});

test("it should show footer actions when showFooter is set", () => {
  render(<TimePicker showFooter />);

  expect(screen.getByRole("button", { name: "Cancel" })).toBeTruthy();
  expect(screen.getByRole("button", { name: "Apply" })).toBeTruthy();
});
