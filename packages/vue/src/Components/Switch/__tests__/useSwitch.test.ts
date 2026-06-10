// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test } from "vitest";
import { defineComponent, h, ref } from "vue";

// ** Local Imports
import { useSwitch, type SwitchOwnProps } from "@/Components/Switch";

const libDefaults = {
  size: "md",
  rounded: "full",
  color: "primary",
} satisfies Partial<SwitchOwnProps>;

function mountUseSwitch(props: SwitchOwnProps = {}, checked = false) {
  let result!: ReturnType<typeof useSwitch>;

  const checkedRef = ref(checked);

  const Wrapper = defineComponent({
    inheritAttrs: false,
    setup() {
      result = useSwitch(() => props, libDefaults, checkedRef);

      return () => h("div");
    },
  });

  mount(Wrapper);

  return { ...result, checkedRef };
}

test("it should set switch role on inputBind", () => {
  const { inputBind } = mountUseSwitch();

  expect(inputBind.value.role).toBe("switch");
});

test("it should apply checked track classes when model is true", () => {
  const { trackBind } = mountUseSwitch({}, true);

  expect(trackBind.value.class).toMatch(/bg-/);
});
