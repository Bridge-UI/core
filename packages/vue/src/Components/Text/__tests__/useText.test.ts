// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test } from "vitest";
import { defineComponent, h } from "vue";

// ** Local Imports
import { useText, type TextOwnProps } from "@/Components/Text";

const libDefaults = {
  as: "p",
  size: "md",
  color: "dark",
  weight: "normal",
  variant: "default",
} satisfies Partial<TextOwnProps>;

function mountUseText(props: Partial<TextOwnProps> = {}) {
  let result!: ReturnType<typeof useText>;

  const Wrapper = defineComponent({
    setup() {
      result = useText(props, libDefaults);

      return () => h("div");
    },
  });

  mount(Wrapper);

  return result;
}

test("it should merge lib defaults", () => {
  const { merged } = mountUseText();

  expect(merged.value.as).toBe("p");
  expect(merged.value.size).toBe("md");
  expect(merged.value.color).toBe("dark");
  expect(merged.value.weight).toBe("normal");
  expect(merged.value.variant).toBe("default");
});

test("it should override props when passed", () => {
  const { merged } = mountUseText({ color: "success", variant: "muted" });

  expect(merged.value.color).toBe("success");
  expect(merged.value.variant).toBe("muted");
});

test("it should pick the color from the variant table", () => {
  const { rootBind } = mountUseText({ color: "success" });

  expect(rootBind.value.class).toContain("text-success-600");
});

test("it should add numeric classes when numeric is true", () => {
  const { rootBind } = mountUseText({ numeric: true });

  expect(rootBind.value.class).toContain("tabular-nums");
});
