// ** External Imports
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, test } from "vitest";

afterEach(() => {
  cleanup();
});

// ** Local Imports
import { MiniBadge } from "@/Components/MiniBadge";

test("it should render children", () => {
  render(<MiniBadge>3</MiniBadge>);

  expect(screen.getByText("3")).toBeTruthy();
});

test("it should render as a span element", () => {
  const { container } = render(<MiniBadge>1</MiniBadge>);

  expect(container.querySelector("span")).not.toBeNull();
});

test("it should apply sm size by default", () => {
  const { container } = render(<MiniBadge>1</MiniBadge>);

  const root = container.querySelector("span");

  expect(root?.className).toContain("min-w-6");
});

test("it should merge className with root classes", () => {
  const { container } = render(
    <MiniBadge className="custom-mini-badge">Styled</MiniBadge>,
  );

  expect(
    container.querySelector("span")?.classList.contains("custom-mini-badge"),
  ).toBe(true);
});

test("it should forward additional attributes to the root element", () => {
  const { container } = render(
    <MiniBadge id="mini-badge-root" data-testid="mini-badge">
      Count
    </MiniBadge>,
  );

  const root = container.querySelector("#mini-badge-root");

  expect(root).not.toBeNull();
  expect(root?.getAttribute("data-testid")).toBe("mini-badge");
});
