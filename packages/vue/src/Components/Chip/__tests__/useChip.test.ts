// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test } from "vitest";
import { defineComponent, h } from "vue";

// ** Local Imports
import { useChip, type ChipOwnProps } from "@/Components/Chip";

const libDefaults = {
  size: "md",
} as const satisfies Partial<ChipOwnProps>;

function mountUseChip(props: Partial<ChipOwnProps> = {}) {
  let result!: ReturnType<typeof useChip>;

  const Wrapper = defineComponent({
    setup() {
      result = useChip({ ...props }, libDefaults, () => undefined);

      return () => h("div");
    },
  });

  mount(Wrapper);

  return result;
}

test("it should return default size as md", () => {
  const { merged, rootBind } = mountUseChip();

  expect(merged.value.size).toBe("md");
  expect(rootBind.value.class).toContain("px-2");
});

test("it should apply size classes when size is overridden", () => {
  const { merged, labelBind, clearIconSize } = mountUseChip({ size: "xs" });

  expect(merged.value.size).toBe("xs");
  expect(labelBind.value.class).toContain("text-xs");
  expect(clearIconSize.value).toBe("xs");
});

test("it should merge registry classes", () => {
  const { rootBind, mergedClasses } = mountUseChip({
    classes: { root: "custom-chip" },
  });

  expect(mergedClasses.value.root).toBe("custom-chip");
  expect(rootBind.value.class).toContain("custom-chip");
});
