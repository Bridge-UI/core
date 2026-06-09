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
  expect(root?.classList.contains("list-none")).toBe(true);
});

test("it should apply padding classes when padding prop is set", () => {
  const { container: noneContainer } = render(<List padding="none" />);
  const { container: normalContainer } = render(<List padding="normal" />);

  const none = noneContainer.querySelector("ul");
  const normal = normalContainer.querySelector("ul");

  expect(none?.classList.contains("p-0")).toBe(true);
  expect(none?.classList.contains("py-2")).toBe(false);

  expect(normal?.classList.contains("py-2")).toBe(true);
  expect(normal?.classList.contains("p-0")).toBe(false);
});

test("it should apply nested indent when nested is true", () => {
  const { container } = render(<List nested />);

  expect(container.querySelector("ul")?.classList.contains("pl-4")).toBe(true);
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

  expect(container.querySelector("div")).not.toBeNull();
  expect(container.querySelector("ul")).toBeNull();
});

test("it should merge className with root classes", () => {
  const { container } = render(<List className="custom-list" />);

  expect(container.querySelector("ul")?.classList.contains("custom-list")).toBe(
    true,
  );
});
