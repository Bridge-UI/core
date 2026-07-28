// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test } from "vitest";
import { h } from "vue";

// ** Local Imports
import { Tab } from "@/Components/Tab";
import { TabList } from "@/Components/TabList";
import { Tabs } from "@/Components/Tabs";

test("it should render a tab button with aria attributes", () => {
  const wrapper = mount(Tabs, {
    props: { modelValue: "a" },
    slots: {
      default: () =>
        h(TabList, null, {
          default: () => h(Tab, { value: "a" }, { default: () => "Alpha" }),
        }),
    },
  });

  const tab = wrapper.find('[role="tab"]');

  expect(tab.attributes("aria-selected")).toBe("true");
  expect(tab.attributes("tabindex")).toBe("0");
});
