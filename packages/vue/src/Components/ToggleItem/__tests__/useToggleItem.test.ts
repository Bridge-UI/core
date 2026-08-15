// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test } from "vitest";
import { defineComponent, h } from "vue";

// ** Local Imports
import { ToggleGroup } from "@/Components/ToggleGroup";
import { useToggleItem } from "@/Components/ToggleItem/composables/useToggleItem";

function mountUseToggleItem(
  value: string,
  groupProps: Record<string, unknown> = { modelValue: "a" },
) {
  let result!: ReturnType<typeof useToggleItem>;

  const Probe = defineComponent({
    setup() {
      result = useToggleItem({ value });

      return () => h("div");
    },
  });

  mount(ToggleGroup, {
    slots: { default: () => h(Probe) },
    props: { "aria-label": "Options", ...groupProps },
  });

  return result;
}

test("it should mark the selected toggle item", () => {
  const result = mountUseToggleItem("a");

  expect(result.rootBind.value.role).toBe("radio");
  expect(result.rootBind.value["aria-checked"]).toBe(true);
});

test("it should use pressed buttons when multiple is set", () => {
  const result = mountUseToggleItem("a", {
    multiple: true,
    modelValue: ["a"],
  });

  expect(result.rootBind.value.role).toBe("button");
  expect(result.rootBind.value["aria-pressed"]).toBe(true);
});

test("it should throw when used outside a ToggleGroup provider", () => {
  const Standalone = defineComponent({
    setup() {
      useToggleItem({ value: "a" });

      return () => h("div");
    },
  });

  expect(() =>
    mount(Standalone, {
      global: { config: { warnHandler: () => undefined } },
    }),
  ).toThrow("ToggleItem must be used within a ToggleGroup provider");
});
