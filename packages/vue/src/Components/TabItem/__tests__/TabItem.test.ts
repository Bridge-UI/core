// ** External Imports
import { User } from "@lucide/vue";
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

test("it should render TabItem startIcon and end slot on the tab trigger", async () => {
  const wrapper = mount(
    defineComponent({
      components: { Tabs, TabItem },
      setup() {
        const value = ref("inbox");

        return { User, value };
      },
      template: `
        <Tabs v-model="value">
          <TabItem :start-icon="User" label="Inbox" value="inbox">
            <template #end>
              <span data-testid="item-end">3</span>
            </template>
            Inbox panel
          </TabItem>
        </Tabs>
      `,
    }),
  );

  await flushPromises();
  await nextTick();

  expect(wrapper.find("svg").exists()).toBe(true);
  expect(wrapper.find('[data-testid="item-end"]').exists()).toBe(true);
  expect(wrapper.find('[role="tab"]').classes().join(" ")).toContain("gap-");
});
