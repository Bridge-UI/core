// ** External Imports
import { cleanup, render, screen } from "@testing-library/react";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import { afterEach, expect, test } from "vitest";

// ** Local Imports
import { List } from "@/Components/List";
import { ListItem } from "@/Components/ListItem";

function RouterLinkStub({
  children,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & { children?: ReactNode }) {
  return (
    <a data-testid="router-link" {...props}>
      {children}
    </a>
  );
}

afterEach(() => {
  cleanup();
});

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

  expect(interactive?.classList.contains("py-1")).toBe(true);
  expect(interactive?.classList.contains("py-1.5")).toBe(false);
  expect(interactive?.classList.contains("rounded-md")).toBe(true);
});

test("it should apply selected styles when selected is true", () => {
  const { container } = render(
    <ListItem selected interactive primary="Selected" />,
  );

  const interactive = container.querySelector('[role="button"]');

  expect(interactive?.classList.contains("bg-dark-100")).toBe(true);
  expect(interactive?.classList.contains("text-dark-900")).toBe(true);
});

test("it should render a check icon when selected is true", () => {
  const { container } = render(
    <ListItem selected interactive primary="Selected" />,
  );

  expect(container.querySelector("svg")).not.toBeNull();
});

test("it should not render a selected icon when selectedIcon is null", () => {
  const { container } = render(
    <ListItem selected interactive primary="Selected" selectedIcon={null} />,
  );

  expect(container.querySelector("svg")).toBeNull();
});

test("it should render an anchor when href is set", () => {
  const { container } = render(
    <ListItem href="/inbox" target="_blank" primary="Inbox" rel="noreferrer" />,
  );

  const link = screen.getByRole("link", { name: "Inbox" });

  expect(link.tagName).toBe("A");
  expect(link.getAttribute("rel")).toBe("noreferrer");
  expect(link.getAttribute("href")).toBe("/inbox");
  expect(link.getAttribute("target")).toBe("_blank");
  expect(container.querySelector("li > a")).toBe(link);
});

test("it should omit href when the link is disabled", () => {
  render(<ListItem disabled href="/archive" primary="Archive" />);

  const link = screen.getByText("Archive").closest("a");

  expect(link?.getAttribute("href")).toBeNull();
  expect(link?.getAttribute("aria-disabled")).toBe("true");
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

test("it should keep primary text from clipping truncated glyphs", () => {
  render(<ListItem primary="Configurações" />);

  const primary = screen.getByText("Configurações");

  expect(primary.className).toContain("truncate");
  expect(primary.className).toContain("leading-normal");
  expect(primary.className).not.toContain("leading-none");
});

test("it should render linkAs inside the list item root", () => {
  const { container } = render(
    <ListItem href="/inbox" primary="Inbox" linkAs={RouterLinkStub} />,
  );

  const link = screen.getByTestId("router-link");
  const event = new MouseEvent("click", { bubbles: true, cancelable: true });

  link.dispatchEvent(event);

  expect(event.defaultPrevented).toBe(false);
  expect(link.getAttribute("href")).toBe("/inbox");
  expect(link.className).toContain("no-underline");
  expect(container.firstElementChild?.tagName).toBe("LI");
  expect(link.parentElement?.tagName).toBe("LI");
});

test("it should keep a div root when as is div and linkAs is set", () => {
  const { container } = render(
    <ListItem as="div" href="/inbox" primary="Inbox" linkAs={RouterLinkStub} />,
  );

  const link = screen.getByTestId("router-link");

  expect(container.firstElementChild?.tagName).toBe("DIV");
  expect(link.parentElement?.tagName).toBe("DIV");
});

test("it should keep a native anchor when linkAs is set and the item is disabled", () => {
  render(
    <ListItem
      disabled
      href="/archive"
      primary="Archive"
      linkAs={RouterLinkStub}
    />,
  );

  const anchor = screen.getByText("Archive").closest("a");

  expect(screen.queryByTestId("router-link")).toBeNull();
  expect(anchor?.getAttribute("href")).toBeNull();
});
