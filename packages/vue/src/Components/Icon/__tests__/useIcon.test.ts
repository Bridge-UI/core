// ** External Imports
import { mount } from "@vue/test-utils";
import { Info } from "lucide-vue-next";
import { expect, test } from "vitest";
import { defineComponent, h } from "vue";

// ** Local Imports
import { useIcon, type IconProps } from "@/Components/Icon";

const libDefaults: Partial<IconProps> = {
  size: "md",
};

function mountUseIcon(props: IconProps) {
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
  const { merged } = mountUseIcon({ icon: Info, class: "text-primary-500" });

  expect(merged.value.class).toBe("text-primary-500");
});

test("it should compute mergedClass with size and class", () => {
  const { mergedClass } = mountUseIcon({
    icon: Info,
    size: "sm",
    class: "text-red-500",
  });

  expect(mergedClass.value).toContain("w-3.5");
  expect(mergedClass.value).toContain("text-red-500");
});
