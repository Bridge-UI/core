// ** External Imports
import { render } from "@testing-library/react";
import { Info } from "lucide-react";
import { expect, test } from "vitest";

// ** Local Imports
import { Icon } from "@/Components/Icon";

test("it should render an svg element", () => {
  const { container } = render(<Icon icon={Info} />);

  expect(container.querySelector("svg")).not.toBeNull();
});

test("it should apply default md size classes", () => {
  const { container } = render(<Icon icon={Info} />);

  const svg = container.querySelector("svg");

  expect(svg?.classList.contains("w-4")).toBe(true);
  expect(svg?.classList.contains("h-4")).toBe(true);
});

test("it should apply sm size classes", () => {
  const { container } = render(<Icon icon={Info} size="sm" />);

  const svg = container.querySelector("svg");

  expect(svg?.classList.contains("w-3.5")).toBe(true);
  expect(svg?.classList.contains("h-3.5")).toBe(true);
});

test("it should apply xl size classes", () => {
  const { container } = render(<Icon icon={Info} size="xl" />);

  const svg = container.querySelector("svg");

  expect(svg?.classList.contains("w-6")).toBe(true);
  expect(svg?.classList.contains("h-6")).toBe(true);
});

test("it should merge custom className prop", () => {
  const { container } = render(<Icon icon={Info} className="text-red-500" />);

  expect(
    container.querySelector("svg")?.classList.contains("text-red-500"),
  ).toBe(true);
});

test("it should apply lg size classes", () => {
  const { container } = render(<Icon icon={Info} size="lg" />);

  const svg = container.querySelector("svg");

  expect(svg?.classList.contains("w-5")).toBe(true);
  expect(svg?.classList.contains("h-5")).toBe(true);
});

test("it should forward additional attributes to the svg element", () => {
  const { container } = render(
    <Icon icon={Info} id="info-icon" data-testid="icon" aria-hidden />,
  );

  const svg = container.querySelector("#info-icon");

  expect(svg).not.toBeNull();
  expect(svg?.getAttribute("data-testid")).toBe("icon");
  expect(svg?.getAttribute("aria-hidden")).toBe("true");
});

test("it should apply 2xs size classes", () => {
  const { container } = render(<Icon icon={Info} size="2xs" />);

  const svg = container.querySelector("svg");

  expect(svg?.classList.contains("w-2")).toBe(true);
  expect(svg?.classList.contains("h-2")).toBe(true);
});
