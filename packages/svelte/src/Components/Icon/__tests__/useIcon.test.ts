// ** External Imports
import { Info } from "@lucide/svelte";
import { expect, test } from "vitest";

// ** Local Imports
import { useIcon, type IconProps } from "@/Components/Icon";
import { renderHook } from "@/Utils/__tests__/renderHook";

function renderUseIcon(props: IconProps) {
  return renderHook(
    (hookProps: () => IconProps) => useIcon(hookProps, { size: "md" }),
    {
      props,
    },
  );
}

test("it should default size to md", () => {
  const { result } = renderUseIcon({ icon: Info });

  expect(result.merged.size).toBe("md");
});

test("it should override size when prop is passed", () => {
  const { result } = renderUseIcon({ icon: Info, size: "lg" });

  expect(result.merged.size).toBe("lg");
});

test("it should preserve icon prop in merged", () => {
  const { result } = renderUseIcon({ icon: Info });

  expect(result.merged.icon).toBe(Info);
});

test("it should compute root class with size and class", () => {
  const { result } = renderUseIcon({
    icon: Info,
    size: "sm",
    class: "text-red-500",
  });

  expect(result.rootBind.class).toContain("w-3.5");
  expect(result.rootBind.class).toContain("text-red-500");
});

test("it should react to prop changes", async () => {
  const { result, rerender } = renderUseIcon({ icon: Info, size: "sm" });

  await rerender({ size: "xl" });

  expect(result.rootBind.class).toContain("w-6");
});
