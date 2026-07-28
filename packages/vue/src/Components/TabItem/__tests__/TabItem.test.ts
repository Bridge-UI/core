// ** External Imports
import { flushPromises, mount } from "@vue/test-utils";
import { expect, test } from "vitest";
import { defineComponent, nextTick, ref } from "vue";

// ** Local Imports
import { TabItem } from "@/Components/TabItem";
import { Tabs } from "@/Components/Tabs";

test("it should build tablist and panels from TabItem children", async () => {
  const wrapper = mount(
    defineComponent({
      components: { Tabs, TabItem },
      setup() {
        const value = ref("bun");

        return { value };
      },
      template: `
        <Tabs v-model="value">
          <TabItem label="bun" value="bun">bun install</TabItem>
          <TabItem label="npm" value="npm">npm install</TabItem>
        </Tabs>
      `,
    }),
  );

  await flushPromises();
  await nextTick();

  expect(wrapper.find('[role="tablist"]').exists()).toBe(true);
  expect(wrapper.find('[role="tab"][aria-selected="true"]').text()).toContain(
    "bun",
  );
  expect(wrapper.text()).toContain("bun install");
});

test("it should change panel when a TabItem tab is clicked", async () => {
  const wrapper = mount(
    defineComponent({
      components: { Tabs, TabItem },
      setup() {
        const value = ref("bun");

        return { value };
      },
      template: `
        <Tabs v-model="value">
          <TabItem label="bun" value="bun">bun install</TabItem>
          <TabItem label="npm" value="npm">npm install</TabItem>
        </Tabs>
      `,
    }),
  );

  await flushPromises();
  await nextTick();

  const tabs = wrapper.findAll('[role="tab"]');
  await tabs[1]?.trigger("click");
  await nextTick();

  expect(wrapper.text()).toContain("npm install");
});
