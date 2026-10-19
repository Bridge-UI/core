// ** External Imports
import { CircleAlert } from "@lucide/svelte";
import { render } from "@testing-library/svelte";
import { expect, test } from "vitest";

// ** Local Imports
import { Button } from "@/Components/Button";
import TestLink from "@/Components/Button/__tests__/TestLink.svelte";
import { textSnippet } from "@/Utils/__tests__/textSnippet";

test("it should render a button with children", () => {
  const { container } = render(Button, {
    props: { children: textSnippet("Click me") },
  });

  expect(container.textContent).toContain("Click me");
  expect(container.querySelector("button")).not.toBeNull();
});

test("it should apply disabled attribute when disabled", () => {
  const { container } = render(Button, {
    props: { disabled: true, children: textSnippet("Disabled") },
  });

  expect(container.querySelector("button")?.hasAttribute("disabled")).toBe(
    true,
  );
});

test("it should keep label text in the DOM when loading", () => {
  const { container } = render(Button, {
    props: { loading: true, children: textSnippet("Saving") },
  });

  expect(container.textContent).toContain("Saving");
  expect(container.querySelector("span.invisible")).not.toBeNull();
  expect(container.querySelector("svg.animate-spin")).not.toBeNull();
  expect(container.querySelector("button")?.getAttribute("aria-busy")).toBe(
    "true",
  );
});

test("it should prefer text prop over children", () => {
  const { container } = render(Button, {
    props: { text: "From prop", children: textSnippet("From slot") },
  });

  expect(container.textContent).toContain("From prop");
  expect(container.textContent).not.toContain("From slot");
});

test("it should render start icon when startIcon prop is set", () => {
  const { container } = render(Button, {
    props: { startIcon: CircleAlert, children: textSnippet("With icon") },
  });

  expect(container.querySelector("button svg")).not.toBeNull();
});

test("it should render as anchor when as is a", () => {
  const { container } = render(Button, {
    props: {
      as: "a",
      href: "https://example.com",
      children: textSnippet("Link"),
    },
  });

  expect(container.querySelector("a")?.getAttribute("href")).toBe(
    "https://example.com",
  );
  expect(container.querySelector("a")?.hasAttribute("type")).toBe(false);
});

test("it should render the start snippet in its wrapper", () => {
  const { container } = render(Button, {
    props: {
      start: textSnippet("◀"),
      children: textSnippet("Label"),
      customProps: { start: { "data-testid": "start-slot" } },
    },
  });

  expect(container.textContent).toContain("◀");
  expect(container.querySelector('[data-testid="start-slot"]')).not.toBeNull();
});

test("it should not leak snippets as element attributes", () => {
  const { container } = render(Button, {
    props: { start: textSnippet("◀"), children: textSnippet("Label") },
  });

  const button = container.querySelector("button");

  expect(button?.hasAttribute("start")).toBe(false);
  expect(button?.hasAttribute("children")).toBe(false);
});

test("it should forward additional attributes to the root element", () => {
  const { container } = render(Button, {
    props: {
      id: "submit-btn",
      "data-testid": "button",
      children: textSnippet("Submit"),
    },
  });

  expect(
    container.querySelector("#submit-btn")?.getAttribute("data-testid"),
  ).toBe("button");
});

test("it should forward customProps to icon sub-parts", () => {
  const { container } = render(Button, {
    props: {
      startIcon: CircleAlert,
      children: textSnippet("Save"),
      customProps: { startIcon: { id: "start-icon" } },
    },
  });

  expect(container.querySelector("#start-icon")).not.toBeNull();
});

test("it should apply user class after classes.root (tailwind-merge)", () => {
  const { container } = render(Button, {
    props: {
      class: "p-4",
      classes: { root: "p-2" },
      children: textSnippet("Priority"),
    },
  });

  const root = container.querySelector("button");

  expect(root?.classList).toContain("p-4");
  expect(root?.classList).not.toContain("p-2");
});

test("it should default type to button and respect submit", () => {
  const first = render(Button, { props: { children: textSnippet("Default") } });

  expect(first.container.querySelector("button")?.getAttribute("type")).toBe(
    "button",
  );

  const second = render(Button, {
    props: { type: "submit", children: textSnippet("Save") },
  });

  expect(second.container.querySelector("button")?.getAttribute("type")).toBe(
    "submit",
  );
});

test("it should mark the button as pressed when selected", () => {
  const { container } = render(Button, {
    props: {
      selected: true,
      variant: "outline",
      children: textSnippet("Bold"),
    },
  });

  const button = container.querySelector("button");

  expect(button?.getAttribute("aria-pressed")).toBe("true");
  expect(button?.classList).toContain("bg-primary-400/25");
});

test("it should render linkAs with href, classes and linkProps", () => {
  const { container } = render(Button, {
    props: {
      href: "/logout",
      linkAs: TestLink,
      linkProps: { method: "post" },
      children: textSnippet("Logout"),
    },
  });

  const link = container.querySelector("a");

  expect(link?.getAttribute("href")).toBe("/logout");
  expect(link?.getAttribute("data-method")).toBe("post");
  expect(link?.classList).toContain("inline-flex");
});

test("it should ignore linkAs when as is button", () => {
  const { container } = render(Button, {
    props: {
      as: "button",
      href: "/settings",
      linkAs: TestLink,
      children: textSnippet("Settings"),
    },
  });

  expect(container.querySelector("a")).toBeNull();
  expect(container.querySelector("button")).not.toBeNull();
});

test("it should keep a native anchor when linkAs is set and the button is disabled", () => {
  const { container } = render(Button, {
    props: {
      disabled: true,
      href: "/settings",
      linkAs: TestLink,
      children: textSnippet("Settings"),
    },
  });

  expect(container.querySelector("a")?.hasAttribute("href")).toBe(false);
  expect(container.querySelector("a")?.hasAttribute("data-method")).toBe(false);
});

test("it should render the mini icon or children", () => {
  const icon = render(Button, {
    props: { density: "mini", icon: CircleAlert },
  });

  expect(icon.container.querySelector("svg")).not.toBeNull();

  const label = render(Button, {
    props: { density: "mini", children: textSnippet("AB") },
  });

  expect(label.container.textContent).toContain("AB");
  expect(label.container.querySelectorAll("svg").length).toBe(0);
});

test("it should update when props change", async () => {
  const { container, rerender } = render(Button, {
    props: { text: "Save", disabled: false },
  });

  await rerender({ text: "Saved", disabled: true });

  expect(container.textContent).toContain("Saved");
  expect(container.querySelector("button")?.hasAttribute("disabled")).toBe(
    true,
  );
});
