// ** External Imports
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, test } from "vitest";

afterEach(() => {
  cleanup();
});

// ** Local Imports
import { Switch } from "@/Components/Switch";

test("it should render a switch control", () => {
  render(<Switch endLabel="Notifications" />);

  expect(screen.getByRole("switch", { name: "Notifications" })).toBeTruthy();
});

test("it should render description when description prop is provided", () => {
  render(
    <Switch endLabel="Notifications" description="Enable push notifications" />,
  );

  expect(screen.getByText("Enable push notifications")).toBeTruthy();
});

test("it should toggle when clicked in uncontrolled mode", () => {
  render(<Switch defaultChecked={false} endLabel="Notifications" />);

  const toggle = screen.getByRole("switch") as HTMLInputElement;

  expect(toggle.checked).toBe(false);

  fireEvent.click(toggle);

  expect(toggle.checked).toBe(true);
});

test("it should reflect checked state when controlled", () => {
  render(<Switch checked endLabel="Notifications" />);

  expect((screen.getByRole("switch") as HTMLInputElement).checked).toBe(true);
});

test("it should apply disabled attribute when disabled", () => {
  render(<Switch disabled endLabel="Notifications" />);

  expect((screen.getByRole("switch") as HTMLInputElement).disabled).toBe(true);
});

test("it should set aria-invalid when error is set", () => {
  render(<Switch error endLabel="Notifications" />);

  expect(screen.getByRole("switch").getAttribute("aria-invalid")).toBe("true");
});

test("it should render track and thumb elements", () => {
  const { container } = render(<Switch endLabel="Notifications" />);

  expect(
    container.querySelectorAll("label span").length,
  ).toBeGreaterThanOrEqual(2);
});

test("it should forward extra HTML props only to the switch input", () => {
  const { container } = render(
    <Switch
      id="field-attrs"
      name="field-attrs"
      data-test="field-attrs"
      aria-describedby="field-help"
    />,
  );

  const control = container.querySelector('input[role="switch"]');
  const tagged = container.querySelectorAll('[data-test="field-attrs"]');

  expect(tagged).toHaveLength(1);
  expect(tagged[0]).toBe(control);
  expect(control?.getAttribute("id")).toBe("field-attrs");
  expect(control?.getAttribute("name")).toBe("field-attrs");
  expect(container.querySelectorAll("#field-attrs")).toHaveLength(1);
  expect(control?.getAttribute("aria-describedby")).toBe("field-help");
});

test("it should apply className and style to the root, not the switch input", () => {
  const { container } = render(
    <Switch className="field-root" style={{ width: 240 }} />,
  );

  const root = container.querySelector<HTMLElement>(".field-root");
  const control = container.querySelector('input[role="switch"]');

  expect(root?.style.width).toBe("240px");
  expect(root?.contains(control)).toBe(true);
  expect(control?.getAttribute("style")).toBeNull();
  expect(control?.classList.contains("field-root")).toBe(false);
});
