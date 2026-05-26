// ** External Imports
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";

afterEach(() => {
  cleanup();
});

// ** Local Imports
import { PasswordField } from "@/Components/PasswordField";

test("it should render the root element", () => {
  const { container } = render(<PasswordField aria-label="Password" />);

  expect(screen.getByLabelText("Password")).toBeTruthy();
  expect(container.querySelector(".w-full")).not.toBeNull();
});

test("it should use password type by default", () => {
  render(<PasswordField aria-label="Password" />);

  expect(screen.getByLabelText("Password").getAttribute("type")).toBe(
    "password",
  );
});

test("it should render visibility toggle button", () => {
  render(<PasswordField aria-label="Password" />);

  expect(screen.getByRole("button", { name: "Show password" })).toBeTruthy();
});

test("it should toggle input type when visibility button is clicked", () => {
  render(<PasswordField aria-label="Password" />);

  const input = screen.getByLabelText("Password");
  const toggle = screen.getByRole("button", { name: "Show password" });

  fireEvent.click(toggle);

  expect(input.getAttribute("type")).toBe("text");
  expect(screen.getByRole("button", { name: "Hide password" })).toBeTruthy();

  fireEvent.click(screen.getByRole("button", { name: "Hide password" }));

  expect(input.getAttribute("type")).toBe("password");
});

test("it should call onVisibilityChange when toggling", () => {
  const onVisibilityChange = vi.fn();

  render(
    <PasswordField
      aria-label="Password"
      onVisibilityChange={onVisibilityChange}
    />,
  );

  fireEvent.click(screen.getByRole("button", { name: "Show password" }));

  expect(onVisibilityChange).toHaveBeenCalledWith(true);
});

test("it should respect controlled visible prop", () => {
  const { rerender } = render(
    <PasswordField visible={false} aria-label="Password" />,
  );

  expect(screen.getByLabelText("Password").getAttribute("type")).toBe(
    "password",
  );

  rerender(<PasswordField visible aria-label="Password" />);

  expect(screen.getByLabelText("Password").getAttribute("type")).toBe("text");
});

test("it should disable visibility toggle when field is disabled", () => {
  render(<PasswordField disabled aria-label="Password" />);

  expect(
    (
      screen.getByRole("button", {
        name: "Show password",
      }) as HTMLButtonElement
    ).disabled,
  ).toBe(true);
});

test("it should not render error icon when error is set", () => {
  const { container } = render(<PasswordField error aria-label="Password" />);

  expect(container.querySelector(".lucide-circle-alert")).toBeNull();
});

test("it should render a label when label prop is provided", () => {
  render(<PasswordField label="Password" id="password-field" />);

  expect(screen.getByText("Password")).toBeTruthy();
  expect(screen.getByLabelText("Password")).toBeTruthy();
});

test("it should render description when description prop is provided", () => {
  render(<PasswordField description="Helper text" aria-label="Password" />);

  expect(screen.getByText("Helper text")).toBeTruthy();
});

test("it should render error message when errorMessage prop is provided", () => {
  render(<PasswordField error errorMessage="Required" aria-label="Password" />);

  expect(screen.getByText("Required")).toBeTruthy();
});

test("it should set aria-invalid on the input when error is set", () => {
  render(<PasswordField error aria-label="Password" />);

  expect(screen.getByLabelText("Password").getAttribute("aria-invalid")).toBe(
    "true",
  );
});

test("it should merge classes.toggle onto the visibility button", () => {
  render(
    <PasswordField
      aria-label="Password"
      classes={{ toggle: "custom-toggle-class" }}
    />,
  );

  expect(
    screen
      .getByRole("button", { name: "Show password" })
      .classList.contains("custom-toggle-class"),
  ).toBe(true);
});

test("it should forward additional attributes to the input", () => {
  render(
    <PasswordField
      id="field-id"
      aria-label="Password"
      placeholder="Enter password"
      data-testid="password-input"
    />,
  );

  const input = screen.getByTestId("password-input");

  expect(input.id).toBe("field-id");
  expect(input.getAttribute("placeholder")).toBe("Enter password");
});

test("it should update the input value when changed", () => {
  render(<PasswordField defaultValue="" aria-label="Password" />);

  const input = screen.getByLabelText("Password") as HTMLInputElement;

  fireEvent.change(input, { target: { value: "secret" } });

  expect(input.value).toBe("secret");
});
