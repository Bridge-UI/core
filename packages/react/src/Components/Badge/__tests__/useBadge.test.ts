// ** External Imports
import { renderHook } from "@testing-library/react";
import { expect, test } from "vitest";

// ** Local Imports
import {
  useBadge,
  type BadgeOwnProps,
  type BadgeProps,
} from "@/Components/Badge";

const libDefaults: Partial<BadgeOwnProps> = {
  size: "sm",
  rounded: "md",
  variant: "flat",
  color: "primary",
};

function renderUseBadge(props: BadgeProps = {}) {
  return renderHook(() => useBadge(props, libDefaults));
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

test("it should compute rootClass as a non-empty string", () => {
  const { result } = renderUseBadge();

  expect(typeof result.current.rootClass).toBe("string");
  expect(result.current.rootClass.length).toBeGreaterThan(0);
});

test("it should merge className into rootClass", () => {
  const { result } = renderUseBadge({ className: "custom-badge" });

  expect(result.current.rootClass).toContain("custom-badge");
});

test("it should expose children from props", () => {
  const { result } = renderUseBadge({ children: "New" });

  expect(result.current.children).toBe("New");
});

test("it should expose rootHtmlProps for additional attributes", () => {
  const { result } = renderUseBadge({
    id: "badge-root",
    "data-testid": "badge",
  });

  expect(result.current.rootHtmlProps.id).toBe("badge-root");
  expect(result.current.rootHtmlProps["data-testid"]).toBe("badge");
});

test("it should apply className after classes.root in rootClass", () => {
  const { result } = renderUseBadge({
    className: "p-4",
    classes: { root: "p-2" },
  });

  expect(result.current.rootClass).toContain("p-4");
  expect(result.current.rootClass).not.toContain("p-2");
});

test("it should apply mini size classes when density is mini", () => {
  const { result } = renderUseBadge({ density: "mini" });

  expect(result.current.rootClass).toContain("min-w-6");
});
