// ** External Imports
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, test } from "vitest";

afterEach(() => {
  cleanup();
});

// ** Local Imports
import { TimeRangePicker } from "@/Components/TimeRangePicker";

test("it should render dual time panels", () => {
  render(
    <TimeRangePicker
      defaultValue={[
        new Date(2021, 4, 21, 9, 30),
        new Date(2021, 4, 21, 17, 0),
      ]}
    />,
  );

  expect(
    screen.getAllByRole("button", { name: "Hour 09" }).length,
  ).toBeGreaterThan(0);
  expect(
    screen.getAllByRole("button", { name: "Hour 17" }).length,
  ).toBeGreaterThan(0);
});

test("it should show footer actions when showFooter is set", () => {
  render(<TimeRangePicker showFooter />);

  expect(screen.getByRole("button", { name: "Cancel" })).toBeTruthy();
  expect(screen.getByRole("button", { name: "Apply" })).toBeTruthy();
});
