// ** External Imports
import { ChevronRight, User } from "@lucide/vue";
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

  expect(tab.attributes("tabindex")).toBe("0");
  expect(tab.attributes("aria-selected")).toBe("true");
});

test("it should render a leading icon when startIcon is set", () => {
  const wrapper = mount(Tabs, {
    props: { modelValue: "a" },
    slots: {
      default: () =>
        h(TabList, null, {
          default: () =>
            h(Tab, { value: "a", startIcon: User }, { default: () => "Alpha" }),
        }),
    },
  });

  expect(wrapper.find("svg").exists()).toBe(true);
  expect(wrapper.find('[role="tab"]').classes().join(" ")).toContain("gap-");
});

test("it should render start and end slots when icon props are omitted", () => {
  const wrapper = mount(Tabs, {
    props: { modelValue: "a" },
    slots: {
      default: () =>
        h(TabList, null, {
          default: () =>
            h(
              Tab,
              { value: "a" },
              {
                default: () => "Alpha",
                end: () => h("span", { "data-testid": "end-slot" }, "end"),
                start: () =>
                  h("span", { "data-testid": "start-slot" }, "start"),
              },
            ),
        }),
    },
  });

  expect(wrapper.find('[data-testid="end-slot"]').exists()).toBe(true);
  expect(wrapper.find('[data-testid="start-slot"]').exists()).toBe(true);
});

test("it should prefer endIcon over the end slot", () => {
  const wrapper = mount(Tabs, {
    props: { modelValue: "a" },
    slots: {
      default: () =>
        h(TabList, null, {
          default: () =>
            h(
              Tab,
              { value: "a", endIcon: ChevronRight },
              {
                default: () => "Alpha",
                end: () => h("span", { "data-testid": "end-slot" }, "end"),
              },
            ),
        }),
    },
  });

  expect(wrapper.find("svg").exists()).toBe(true);
  expect(wrapper.find('[data-testid="end-slot"]').exists()).toBe(false);
});
