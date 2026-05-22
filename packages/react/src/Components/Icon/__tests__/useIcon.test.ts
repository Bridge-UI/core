// ** External Imports
import { renderHook } from "@testing-library/react";
import { Info } from "lucide-react";
import { expect, test } from "vitest";

// ** Local Imports
import { useIcon, type IconOwnProps, type IconProps } from "@/Components/Icon";

const libDefaults = {
  size: "md",
} as const satisfies Partial<IconOwnProps>;

function renderUseIcon(props: IconProps) {
  return renderHook(() =>
    useIcon(props, libDefaults as Parameters<typeof useIcon>[1]),
  );
}

test("it should default size to md", () => {
  const { result } = renderUseIcon({ icon: Info });

  expect(result.current.merged.size).toBe("md");
});

test("it should override size when prop is passed", () => {
  const { result } = renderUseIcon({ icon: Info, size: "lg" });

  expect(result.current.merged.size).toBe("lg");
});

test("it should preserve icon prop in merged", () => {
  const { result } = renderUseIcon({ icon: Info });

  expect(result.current.merged.icon).toStrictEqual(Info);
});

test("it should merge custom className from props", () => {
  const { result } = renderUseIcon({
    icon: Info,
    className: "text-primary-500",
  });

  expect(result.current.rootBind.className).toContain("text-primary-500");
});

test("it should compute rootBind with size and className", () => {
  const { result } = renderUseIcon({
    icon: Info,
    size: "sm",
    className: "text-red-500",
  });

  expect(result.current.rootBind.className).toContain("w-3.5");
  expect(result.current.rootBind.className).toContain("text-red-500");
});
