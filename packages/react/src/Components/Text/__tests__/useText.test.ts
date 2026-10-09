// ** External Imports
import { renderHook } from "@testing-library/react";
import { expect, test } from "vitest";

// ** Local Imports
import { useText, type TextOwnProps, type TextProps } from "@/Components/Text";

const libDefaults = {
  as: "p",
  size: "md",
  color: "dark",
  weight: "normal",
  variant: "default",
} as const satisfies Partial<TextOwnProps>;

function renderUseText(props: TextProps = {}) {
  return renderHook(() =>
    useText(props, libDefaults as Parameters<typeof useText>[1]),
  );
}

test("it should merge lib defaults", () => {
  const { result } = renderUseText();

  expect(result.current.merged.as).toBe("p");
  expect(result.current.merged.size).toBe("md");
  expect(result.current.merged.color).toBe("dark");
  expect(result.current.merged.weight).toBe("normal");
  expect(result.current.merged.variant).toBe("default");
});

test("it should override props when passed", () => {
  const { result } = renderUseText({ color: "success", variant: "muted" });

  expect(result.current.merged.color).toBe("success");
  expect(result.current.merged.variant).toBe("muted");
});

test("it should pick the color from the variant table", () => {
  const { result } = renderUseText({ color: "success" });

  expect(result.current.rootBind.className).toContain("text-success-600");
});

test("it should add numeric classes when numeric is true", () => {
  const { result } = renderUseText({ numeric: true });

  expect(result.current.rootBind.className).toContain("tabular-nums");
});

test("it should expose children", () => {
  const { result } = renderUseText({ children: "Hello" });

  expect(result.current.children).toBe("Hello");
});

test("it should apply className after classes.root in rootBind", () => {
  const { result } = renderUseText({
    className: "text-lg",
    classes: { root: "text-sm" },
  });

  expect(result.current.rootBind.className).toContain("text-lg");
  expect(result.current.rootBind.className).not.toContain("text-sm");
});
