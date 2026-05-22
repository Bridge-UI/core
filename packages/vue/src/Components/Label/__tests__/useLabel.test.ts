// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test } from "vitest";
import { defineComponent, h } from "vue";

// ** Local Imports
import { useLabel, type LabelOwnProps } from "@/Components/Label";

const libDefaults = {
  size: "md",
} satisfies Partial<LabelOwnProps>;

function mountUseLabel(props: Partial<LabelOwnProps> = {}) {
  let result!: ReturnType<typeof useLabel>;

  const Wrapper = defineComponent({
    setup() {
      result = useLabel(props, libDefaults);

      return () => h("div");
    },
  });

  mount(Wrapper);

  return result;
}

test("it should default size to md", () => {
  const { merged } = mountUseLabel();

  expect(merged.value.size).toBe("md");
});

test("it should override size when prop is passed", () => {
  const { merged } = mountUseLabel({ size: "lg" });

  expect(merged.value.size).toBe("lg");
});

test("it should apply error color on root bind", () => {
  const { rootBind } = mountUseLabel({ error: true });

  expect(rootBind.value.class).toContain("text-error-600");
});

test("it should expose for on root bind via inherited attrs", () => {
  const { rootBind } = mountUseLabel({ for: "field-id" });

  expect(rootBind.value.for).toBe("field-id");
});

test("it should merge class into root bind", () => {
  const { rootBind } = mountUseLabel({ class: "custom-label" });

  expect(rootBind.value.class).toContain("custom-label");
});

test("it should apply class after classes.root in root bind", () => {
  const { rootBind } = mountUseLabel({
    class: "p-4",
    classes: { root: "p-2" },
  });

  expect(rootBind.value.class).toContain("p-4");
  expect(rootBind.value.class).not.toContain("p-2");
});
