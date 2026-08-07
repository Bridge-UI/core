// ** External Imports
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";

afterEach(() => {
  cleanup();
});

// ** Local Imports
import { DateTimeRangeField } from "@/Components/DateTimeRangeField";

test("it should render a text input", () => {
  const { container } = render(<DateTimeRangeField />);

  expect(container.querySelector("input")).not.toBeNull();
});

test("it should open the picker on focus", () => {
  render(
    <DateTimeRangeField
      defaultValue={[new Date(2021, 4, 1, 9, 30), new Date(2021, 4, 10, 17, 0)]}
    />,
  );

  fireEvent.focus(screen.getByRole("textbox"));

  expect(screen.getByRole("button", { name: "Select year" })).toBeTruthy();
  expect(
    screen.getAllByRole("button", { name: "Hour 09" }).length,
  ).toBeGreaterThan(0);
});

test("it should call onChange when a day is selected", () => {
  const onChange = vi.fn();

  render(<DateTimeRangeField onChange={onChange} />);

  fireEvent.focus(screen.getByRole("textbox"));
  fireEvent.click(screen.getAllByRole("button", { name: "15" })[0]!);

  expect(onChange).toHaveBeenCalled();
});

test("it should pass color to the nested DateTimeRangePicker", () => {
  render(
    <DateTimeRangeField
      color="secondary"
      defaultValue={[new Date(2021, 4, 1, 9, 30), new Date(2021, 4, 10, 17, 0)]}
    />,
  );

  fireEvent.focus(screen.getByRole("textbox"));

  const day = screen.getAllByRole("button", { name: "15" })[0]!;

  expect(day.className).toMatch(/secondary/);
});
