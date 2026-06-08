// ** External Imports
import { renderHook } from "@testing-library/react";
import { expect, test } from "vitest";

// ** Local Imports
import {
  useBadge,
  type BadgeOwnProps,
  type BadgeProps,
} from "@/Components/Badge";

const libDefaults = {
  size: "sm",
  rounded: "md",
  variant: "flat",
  color: "primary",
  density: "default",
} as const satisfies Partial<BadgeOwnProps>;

function renderUseBadge(props: BadgeProps = {}) {
  return renderHook(() =>
    useBadge(props, libDefaults as Parameters<typeof useBadge>[1]),
  );
}

test("it should merge default color and variant", () => {
  const { result } = renderUseBadge();

  expect(result.current.merged.variant).toBe("flat");
  expect(result.current.merged.color).toBe("primary");
});

test("it should override color when prop is passed", () => {
  const { result } = renderUseBadge({ color: "error" });

  expect(result.current.merged.color).toBe("error");
});

test("it should compute rootBind className as a non-empty string", () => {
  const { result } = renderUseBadge();

  expect(typeof result.current.rootBind.className).toBe("string");
  expect(result.current.rootBind.className.length).toBeGreaterThan(0);
});

test("it should merge className into rootBind", () => {
  const { result } = renderUseBadge({ className: "custom-badge" });

  expect(result.current.rootBind.className).toContain("custom-badge");
});

test("it should expose children from props", () => {
  const { result } = renderUseBadge({ children: "New" });

  expect(result.current.children).toBe("New");
});

test("it should expose inherited attrs on rootBind", () => {
  const { result } = renderUseBadge({
    id: "badge-root",
    "data-testid": "badge",
  });

  expect(result.current.rootBind.id).toBe("badge-root");
  expect(result.current.rootBind["data-testid"]).toBe("badge");
});

test("it should apply className after classes.root in rootBind", () => {
  const { result } = renderUseBadge({
    className: "p-4",
    classes: { root: "p-2" },
  });

  expect(result.current.rootBind.className).toContain("p-4");
  expect(result.current.rootBind.className).not.toContain("p-2");
});

test("it should shrink-wrap width in flex layouts", () => {
  const { result } = renderUseBadge();

  expect(result.current.rootBind.className).toContain("w-fit");
});

test("it should apply w-full when full is true", () => {
  const { result } = renderUseBadge({ full: true });

  expect(result.current.rootBind.className).toContain("w-full");
  expect(result.current.rootBind.className).not.toContain("w-fit");
});

test("it should not apply w-full on mini density even when full is true", () => {
  const { result } = renderUseBadge({ full: true, density: "mini" });

  expect(result.current.rootBind.className).not.toContain("w-fit");
  expect(result.current.rootBind.className).not.toContain("w-full");
});

test("it should apply mini size classes when density is mini", () => {
  const { result } = renderUseBadge({ density: "mini" });

  expect(result.current.rootBind.className).toContain("w-6");
  expect(result.current.rootBind.className).toContain("h-6");
});
