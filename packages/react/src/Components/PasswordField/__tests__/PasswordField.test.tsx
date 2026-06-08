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
  const { container } = render(<PasswordField value="secret" />);

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
