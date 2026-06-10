// ** External Imports
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, test } from "vitest";

afterEach(() => {
  cleanup();
});

// ** Local Imports
import { Switch } from "@/Components/Switch";

test("it should render a switch control", () => {
  render(<Switch mainLabel="Notifications" />);

  expect(screen.getByRole("switch", { name: "Notifications" })).toBeTruthy();
});

test("it should render description when description prop is provided", () => {
  render(
    <Switch
      mainLabel="Notifications"
      description="Enable push notifications"
    />,
  );

  expect(screen.getByText("Enable push notifications")).toBeTruthy();
});

test("it should toggle when clicked in uncontrolled mode", () => {
  render(<Switch mainLabel="Notifications" defaultChecked={false} />);

  const toggle = screen.getByRole("switch") as HTMLInputElement;

  expect(toggle.checked).toBe(false);

  fireEvent.click(toggle);

  expect(toggle.checked).toBe(true);
});

test("it should reflect checked state when controlled", () => {
  render(<Switch mainLabel="Notifications" checked />);

  expect((screen.getByRole("switch") as HTMLInputElement).checked).toBe(true);
});

test("it should apply disabled attribute when disabled", () => {
  render(<Switch mainLabel="Notifications" disabled />);

  expect((screen.getByRole("switch") as HTMLInputElement).disabled).toBe(true);
});

test("it should set aria-invalid when error is set", () => {
  render(<Switch mainLabel="Notifications" error />);

  expect(screen.getByRole("switch").getAttribute("aria-invalid")).toBe("true");
});

test("it should render track and thumb elements", () => {
  const { container } = render(<Switch mainLabel="Notifications" />);

  expect(
    container.querySelectorAll("label span").length,
  ).toBeGreaterThanOrEqual(2);
});
