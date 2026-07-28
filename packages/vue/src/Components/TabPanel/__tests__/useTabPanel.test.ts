// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test } from "vitest";
import { defineComponent, h } from "vue";

// ** Local Imports
import { useTabPanel } from "@/Components/TabPanel/composables/useTabPanel";
import { Tabs } from "@/Components/Tabs";

function mountUseTabPanel(value: string) {
  let result!: ReturnType<typeof useTabPanel>;

  const Probe = defineComponent({
    setup() {
      result = useTabPanel({ value });

      return () => h("div");
    },
  });

  mount(Tabs, {
    props: { modelValue: "a" },
    slots: { default: () => h(Probe) },
  });

  return result;
}

test("it should expose selected state for the matching value", () => {
  const result = mountUseTabPanel("a");

  expect(result.selected.value).toBe(true);
  expect(result.rootBind.value.role).toBe("tabpanel");
});

test("it should throw when used outside a Tabs provider", () => {
  const Standalone = defineComponent({
    setup() {
      useTabPanel({ value: "a" });

      return () => h("div");
    },
  });

  expect(() => mount(Standalone)).toThrow(
    "TabPanel must be used within a Tabs provider",
  );
});
