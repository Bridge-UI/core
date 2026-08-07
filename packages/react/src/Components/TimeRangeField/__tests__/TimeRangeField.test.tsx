// ** External Imports
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, test } from "vitest";

afterEach(() => {
  cleanup();
});

// ** Local Imports
import { TimeRangeField } from "@/Components/TimeRangeField";

test("it should render a text input", () => {
  const { container } = render(<TimeRangeField />);

  expect(container.querySelector("input")).not.toBeNull();
});

test("it should open the picker on focus and show dual time panels", () => {
  render(
    <TimeRangeField
      defaultValue={[
        new Date(2021, 4, 21, 9, 30),
        new Date(2021, 4, 21, 17, 0),
      ]}
    />,
  );

  fireEvent.focus(screen.getByRole("textbox"));

  expect(
    screen.getAllByRole("button", { name: "Hour 09" }).length,
  ).toBeGreaterThan(0);
  expect(
    screen.getAllByRole("button", { name: "Hour 17" }).length,
  ).toBeGreaterThan(0);
});
