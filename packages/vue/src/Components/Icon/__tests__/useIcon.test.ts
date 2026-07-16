// ** External Imports
import { Info } from "@lucide/vue";
import { mount } from "@vue/test-utils";
import { expect, test } from "vitest";
import { defineComponent, h } from "vue";

// ** Local Imports
import { useIcon, type IconOwnProps } from "@/Components/Icon";

const libDefaults = {
  size: "md",
} satisfies Partial<IconOwnProps>;

function mountUseIcon(props: Partial<IconOwnProps> = {}) {
  let result!: ReturnType<typeof useIcon>;

  const Wrapper = defineComponent({
    setup() {
      result = useIcon(props, libDefaults);

      return () => h("div");
    },
  });

  mount(Wrapper);

  return result;
}

test("it should default size to md", () => {
  const { merged } = mountUseIcon({ icon: Info });

  expect(merged.value.size).toBe("md");
});

test("it should override size when prop is passed", () => {
  const { merged } = mountUseIcon({ icon: Info, size: "lg" });

  expect(merged.value.size).toBe("lg");
});

test("it should preserve icon prop in merged", () => {
  const { merged } = mountUseIcon({ icon: Info });

  expect(merged.value.icon).toBe(Info);
});

test("it should merge custom class from props", () => {
  const { rootBind } = mountUseIcon({
    icon: Info,
    class: "text-primary-500",
  });

  expect(rootBind.value.class).toContain("text-primary-500");
});

test("it should compute root class with size and class", () => {
  const { rootBind } = mountUseIcon({
    icon: Info,
    size: "sm",
    class: "text-red-500",
  });

  expect(rootBind.value.class).toContain("w-3.5");
  expect(rootBind.value.class).toContain("text-red-500");
});
