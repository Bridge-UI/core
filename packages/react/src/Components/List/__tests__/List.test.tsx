// ** External Imports
import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";

// ** Local Imports
import { List } from "@/Components/List";

test("it should render the root element", () => {
  const { container } = render(<List />);

  const root = container.querySelector("ul");

  expect(root).not.toBeNull();
  expect(root?.classList.contains("m-0")).toBe(true);
  expect(root?.classList.contains("py-2")).toBe(true);
  expect(root?.classList.contains("list-none")).toBe(true);
});

test("it should apply nested indent and a start-edge guide line", () => {
  const { container } = render(<List nested />);

  expect(container.querySelector("ul")?.classList.contains("border-l")).toBe(
    true,
  );
  expect(container.querySelector("ul")?.classList.contains("ml-3.5")).toBe(
    true,
  );
});

test("it should render children", () => {
  render(
    <List>
      <li>Item one</li>
    </List>,
  );

  expect(screen.getByText("Item one")).toBeTruthy();
});

test("it should render a custom root element when as prop is set", () => {
  const { container } = render(<List as="div" />);

  expect(container.querySelector("ul")).toBeNull();
  expect(container.querySelector("div")).not.toBeNull();
});

test("it should merge className with root classes", () => {
  const { container } = render(<List className="custom-list" />);

  expect(container.querySelector("ul")?.classList.contains("custom-list")).toBe(
    true,
  );
});
