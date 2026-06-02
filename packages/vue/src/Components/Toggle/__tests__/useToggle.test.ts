// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test } from "vitest";
import { defineComponent, h, ref } from "vue";

// ** Local Imports
import { useToggle, type ToggleOwnProps } from "@/Components/Toggle";

const libDefaults = {
  size: "md",
  rounded: "full",
  color: "primary",
} satisfies Partial<ToggleOwnProps>;

function mountUseToggle(props: ToggleOwnProps = {}, checked = false) {
  let result!: ReturnType<typeof useToggle>;

  const checkedRef = ref(checked);

  const Wrapper = defineComponent({
    inheritAttrs: false,
    setup() {
      result = useToggle(() => props, libDefaults, checkedRef);

      return () => h("div");
    },
  });

  mount(Wrapper);

  return { ...result, checkedRef };
}

test("it should set switch role on inputBind", () => {
  const { inputBind } = mountUseToggle();

  expect(inputBind.value.role).toBe("switch");
});

test("it should apply checked track classes when model is true", () => {
  const { trackBind } = mountUseToggle({}, true);

  expect(trackBind.value.class).toMatch(/bg-/);
});
