// ** External Imports
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";

afterEach(() => {
  cleanup();
});

// ** Local Imports
import { DateRangeField } from "@/Components/DateRangeField";

test("it should render a text input", () => {
  const { container } = render(<DateRangeField />);

  expect(container.querySelector("input")).not.toBeNull();
});

test("it should open the picker on focus", () => {
  render(
    <DateRangeField
      defaultValue={[new Date(2021, 4, 1), new Date(2021, 4, 10)]}
    />,
  );

  fireEvent.focus(screen.getByRole("textbox"));

  expect(screen.getAllByRole("button", { name: "Select year" }).length).toBe(1);
});

test("it should call onChange when a day is selected", () => {
  const onChange = vi.fn();

  render(<DateRangeField onChange={onChange} />);

  fireEvent.focus(screen.getByRole("textbox"));
  fireEvent.click(screen.getAllByRole("button", { name: "15" })[0]!);

  expect(onChange).toHaveBeenCalled();
});

test("it should pass color to the nested DateRangePicker", () => {
  render(
    <DateRangeField
      color="secondary"
      defaultValue={[new Date(2021, 4, 1), new Date(2021, 4, 10)]}
    />,
  );

  fireEvent.focus(screen.getByRole("textbox"));

  const day = screen.getAllByRole("button", { name: "15" })[0]!;

  expect(day.className).toMatch(/secondary/);
});
