// ** External Imports
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, test } from "vitest";

afterEach(() => {
  cleanup();
});

// ** Local Imports
import { PasswordField } from "@/Components/PasswordField";

test("it should render a password input by default", () => {
  const { container } = render(<PasswordField />);

  expect(container.querySelector('input[type="password"]')).not.toBeNull();
});

test("it should render visibility toggle button", () => {
  render(<PasswordField />);

  expect(screen.getByRole("button", { name: "Show password" })).toBeTruthy();
});

test("it should reveal password when toggle is clicked", () => {
  const { container } = render(<PasswordField defaultValue="secret" />);

  fireEvent.click(screen.getByRole("button", { name: "Show password" }));

  expect(container.querySelector('input[type="text"]')).not.toBeNull();
  expect(screen.getByRole("button", { name: "Hide password" })).toBeTruthy();
});

test("it should disable toggle button when disabled", () => {
  render(<PasswordField disabled />);

  expect(screen.getByRole("button", { name: "Show password" })).toHaveProperty(
    "disabled",
    true,
  );
});

test("it should render a label when label prop is provided", () => {
  render(<PasswordField label="Password" />);

  expect(screen.getByText("Password")).toBeTruthy();
});

test("it should forward extra HTML props only to the input", () => {
  const { container } = render(
    <PasswordField
      id="field-attrs"
      name="field-attrs"
      data-test="field-attrs"
      aria-describedby="field-help"
    />,
  );

  const control = container.querySelector("input");
  const tagged = container.querySelectorAll('[data-test="field-attrs"]');

  expect(tagged).toHaveLength(1);
  expect(tagged[0]).toBe(control);
  expect(control?.getAttribute("id")).toBe("field-attrs");
  expect(control?.getAttribute("name")).toBe("field-attrs");
  expect(container.querySelectorAll("#field-attrs")).toHaveLength(1);
  expect(control?.getAttribute("aria-describedby")).toBe("field-help");
});

test("it should apply className and style to the root, not the input", () => {
  const { container } = render(
    <PasswordField className="field-root" style={{ width: 240 }} />,
  );

  const root = container.querySelector<HTMLElement>(".field-root");
  const control = container.querySelector("input");

  expect(root?.style.width).toBe("240px");
  expect(root?.contains(control)).toBe(true);
  expect(control?.getAttribute("style")).toBeNull();
  expect(control?.classList.contains("field-root")).toBe(false);
});
