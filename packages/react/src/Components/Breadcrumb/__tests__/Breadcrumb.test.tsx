// ** External Imports
import { Link as InertiaLink } from "@inertiajs/react";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, test } from "vitest";

// ** Local Imports
import { Breadcrumb } from "@/Components/Breadcrumb";
import { BreadcrumbItem } from "@/Components/BreadcrumbItem";

afterEach(() => {
  cleanup();
});

test("it should render a nav list with crumbs", () => {
  render(
    <Breadcrumb>
      <BreadcrumbItem href="/">Home</BreadcrumbItem>
      <BreadcrumbItem href="/docs">Docs</BreadcrumbItem>
      <BreadcrumbItem current>Avatar</BreadcrumbItem>
    </Breadcrumb>,
  );

  expect(screen.getByRole("navigation", { name: "Breadcrumb" })).toBeTruthy();
  expect(screen.getByRole("link", { name: "Home" }).getAttribute("href")).toBe(
    "/",
  );
  expect(
    screen.getByText("Avatar").closest("[aria-current='page']"),
  ).toBeTruthy();
});

test("it should render from items data", () => {
  render(
    <Breadcrumb
      items={[
        { href: "/", label: "Home" },
        { href: "/docs", label: "Docs" },
        { current: true, label: "Avatar" },
      ]}
    />,
  );

  expect(screen.getByRole("link", { name: "Docs" })).toBeTruthy();
  expect(
    screen.getByText("Avatar").closest("[aria-current='page']"),
  ).toBeTruthy();
});

test("it should collapse middle items when maxItems is set", () => {
  render(
    <Breadcrumb
      maxItems={3}
      items={[
        { href: "/", label: "Home" },
        { href: "/a", label: "A" },
        { href: "/b", label: "B" },
        { href: "/c", label: "C" },
        { label: "Page", current: true },
      ]}
    />,
  );

  expect(screen.getByText("…")).toBeTruthy();
  expect(screen.getByText("Page")).toBeTruthy();
  expect(screen.queryByRole("link", { name: "A" })).toBeNull();
  expect(screen.getByRole("link", { name: "Home" })).toBeTruthy();
});

test("it should render an icon-only crumb with aria-label", () => {
  render(
    <Breadcrumb>
      <BreadcrumbItem href="/" startIcon="user" aria-label="Home" />
      <BreadcrumbItem current>Page</BreadcrumbItem>
    </Breadcrumb>,
  );

  expect(screen.queryByText("Home")).toBeNull();
  expect(screen.getByRole("link", { name: "Home" })).toBeTruthy();
});

test("it should use a custom separator slot", () => {
  render(
    <Breadcrumb slots={{ separator: <span data-testid="sep">/</span> }}>
      <BreadcrumbItem href="/">Home</BreadcrumbItem>
      <BreadcrumbItem current>Page</BreadcrumbItem>
    </Breadcrumb>,
  );

  expect(screen.getAllByTestId("sep").length).toBeGreaterThan(0);
});

test("it should pass linkAs to crumbs rendered from items", () => {
  render(
    <Breadcrumb
      linkAs={InertiaLink}
      items={[
        { href: "/", label: "Home", linkProps: { method: "post" } },
        { current: true, label: "Settings" },
      ]}
    />,
  );

  const link = screen.getByRole("button", { name: "Home" });

  expect(link.tagName).toBe("BUTTON");
  expect(link.className).toContain("font-medium");
  expect(link.getAttribute("type")).toBe("button");
  expect(screen.getAllByRole("button")).toHaveLength(1);
  expect(screen.getByText("Settings").tagName).toBe("SPAN");
});
