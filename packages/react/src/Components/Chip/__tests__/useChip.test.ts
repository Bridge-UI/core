// ** External Imports
import { renderHook } from "@testing-library/react";
import { expect, test } from "vitest";

// ** Local Imports
import { useChip, type ChipOwnProps } from "@/Components/Chip";

const libDefaults = {
  size: "md",
} as const satisfies Partial<ChipOwnProps>;

function renderUseChip(props: Partial<ChipOwnProps> = {}) {
  return renderHook(() => useChip({ ...props }, libDefaults));
}

test("it should return default size as md", () => {
  const { result } = renderUseChip();

  expect(result.current.merged.size).toBe("md");
  expect(result.current.rootBind.className).toContain("px-1.5");
});

test("it should apply size classes when size is overridden", () => {
  const { result } = renderUseChip({ size: "xs" });

  expect(result.current.merged.size).toBe("xs");
  expect(result.current.labelBind.className).toContain("text-xs");
  expect(result.current.clearIconSize).toBe("xs");
});

test("it should merge registry classes", () => {
  const { result } = renderUseChip({
    classes: { root: "custom-chip" },
  });

  expect(result.current.mergedClasses.root).toBe("custom-chip");
  expect(result.current.rootBind.className).toContain("custom-chip");
});
