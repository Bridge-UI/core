// ** External Imports
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, test } from "vitest";

afterEach(() => {
  cleanup();
});

// ** Local Imports
import { Progress } from "@/Components/Progress";

test("it should render with role progressbar", () => {
  render(<Progress aria-label="Loading…" />);

  expect(screen.getByRole("progressbar")).not.toBeNull();
});

test("it should omit aria-valuenow for indeterminate by default", () => {
  render(<Progress aria-label="Loading…" />);

  expect(screen.getByRole("progressbar").getAttribute("aria-valuenow")).toBe(
    null,
  );
});

test("it should set aria-valuenow for determinate variant", () => {
  render(<Progress value={40} aria-label="Export" variant="determinate" />);

  const root = screen.getByRole("progressbar");

  expect(root.getAttribute("aria-valuenow")).toBe("40");
  expect(root.getAttribute("aria-valuemin")).toBe("0");
  expect(root.getAttribute("aria-valuemax")).toBe("100");
});

test("it should apply determinate bar width from value", () => {
  const { container } = render(
    <Progress value={75} aria-label="Export" variant="determinate" />,
  );

  const bar = container.querySelector('[role="progressbar"] > div:last-child');

  expect(bar).not.toBeNull();
  expect((bar as HTMLElement).style.width).toBe("75%");
});

test("it should render buffer bar with valueBuffer width", () => {
  const { container } = render(
    <Progress
      value={30}
      variant="buffer"
      valueBuffer={60}
      aria-label="Loading…"
    />,
  );

  const root = container.querySelector('[role="progressbar"]');
  const children = root?.querySelectorAll(":scope > div");

  expect(children?.length).toBe(3);

  const buffer = children?.[1] as HTMLElement;
  const bar = children?.[2] as HTMLElement;

  expect(buffer.style.width).toBe("60%");
  expect(bar.style.width).toBe("30%");
});

test("it should apply query animation class", () => {
  const { container } = render(
    <Progress variant="query" aria-label="Loading…" />,
  );

  const bar = container.querySelector('[role="progressbar"] > div:last-child');

  expect(bar?.classList.contains("animate-bridge-progress-query")).toBe(true);
});

test("it should apply indeterminate animation class by default", () => {
  const { container } = render(<Progress aria-label="Loading…" />);

  const bar = container.querySelector('[role="progressbar"] > div:last-child');

  expect(bar?.classList.contains("animate-bridge-progress-indeterminate")).toBe(
    true,
  );
});

test("it should apply primary bar color by default", () => {
  const { container } = render(<Progress aria-label="Loading…" />);

  const bar = container.querySelector('[role="progressbar"] > div:last-child');

  expect(bar?.classList.contains("bg-primary-500")).toBe(true);
});

test("it should apply size height class", () => {
  render(<Progress size="lg" aria-label="Loading…" />);

  expect(screen.getByRole("progressbar").classList.contains("h-2")).toBe(true);
});

test("it should apply rounded-full by default", () => {
  render(<Progress aria-label="Loading…" />);

  expect(
    screen.getByRole("progressbar").classList.contains("rounded-full"),
  ).toBe(true);
});

test("it should clamp value above 100", () => {
  const { container } = render(
    <Progress value={150} aria-label="Export" variant="determinate" />,
  );

  const root = screen.getByRole("progressbar");
  const bar = container.querySelector('[role="progressbar"] > div:last-child');

  expect(root.getAttribute("aria-valuenow")).toBe("100");
  expect((bar as HTMLElement).style.width).toBe("100%");
});

test("it should forward aria-label to the root", () => {
  render(<Progress aria-label="Uploading photos" />);

  expect(
    screen.getByRole("progressbar", { name: "Uploading photos" }),
  ).not.toBeNull();
});
