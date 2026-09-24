// ** External Imports
import { Link as InertiaLink } from "@inertiajs/react";
import { cleanup, render, screen } from "@testing-library/react";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import { afterEach, expect, test } from "vitest";

// ** Local Imports
import { Breadcrumb } from "@/Components/Breadcrumb";
import { BreadcrumbItem } from "@/Components/BreadcrumbItem";

function MarkerLink({
  children,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & { children?: ReactNode }) {
  return (
    <a data-testid="marker-link" {...props}>
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
      <BreadcrumbItem
        href="/docs"
        linkAs={InertiaLink}
        linkProps={{ onBefore: () => false }}
      >
        Docs
      </BreadcrumbItem>
    </Breadcrumb>,
  );

  const link = screen.getByRole("link", { name: "Docs" });
  const event = new MouseEvent("click", { bubbles: true, cancelable: true });

  link.dispatchEvent(event);

  expect(event.defaultPrevented).toBe(true);
  expect(link.getAttribute("href")).toBe("/docs");
  expect(link.className).toContain("font-medium");
});

test("it should forward linkProps to linkAs", () => {
  render(
    <Breadcrumb>
      <BreadcrumbItem
        href="/docs"
        linkAs={InertiaLink}
        linkProps={{ method: "post" }}
      >
        Docs
      </BreadcrumbItem>
    </Breadcrumb>,
  );

  const link = screen.getByRole("button", { name: "Docs" });

  expect(link.tagName).toBe("BUTTON");
  expect(link.getAttribute("type")).toBe("button");
});

test("it should prefer the item linkAs over the breadcrumb linkAs", () => {
  render(
    <Breadcrumb linkAs={MarkerLink}>
      <BreadcrumbItem href="/docs" linkAs={InertiaLink}>
        Docs
      </BreadcrumbItem>
    </Breadcrumb>,
  );

  expect(screen.getByRole("link", { name: "Docs" }).getAttribute("href")).toBe(
    "/docs",
  );
  expect(screen.queryByTestId("marker-link")).toBeNull();
});

test("it should keep the current crumb as a span when linkAs is set", () => {
  render(
    <Breadcrumb linkAs={InertiaLink}>
      <BreadcrumbItem current>Settings</BreadcrumbItem>
    </Breadcrumb>,
  );

  expect(screen.queryByRole("link")).toBeNull();
  expect(screen.getByText("Settings").tagName).toBe("SPAN");
});
