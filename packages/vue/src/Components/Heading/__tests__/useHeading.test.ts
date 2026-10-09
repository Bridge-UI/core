// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test } from "vitest";
import { defineComponent, h } from "vue";

// ** Local Imports
import { useHeading, type HeadingOwnProps } from "@/Components/Heading";

const libDefaults = {
  level: 2,
  color: "dark",
  weight: "semibold",
  variant: "default",
} satisfies Partial<HeadingOwnProps>;

function mountUseHeading(props: Partial<HeadingOwnProps> = {}) {
  let result!: ReturnType<typeof useHeading>;

  const Wrapper = defineComponent({
    setup() {
      result = useHeading(props, libDefaults);

      return () => h("div");
    },
  });

  mount(Wrapper);

  return result;
}

test("it should merge lib defaults", () => {
  const { merged } = mountUseHeading();

  expect(merged.value.level).toBe(2);
  expect(merged.value.color).toBe("dark");
  expect(merged.value.weight).toBe("semibold");
  expect(merged.value.variant).toBe("default");
});

test("it should derive the root tag from level", () => {
  const { rootTag } = mountUseHeading({ level: 4 });

  expect(rootTag.value).toBe("h4");
});

test("it should use the level size when size is unset", () => {
  const { rootBind } = mountUseHeading({ level: 3 });

  expect(rootBind.value.class).toContain("text-xl");
});

test("it should use the size token when size is set", () => {
  const { rootBind } = mountUseHeading({ level: 3, size: "sm" });

  expect(rootBind.value.class).toContain("text-sm");
  expect(rootBind.value.class).not.toContain("text-xl");
});
