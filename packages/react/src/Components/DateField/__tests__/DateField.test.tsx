// ** External Imports
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";

afterEach(() => {
  cleanup();
});

// ** Local Imports
import { DateField } from "@/Components/DateField";

test("it should render a text input", () => {
  const { container } = render(<DateField />);

  expect(container.querySelector("input")).not.toBeNull();
});

test("it should open the picker on focus", () => {
  render(<DateField defaultValue={new Date(2021, 4, 21)} />);

  fireEvent.focus(screen.getByRole("textbox"));

  expect(screen.getByRole("button", { name: "Select year" })).toBeTruthy();
});

test("it should call onChange when a day is selected", () => {
  const onChange = vi.fn();

  render(<DateField onChange={onChange} defaultValue={new Date(2021, 4, 1)} />);

  fireEvent.focus(screen.getByRole("textbox"));
  fireEvent.click(screen.getByRole("button", { name: "21" }));

  expect(onChange).toHaveBeenCalled();
});

test("it should pass color to the nested DatePicker", () => {
  render(<DateField color="secondary" defaultValue={new Date(2021, 4, 21)} />);

  fireEvent.focus(screen.getByRole("textbox"));

  const day = screen.getByRole("button", { name: "15" });

  expect(day.className).toMatch(/secondary/);
});
