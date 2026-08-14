// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test } from "vitest";
import { defineComponent, h } from "vue";

// ** Local Imports
import { useToggle } from "@/Components/Toggle/composables/useToggle";
import { ToggleGroup } from "@/Components/ToggleGroup";

function mountUseToggle(value: string) {
  let result!: ReturnType<typeof useToggle>;

  const Probe = defineComponent({
    setup() {
      result = useToggle({ value });

      return () => h("div");
    },
  });

  mount(ToggleGroup, {
    slots: { default: () => h(Probe) },
    props: { modelValue: "a", "aria-label": "Options" },
  });

  return result;
}

test("it should mark the selected toggle", () => {
  const result = mountUseToggle("a");

  expect(result.rootBind.value.role).toBe("radio");
  expect(result.rootBind.value["aria-checked"]).toBe(true);
});

test("it should throw when used outside a ToggleGroup provider", () => {
  const Standalone = defineComponent({
    setup() {
      useToggle({ value: "a" });

      return () => h("div");
    },
  });

  expect(() =>
    mount(Standalone, {
      global: { config: { warnHandler: () => undefined } },
    }),
  ).toThrow("Toggle must be used within a ToggleGroup provider");
});
