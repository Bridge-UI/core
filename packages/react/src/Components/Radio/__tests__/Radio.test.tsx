// ** External Imports
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, test } from "vitest";

afterEach(() => {
  cleanup();
});

// ** Local Imports
import { Radio } from "@/Components/Radio";

test("it should render a radio control", () => {
  render(<Radio value="a" mainLabel="Option A" />);

  expect(screen.getByRole("radio", { name: "Option A" })).toBeTruthy();
});

test("it should be checked when checked prop is true", () => {
  render(<Radio value="a" checked mainLabel="Option A" />);

  expect((screen.getByRole("radio") as HTMLInputElement).checked).toBe(true);
});

test("it should not be checked when checked prop is false", () => {
  render(<Radio value="a" checked={false} mainLabel="Option A" />);

  expect((screen.getByRole("radio") as HTMLInputElement).checked).toBe(false);
});

test("it should toggle in uncontrolled mode when clicked", () => {
  render(<Radio value="a" mainLabel="Option A" defaultChecked={false} />);

  const radio = screen.getByRole("radio") as HTMLInputElement;

  expect(radio.checked).toBe(false);

  fireEvent.click(radio);

  expect(radio.checked).toBe(true);
});

test("it should apply disabled attribute when disabled", () => {
  render(<Radio value="a" mainLabel="Option A" disabled />);

  expect((screen.getByRole("radio") as HTMLInputElement).disabled).toBe(true);
});

test("it should set aria-invalid when error is set", () => {
  render(<Radio value="a" mainLabel="Option A" error />);

  expect(screen.getByRole("radio").getAttribute("aria-invalid")).toBe("true");
});

test("it should forward name to the native input", () => {
  render(<Radio value="a" name="plan" mainLabel="Option A" />);

  expect((screen.getByRole("radio") as HTMLInputElement).name).toBe("plan");
});

test("it should link label to control id", () => {
  render(<Radio value="a" mainLabel="Option A" controlId="plan-a" />);

  expect(screen.getByLabelText("Option A").id).toBe("plan-a");
});
