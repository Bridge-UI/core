// ** External Imports
import { renderHook } from "@testing-library/react";
import { expect, test } from "vitest";

// ** Local Imports
import {
  useHeading,
  type HeadingOwnProps,
  type HeadingProps,
} from "@/Components/Heading";

const libDefaults = {
  level: 2,
  color: "dark",
  weight: "semibold",
  variant: "default",
} as const satisfies Partial<HeadingOwnProps>;

function renderUseHeading(props: HeadingProps = {}) {
  return renderHook(() =>
    useHeading(props, libDefaults as Parameters<typeof useHeading>[1]),
  );
}

test("it should merge lib defaults", () => {
  const { result } = renderUseHeading();

  expect(result.current.merged.level).toBe(2);
  expect(result.current.merged.color).toBe("dark");
  expect(result.current.merged.weight).toBe("semibold");
  expect(result.current.merged.variant).toBe("default");
});

test("it should derive the root tag from level", () => {
  const { result } = renderUseHeading({ level: 4 });

  expect(result.current.rootTag).toBe("h4");
});

test("it should use the level size when size is unset", () => {
  const { result } = renderUseHeading({ level: 3 });

  expect(result.current.rootBind.className).toContain("text-xl");
});

test("it should use the size token when size is set", () => {
  const { result } = renderUseHeading({ level: 3, size: "sm" });

  expect(result.current.rootBind.className).toContain("text-sm");
  expect(result.current.rootBind.className).not.toContain("text-xl");
});

test("it should expose children", () => {
  const { result } = renderUseHeading({ children: "Title" });

  expect(result.current.children).toBe("Title");
});
