// ** External Imports
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, test } from "vitest";

// ** Local Imports
import { Breadcrumb } from "@/Components/Breadcrumb";
import { BreadcrumbItem } from "@/Components/BreadcrumbItem";

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
