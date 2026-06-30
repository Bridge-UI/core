// ** External Imports
import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";

// ** Local Imports
import { List } from "@/Components/List";
import { ListItem } from "@/Components/ListItem";

test("it should render primary text from the primary prop", () => {
  render(<ListItem primary="Edit item" />);

  expect(screen.getByText("Edit item")).toBeTruthy();
});

test("it should render an interactive wrapper with menuitem role", () => {
  render(<ListItem interactive role="menuitem" primary="Action" />);

  const interactive = screen.getByRole("menuitem");

  expect(interactive.getAttribute("tabindex")).toBe("0");
});

test("it should inherit dense padding from parent List", () => {
  const { container } = render(
    <List dense>
      <ListItem interactive role="menuitem" primary="Dense item" />
    </List>,
  );

  const interactive = container.querySelector('[role="menuitem"]');

  expect(interactive?.classList.contains("py-1.5")).toBe(true);
  expect(interactive?.classList.contains("py-2")).toBe(false);
});

test("it should apply selected styles when selected is true", () => {
  const { container } = render(
    <ListItem selected interactive primary="Selected" />,
  );

  const interactive = container.querySelector('[role="button"]');

  expect(interactive?.classList.contains("bg-primary-50")).toBe(true);
  expect(interactive?.classList.contains("text-primary-700")).toBe(true);
});

test("it should disable interaction when disabled is true", () => {
  const { container } = render(
    <ListItem disabled interactive primary="Disabled" />,
  );

  const interactive = container.querySelector('[role="button"]');

  expect(interactive?.getAttribute("tabindex")).toBe("-1");
  expect(interactive?.getAttribute("aria-disabled")).toBe("true");
  expect(interactive?.classList.contains("pointer-events-none")).toBe(true);
});

test("it should apply divider border on the root item", () => {
  const { container } = render(<ListItem divider primary="With divider" />);

  const root = container.querySelector("li");

  expect(root?.className.includes("border-b")).toBe(true);
});
