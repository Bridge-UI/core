// ** External Imports
import { Link as InertiaLink } from "@inertiajs/react";
import { cleanup, render, screen } from "@testing-library/react";
import { ExternalLink, Info } from "lucide-react";
import { afterEach, expect, test } from "vitest";

afterEach(() => {
  cleanup();
});

// ** Local Imports
import { Link } from "@/Components/Link";

test("it should render as an anchor with children", () => {
  render(<Link href="/docs">Documentation</Link>);

  const link = screen.getByRole("link", { name: "Documentation" });

  expect(link.getAttribute("href")).toBe("/docs");
});

test("it should apply aria-disabled when disabled", () => {
  render(
    <Link disabled href="/docs">
      Disabled
    </Link>,
  );

  const link = screen.getByText("Disabled");

  expect(link.getAttribute("href")).toBeNull();
  expect(link.getAttribute("aria-disabled")).toBe("true");
});

test("it should open in a new tab when external is true", () => {
  render(
    <Link external href="https://example.com">
      External
    </Link>,
  );

  const link = screen.getByRole("link", { name: "External" });

  expect(link.getAttribute("target")).toBe("_blank");
  expect(link.getAttribute("rel")).toBe("noopener noreferrer");
});

test("it should render left icon when leftIcon prop is set", () => {
  const { container } = render(
    <Link href="/docs" leftIcon={Info}>
      Docs
    </Link>,
  );

  expect(container.querySelector("a svg")).not.toBeNull();
});

test("it should render right icon when rightIcon prop is set", () => {
  const { container } = render(
    <Link href="/docs" rightIcon={ExternalLink}>
      Docs
    </Link>,
  );

  expect(container.querySelectorAll("a svg").length).toBeGreaterThan(0);
});

test("it should render prepend slot content", () => {
  render(
    <Link
      href="/docs"
      slots={{ prepend: <span data-testid="prepend">◀</span> }}
    >
      Docs
    </Link>,
  );

  expect(screen.getByText("Docs")).toBeTruthy();
  expect(screen.getByTestId("prepend")).toBeTruthy();
});

test("it should merge className with root classes", () => {
  const { container } = render(
    <Link href="/docs" className="custom-link">
      Styled
    </Link>,
  );

  expect(container.querySelector("a")?.classList.contains("custom-link")).toBe(
    true,
  );
});

test("it should forward customProps to icon sub-parts", () => {
  const { container } = render(
    <Link
      href="/docs"
      leftIcon={Info}
      customProps={{
        leftIcon: { id: "link-left-icon" },
      }}
    >
      Docs
    </Link>,
  );

  expect(container.querySelector("#link-left-icon")).toBeTruthy();
});

test("it should render linkAs with href and anchor classes", () => {
  render(
    <Link
      href="/docs"
      linkAs={InertiaLink}
      linkProps={{ onBefore: () => false }}
    >
      Documentation
    </Link>,
  );

  const link = screen.getByRole("link", { name: "Documentation" });
  const event = new MouseEvent("click", { bubbles: true, cancelable: true });

  link.dispatchEvent(event);

  expect(event.defaultPrevented).toBe(true);
  expect(link.getAttribute("href")).toBe("/docs");
  expect(link.className).toContain("font-medium");
  expect(link.textContent).toContain("Documentation");
});

test("it should forward linkProps to linkAs", () => {
  render(
    <Link href="/logout" linkAs={InertiaLink} linkProps={{ method: "post" }}>
      Logout
    </Link>,
  );

  const link = screen.getByRole("button", { name: "Logout" });

  expect(link.tagName).toBe("BUTTON");
  expect(link.getAttribute("type")).toBe("button");
});

test("it should keep a native anchor when linkAs is set and the link is disabled", () => {
  render(
    <Link disabled href="/docs" linkAs={InertiaLink}>
      Disabled
    </Link>,
  );

  expect(screen.queryByRole("link")).toBeNull();
  expect(screen.getByText("Disabled").tagName).toBe("A");
  expect(screen.getByText("Disabled").getAttribute("href")).toBeNull();
});
