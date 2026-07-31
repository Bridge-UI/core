// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test } from "vitest";
import { defineComponent, h } from "vue";

// ** Local Imports
import { useTab } from "@/Components/Tab/composables/useTab";
import { Tabs } from "@/Components/Tabs";

function mountUseTab(value: string) {
  let result!: ReturnType<typeof useTab>;

  const Probe = defineComponent({
    setup() {
      result = useTab({ value });

      return () => h("div");
    },
  });

  mount(Tabs, {
    props: { modelValue: "a" },
    slots: { default: () => h(Probe) },
  });

  return result;
}

test("it should mark the selected tab", () => {
  const result = mountUseTab("a");

  expect(result.rootBind.value.role).toBe("tab");
  expect(result.rootBind.value["aria-selected"]).toBe(true);
});

test("it should throw when used outside a Tabs provider", () => {
  const Standalone = defineComponent({
    setup() {
      useTab({ value: "a" });

      return () => h("div");
    },
  });

  expect(() =>
    mount(Standalone, {
      global: { config: { warnHandler: () => undefined } },
    }),
  ).toThrow("Tab must be used within a Tabs provider");
});
