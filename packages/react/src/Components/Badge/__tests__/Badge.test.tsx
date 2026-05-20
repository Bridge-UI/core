// ** External Imports
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, test } from "vitest";

afterEach(() => {
  cleanup();
});

// ** Local Imports
import { Badge } from "@/Components/Badge";

test("it should render children", () => {
  render(<Badge>New</Badge>);

  expect(screen.getByText("New")).toBeTruthy();
});

test("it should render as a span element", () => {
  const { container } = render(<Badge>Label</Badge>);

  expect(container.querySelector("span")).not.toBeNull();
});

test("it should apply rounded-md by default", () => {
  const { container } = render(<Badge>Label</Badge>);

  expect(
    container.querySelector("span")?.classList.contains("rounded-md"),
  ).toBe(true);
});

test("it should apply color variant classes", () => {
  const { container } = render(<Badge color="error">Error</Badge>);

  const root = container.querySelector("span");

  expect(root?.className.length).toBeGreaterThan(0);
});

test("it should merge className with root classes", () => {
  const { container } = render(<Badge className="custom-badge">Styled</Badge>);

  expect(
    container.querySelector("span")?.classList.contains("custom-badge"),
  ).toBe(true);
});

test("it should forward additional attributes to the root element", () => {
  const { container } = render(
    <Badge id="badge-root" data-testid="badge">
      Tagged
    </Badge>,
  );

  const root = container.querySelector("#badge-root");

  expect(root).not.toBeNull();
  expect(root?.getAttribute("data-testid")).toBe("badge");
});

test("it should apply user className after classes.root (tailwind-merge)", () => {
  const { container } = render(
    <Badge className="p-4" classes={{ root: "p-2" }}>
      Priority
    </Badge>,
  );

  const root = container.querySelector("span");

  expect(root?.classList.contains("p-4")).toBe(true);
  expect(root?.classList.contains("p-2")).toBe(false);
});
