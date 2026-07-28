// ** External Imports
import { flushPromises, mount } from "@vue/test-utils";
import { afterEach, expect, test } from "vitest";
import { h } from "vue";

// ** Local Imports
import { Tab } from "@/Components/Tab";
import { TabList } from "@/Components/TabList";
import { TabPanel } from "@/Components/TabPanel";
import { Tabs } from "@/Components/Tabs";

afterEach(async () => {
  while (mountedWrappers.length > 0) {
    mountedWrappers.pop()?.unmount();
  }

  await flushPromises();
});

const mountedWrappers: Array<ReturnType<typeof mount<typeof Tabs>>> = [];

function basicTabsSlots() {
  return [
    h(TabList, null, {
      default: () => [
        h(Tab, { value: "a" }, { default: () => "Alpha" }),
        h(Tab, { value: "b" }, { default: () => "Beta" }),
        h(Tab, { value: "c", disabled: true }, { default: () => "Gamma" }),
      ],
    }),
    h(TabPanel, { value: "a" }, { default: () => "Panel A" }),
    h(TabPanel, { value: "b" }, { default: () => "Panel B" }),
    h(TabPanel, { value: "c" }, { default: () => "Panel C" }),
  ];
}

function mountTabs(options: Parameters<typeof mount<typeof Tabs>>[1] = {}) {
  const wrapper = mount(Tabs, {
    ...options,
    props: {
      ...(options.props ?? {}),
      "onUpdate:modelValue": (value: string) => {
        wrapper.setProps({ modelValue: value });
      },
    },
  });

  mountedWrappers.push(wrapper);

  return wrapper;
}

test("it should render tablist tabs and the selected panel", () => {
  const wrapper = mountTabs({
    props: { modelValue: "a" },
    slots: { default: basicTabsSlots },
  });

  expect(wrapper.find('[role="tablist"]').exists()).toBe(true);

  const alpha = wrapper
    .findAll('[role="tab"]')
    .find((tab) => tab.text() === "Alpha");
  const panelA = wrapper
    .findAll('[role="tabpanel"]')
    .find((panel) => panel.text() === "Panel A");
  const panelB = wrapper
    .findAll('[role="tabpanel"]')
    .find((panel) => panel.text() === "Panel B");

  expect(alpha?.attributes("aria-selected")).toBe("true");
  expect(panelA?.attributes("hidden")).toBeUndefined();
  expect(panelB?.attributes("hidden")).toBeDefined();
});

test("it should change selection when a tab is clicked", async () => {
  const wrapper = mountTabs({
    props: { modelValue: "a" },
    slots: { default: basicTabsSlots },
  });

  const beta = wrapper
    .findAll('[role="tab"]')
    .find((tab) => tab.text() === "Beta");

  await beta?.trigger("click");

  expect(wrapper.emitted("change")).toEqual([["b"]]);

  const selected = wrapper
    .findAll('[role="tab"]')
    .find((tab) => tab.text() === "Beta");

  expect(selected?.attributes("aria-selected")).toBe("true");
});

test("it should not select a disabled tab", async () => {
  const wrapper = mountTabs({
    props: { modelValue: "a" },
    slots: { default: basicTabsSlots },
  });

  const gamma = wrapper
    .findAll('[role="tab"]')
    .find((tab) => tab.text() === "Gamma");

  await gamma?.trigger("click");

  expect(wrapper.emitted("change")).toBeUndefined();

  const alpha = wrapper
    .findAll('[role="tab"]')
    .find((tab) => tab.text() === "Alpha");

  expect(alpha?.attributes("aria-selected")).toBe("true");
});

test("it should move selection with arrow keys when activation is automatic", async () => {
  const wrapper = mountTabs({
    props: { modelValue: "a" },
    slots: { default: basicTabsSlots },
  });

  await wrapper.find('[role="tablist"]').trigger("keydown", {
    key: "ArrowRight",
  });

  expect(wrapper.emitted("change")).toEqual([["b"]]);
});

test("it should let a TabPanel override the inherited keepMounted", () => {
  const wrapper = mountTabs({
    props: { modelValue: "a" },
    slots: {
      default: () => [
        h(TabList, null, {
          default: () => [
            h(Tab, { value: "a" }, { default: () => "Alpha" }),
            h(Tab, { value: "b" }, { default: () => "Beta" }),
          ],
        }),
        h(TabPanel, { value: "a" }, { default: () => "Panel A" }),
        h(
          TabPanel,
          { value: "b", keepMounted: false },
          {
            default: () => "Panel B",
          },
        ),
      ],
    },
  });

  expect(wrapper.text()).toContain("Panel A");
  expect(wrapper.text()).not.toContain("Panel B");
});

test("it should unmount inactive panels when keepMounted is false", () => {
  const wrapper = mountTabs({
    props: { modelValue: "a", keepMounted: false },
    slots: {
      default: () => [
        h(TabList, null, {
          default: () => [
            h(Tab, { value: "a" }, { default: () => "Alpha" }),
            h(Tab, { value: "b" }, { default: () => "Beta" }),
          ],
        }),
        h(TabPanel, { value: "a" }, { default: () => "Panel A" }),
        h(TabPanel, { value: "b" }, { default: () => "Panel B" }),
      ],
    },
  });

  expect(wrapper.text()).toContain("Panel A");
  expect(wrapper.text()).not.toContain("Panel B");
});

test("it should apply line underline classes with after content", () => {
  const wrapper = mountTabs({
    props: { modelValue: "a", variant: "line" },
    slots: {
      default: () => [
        h(TabList, null, {
          default: () => h(Tab, { value: "a" }, { default: () => "Alpha" }),
        }),
        h(TabPanel, { value: "a" }, { default: () => "Panel A" }),
      ],
    },
  });

  const tab = wrapper.find('[role="tab"]');

  expect(tab.classes().join(" ")).toContain("after:content-['']");
  expect(tab.classes().join(" ")).toContain("after:bg-current");
});

test("it should apply soft fill color classes for pill variant", () => {
  const wrapper = mountTabs({
    props: { color: "dark", modelValue: "a", variant: "pill" },
    slots: {
      default: () => [
        h(TabList, null, {
          default: () => h(Tab, { value: "a" }, { default: () => "Alpha" }),
        }),
        h(TabPanel, { value: "a" }, { default: () => "Panel A" }),
      ],
    },
  });

  expect(wrapper.find('[role="tab"]').classes().join(" ")).toContain(
    "bg-dark-",
  );
});

test("it should lay out vertical tabs beside panels", () => {
  const wrapper = mountTabs({
    props: { modelValue: "a", orientation: "vertical" },
    slots: {
      default: () => [
        h(TabList, null, {
          default: () => h(Tab, { value: "a" }, { default: () => "Alpha" }),
        }),
        h(TabPanel, { value: "a" }, { default: () => "Panel A" }),
      ],
    },
  });

  expect(wrapper.classes().join(" ")).toContain("flex-row");
  expect(wrapper.find('[role="tablist"]').classes().join(" ")).toContain(
    "flex-col",
  );
  expect(wrapper.find('[role="tab"]').classes().join(" ")).toContain(
    "after:w-0.5",
  );
});
