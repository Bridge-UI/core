// ** External Imports
import { renderHook } from "@testing-library/react";
import { expect, test } from "vitest";

// ** Local Imports
import {
  useMiniBadge,
  type MiniBadgeOwnProps,
  type MiniBadgeProps,
} from "@/Components/MiniBadge";

const libDefaults: Partial<MiniBadgeOwnProps> = {
  size: "xs",
  color: "primary",
  rounded: "full",
  variant: "flat",
};

function renderUseMiniBadge(props: MiniBadgeProps = {}) {
  return renderHook(() => useMiniBadge(props, libDefaults));
}

test("it should merge default size and variant", () => {
  const { result } = renderUseMiniBadge();

  expect(result.current.merged.size).toBe("xs");
  expect(result.current.merged.variant).toBe("flat");
});

test("it should override size when prop is passed", () => {
  const { result } = renderUseMiniBadge({ size: "sm" });

  expect(result.current.merged.size).toBe("sm");
});

test("it should compute rootClass as a non-empty string", () => {
  const { result } = renderUseMiniBadge();

  expect(result.current.rootClass.length).toBeGreaterThan(0);
});

test("it should merge className into rootClass", () => {
  const { result } = renderUseMiniBadge({ className: "custom-mini-badge" });

  expect(result.current.rootClass).toContain("custom-mini-badge");
});

test("it should expose rootHtmlProps for additional attributes", () => {
  const { result } = renderUseMiniBadge({
    id: "mini-badge-root",
    "data-testid": "mini-badge",
  });

  expect(result.current.rootHtmlProps.id).toBe("mini-badge-root");
  expect(result.current.rootHtmlProps["data-testid"]).toBe("mini-badge");
});

test("it should apply className after classes.root in rootClass", () => {
  const { result } = renderUseMiniBadge({
    className: "p-4",
    classes: { root: "p-2" },
  });

  expect(result.current.rootClass).toContain("p-4");
  expect(result.current.rootClass).not.toContain("p-2");
});
