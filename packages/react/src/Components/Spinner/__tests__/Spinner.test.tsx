// ** External Imports
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, test } from "vitest";

afterEach(() => {
  cleanup();
});

// ** Local Imports
import { Spinner } from "@/Components/Spinner";

test("it should render with role progressbar", () => {
  render(<Spinner aria-label="Loading…" />);

  expect(screen.getByRole("progressbar")).not.toBeNull();
});

test("it should omit aria-valuenow for indeterminate by default", () => {
  render(<Spinner aria-label="Loading…" />);

  expect(screen.getByRole("progressbar").getAttribute("aria-valuenow")).toBe(
    null,
  );
});

test("it should set aria-valuenow for determinate variant", () => {
  render(<Spinner value={40} aria-label="Export" variant="determinate" />);

  const root = screen.getByRole("progressbar");

  expect(root.getAttribute("aria-valuenow")).toBe("40");
  expect(root.getAttribute("aria-valuemin")).toBe("0");
  expect(root.getAttribute("aria-valuemax")).toBe("100");
});

test("it should apply rotate animation on root for indeterminate", () => {
  render(<Spinner aria-label="Loading…" />);

  expect(
    screen
      .getByRole("progressbar")
      .classList.contains("animate-bridge-spinner-rotate"),
  ).toBe(true);
});

test("it should apply dash animation on circle by default", () => {
  const { container } = render(<Spinner aria-label="Loading…" />);

  const circle = container.querySelector("circle");

  expect(circle?.classList.contains("animate-bridge-spinner-dash")).toBe(true);
});

test("it should omit dash animation when disableShrink is true", () => {
  const { container } = render(<Spinner disableShrink aria-label="Loading…" />);

  const circle = container.querySelector("circle");

  expect(circle?.classList.contains("animate-bridge-spinner-dash")).toBe(false);
});

test("it should render track circle when enableTrack is true", () => {
  const { container } = render(<Spinner enableTrack aria-label="Loading…" />);

  expect(container.querySelectorAll("circle")).toHaveLength(2);
});

test("it should apply primary circle stroke by default", () => {
  const { container } = render(<Spinner aria-label="Loading…" />);

  const circle = container.querySelector("circle");

  expect(circle?.classList.contains("stroke-primary-500")).toBe(true);
});

test("it should apply size class", () => {
  render(<Spinner size="lg" aria-label="Loading…" />);

  expect(screen.getByRole("progressbar").classList.contains("size-14")).toBe(
    true,
  );
});

test("it should clamp value above 100", () => {
  render(<Spinner value={150} aria-label="Export" variant="determinate" />);

  expect(screen.getByRole("progressbar").getAttribute("aria-valuenow")).toBe(
    "100",
  );
});

test("it should forward aria-label to the root", () => {
  render(<Spinner aria-label="Uploading photos" />);

  expect(
    screen.getByRole("progressbar", { name: "Uploading photos" }),
  ).not.toBeNull();
});

test("it should render an svg element", () => {
  const { container } = render(<Spinner aria-label="Loading…" />);

  expect(container.querySelector("svg")).not.toBeNull();
});
