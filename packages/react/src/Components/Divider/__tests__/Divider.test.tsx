// ** External Imports
import { cleanup, render } from "@testing-library/react";
import { afterEach, expect, test } from "vitest";

afterEach(() => {
  cleanup();
});

// ** Local Imports
import { Divider } from "@/Components/Divider";

test("it should render as an hr element", () => {
  const { container } = render(<Divider />);

  expect(container.querySelector("hr")).not.toBeNull();
});

test("it should apply horizontal orientation by default", () => {
  const { container } = render(<Divider />);

  const root = container.querySelector("hr");

  expect(root?.classList.contains("w-full")).toBe(true);
  expect(root?.classList.contains("h-px")).toBe(true);
  expect(root?.getAttribute("aria-orientation")).toBe("horizontal");
});

test("it should apply vertical orientation when orientation is vertical", () => {
  const { container } = render(<Divider orientation="vertical" />);

  const root = container.querySelector("hr");

  expect(root?.classList.contains("w-px")).toBe(true);
  expect(root?.getAttribute("aria-orientation")).toBe("vertical");
});

test("it should apply dark color by default", () => {
  const { container } = render(<Divider />);

  expect(container.querySelector("hr")?.classList.contains("bg-dark-200")).toBe(
    true,
  );
});

test("it should apply primary color when color is primary", () => {
  const { container } = render(<Divider color="primary" />);

  expect(
    container.querySelector("hr")?.classList.contains("bg-primary-200"),
  ).toBe(true);
});

test("it should expose separator role", () => {
  const { container } = render(<Divider />);

  expect(container.querySelector("hr")?.getAttribute("role")).toBe("separator");
});

test("it should merge className with root classes", () => {
  const { container } = render(<Divider className="my-4" />);

  expect(container.querySelector("hr")?.classList.contains("my-4")).toBe(true);
});

test("it should forward additional attributes to the root element", () => {
  const { container } = render(
    <Divider id="divider-root" data-testid="divider" />,
  );

  const root = container.querySelector("#divider-root");

  expect(root).not.toBeNull();
  expect(root?.getAttribute("data-testid")).toBe("divider");
});

test("it should apply user className after classes.root (tailwind-merge)", () => {
  const { container } = render(
    <Divider className="my-8" classes={{ root: "my-2" }} />,
  );

  const root = container.querySelector("hr");

  expect(root?.classList.contains("my-8")).toBe(true);
  expect(root?.classList.contains("my-2")).toBe(false);
});
