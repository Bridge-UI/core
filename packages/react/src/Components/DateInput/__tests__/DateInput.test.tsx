// ** External Imports
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";

afterEach(() => {
  cleanup();
});

// ** Local Imports
import { DateInput } from "@/Components/DateInput";

test("it should render a text input", () => {
  const { container } = render(<DateInput />);

  expect(container.querySelector("input")).not.toBeNull();
});

test("it should open the picker on focus", () => {
  render(<DateInput defaultValue={new Date(2021, 4, 21)} />);

  fireEvent.focus(screen.getByRole("textbox"));

  expect(screen.getByRole("button", { name: "Select year" })).toBeTruthy();
});

test("it should call onChange when a day is selected", () => {
  const onChange = vi.fn();

  render(<DateInput onChange={onChange} defaultValue={new Date(2021, 4, 1)} />);

  fireEvent.focus(screen.getByRole("textbox"));
  fireEvent.click(screen.getByRole("button", { name: "21" }));

  expect(onChange).toHaveBeenCalled();
});
