// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test } from "vitest";
import { h } from "vue";

// ** Local Imports
import { Tab } from "@/Components/Tab";
import { TabList } from "@/Components/TabList";
import { Tabs } from "@/Components/Tabs";

test("it should render a tablist container", () => {
  const wrapper = mount(Tabs, {
    props: { modelValue: "a" },
    slots: {
      default: () =>
        h(
          TabList,
          { "aria-label": "Demo" },
          {
            default: () => h(Tab, { value: "a" }, { default: () => "A" }),
          },
        ),
    },
  });

  expect(wrapper.find('[role="tablist"]').attributes("aria-label")).toBe(
    "Demo",
  );
});
