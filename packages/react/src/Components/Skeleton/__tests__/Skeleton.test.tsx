// ** External Imports
import { cleanup, render } from "@testing-library/react";
import { afterEach, expect, test } from "vitest";

afterEach(() => {
  cleanup();
});

// ** Local Imports
import { Skeleton } from "@/Components/Skeleton";

test("it should render as a div element", () => {
  const { container } = render(<Skeleton className="h-4 w-32" />);

  expect(container.querySelector("div")).not.toBeNull();
});

test("it should apply rounded-md by default", () => {
  const { container } = render(<Skeleton className="h-4 w-32" />);

  expect(container.querySelector("div")?.classList.contains("rounded-md")).toBe(
    true,
  );
});

test("it should apply rounded-full when rounded is full", () => {
  const { container } = render(
    <Skeleton rounded="full" className="h-10 w-10" />,
  );

  expect(
    container.querySelector("div")?.classList.contains("rounded-full"),
  ).toBe(true);
});

test("it should merge className with root classes", () => {
  const { container } = render(<Skeleton className="h-4 w-48" />);

  const root = container.querySelector("div");

  expect(root?.classList.contains("h-4")).toBe(true);
  expect(root?.classList.contains("w-48")).toBe(true);
});

test("it should apply pulse animation by default", () => {
  const { container } = render(<Skeleton className="h-4 w-32" />);

  expect(
    container.querySelector("div")?.classList.contains("animate-pulse"),
  ).toBe(true);
});

test("it should forward additional attributes to the root element", () => {
  const { container } = render(
    <Skeleton id="skeleton-root" className="h-4 w-32" data-testid="skeleton" />,
  );

  const root = container.querySelector("#skeleton-root");

  expect(root).not.toBeNull();
  expect(root?.getAttribute("data-testid")).toBe("skeleton");
});

test("it should apply user className after classes.root (tailwind-merge)", () => {
  const { container } = render(
    <Skeleton className="h-8" classes={{ root: "h-4" }} />,
  );

  const root = container.querySelector("div");

  expect(root?.classList.contains("h-8")).toBe(true);
  expect(root?.classList.contains("h-4")).toBe(false);
});
