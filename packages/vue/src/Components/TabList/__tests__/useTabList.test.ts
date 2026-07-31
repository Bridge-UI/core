// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test } from "vitest";
import { defineComponent, h } from "vue";

// ** Local Imports
import { useTabList } from "@/Components/TabList/composables/useTabList";
import { Tabs } from "@/Components/Tabs";

function mountUseTabList() {
  let result!: ReturnType<typeof useTabList>;

  const Probe = defineComponent({
    setup() {
      result = useTabList({});

      return () => h("div");
    },
  });

  mount(Tabs, {
    props: { modelValue: "a" },
    slots: { default: () => h(Probe) },
  });

  return result;
}

test("it should build a tablist bind inside Tabs", () => {
  const result = mountUseTabList();

  expect(result.rootBind.value.role).toBe("tablist");
});

test("it should throw when used outside a Tabs provider", () => {
  const Standalone = defineComponent({
    setup() {
      useTabList({});

      return () => h("div");
    },
  });

  expect(() =>
    mount(Standalone, {
      global: { config: { warnHandler: () => undefined } },
    }),
  ).toThrow("TabList must be used within a Tabs provider");
});
