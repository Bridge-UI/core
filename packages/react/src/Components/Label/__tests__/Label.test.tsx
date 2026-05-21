// ** External Imports
import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";

// ** Local Imports
import { Label } from "@/Components/Label";

test("it should render label text", () => {
  render(<Label htmlFor="field-id">Email</Label>);

  const label = screen.getByText("Email");

  expect(label.tagName).toBe("LABEL");
  expect(label.getAttribute("for")).toBe("field-id");
});

test("it should apply error color when error is true", () => {
  const { container } = render(<Label error>Email</Label>);

  expect(container.querySelector(".text-error-600")).not.toBeNull();
});

test("it should render required asterisk when required is true", () => {
  render(<Label required>Email</Label>);

  expect(screen.getByText("*")).toBeTruthy();
});

test("it should apply size typography class", () => {
  const { container } = render(<Label size="lg">Email</Label>);

  expect(container.querySelector(".text-sm")).not.toBeNull();
});
