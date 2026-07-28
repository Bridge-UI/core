// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test } from "vitest";
import { h } from "vue";

// ** Local Imports
import { Tab } from "@/Components/Tab";
import { TabList } from "@/Components/TabList";
import { TabPanel } from "@/Components/TabPanel";
import { Tabs } from "@/Components/Tabs";

test("it should render a tabpanel linked to its tab", () => {
  const wrapper = mount(Tabs, {
    props: { modelValue: "a" },
    slots: {
      default: () => [
        h(TabList, null, {
          default: () => h(Tab, { value: "a" }, { default: () => "Alpha" }),
        }),
        h(TabPanel, { value: "a" }, { default: () => "Content" }),
      ],
    },
  });

  const panel = wrapper.find('[role="tabpanel"]');

  expect(panel.text()).toContain("Content");
  expect(panel.attributes("aria-labelledby")).toBeDefined();
});
