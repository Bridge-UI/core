// ** External Imports
import { cleanup, render, screen } from "@testing-library/react";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import { afterEach, expect, test } from "vitest";

// ** Local Imports
import { Breadcrumb } from "@/Components/Breadcrumb";
import { BreadcrumbItem } from "@/Components/BreadcrumbItem";

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

function ItemLinkStub({
  children,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & { children?: ReactNode }) {
  return (
    <a data-testid="item-link" {...props}>
      {children}
    </a>
  );
}

afterEach(() => {
  cleanup();
});

test("it should mark the current crumb with aria-current", () => {
  render(
    <Breadcrumb>
      <BreadcrumbItem href="/">Home</BreadcrumbItem>
      <BreadcrumbItem current>Page</BreadcrumbItem>
    </Breadcrumb>,
  );

  expect(
    screen.getByText("Page").closest("[aria-current='page']")?.tagName,
  ).toBe("SPAN");
});

test("it should render as an anchor when href is set", () => {
  render(
    <Breadcrumb>
      <BreadcrumbItem href="/docs">Docs</BreadcrumbItem>
    </Breadcrumb>,
  );

  expect(screen.getByRole("link", { name: "Docs" }).tagName).toBe("A");
});

test("it should render start and end icons", () => {
  const { container } = render(
    <Breadcrumb>
      <BreadcrumbItem href="/" endIcon="check" startIcon="user">
        Home
      </BreadcrumbItem>
    </Breadcrumb>,
  );

  expect(container.querySelectorAll("svg").length).toBeGreaterThan(1);
});

test("it should render linkAs with href and anchor classes", () => {
  render(
    <Breadcrumb>
      <BreadcrumbItem href="/docs" linkAs={RouterLinkStub}>
        Docs
      </BreadcrumbItem>
    </Breadcrumb>,
  );

  const link = screen.getByTestId("router-link");
  const event = new MouseEvent("click", { bubbles: true, cancelable: true });

  link.dispatchEvent(event);

  expect(event.defaultPrevented).toBe(false);
  expect(link.getAttribute("href")).toBe("/docs");
  expect(link.className).toContain("font-medium");
});

test("it should prefer the item linkAs over the breadcrumb linkAs", () => {
  render(
    <Breadcrumb linkAs={RouterLinkStub}>
      <BreadcrumbItem href="/docs" linkAs={ItemLinkStub}>
        Docs
      </BreadcrumbItem>
    </Breadcrumb>,
  );

  expect(screen.getByTestId("item-link").getAttribute("href")).toBe("/docs");
  expect(screen.queryByTestId("router-link")).toBeNull();
});

test("it should keep the current crumb as a span when linkAs is set", () => {
  render(
    <Breadcrumb linkAs={RouterLinkStub}>
      <BreadcrumbItem current>Settings</BreadcrumbItem>
    </Breadcrumb>,
  );

  expect(screen.queryByTestId("router-link")).toBeNull();
  expect(screen.getByText("Settings").tagName).toBe("SPAN");
});
