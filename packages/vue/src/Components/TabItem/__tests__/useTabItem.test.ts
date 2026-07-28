// ** External Imports
import { flushPromises, mount } from "@vue/test-utils";
import { expect, test } from "vitest";
import { defineComponent, nextTick, ref } from "vue";

// ** Local Imports
import { useTabItem } from "@/Components/TabItem/composables/useTabItem";
import { Tabs } from "@/Components/Tabs";

test("it should register a tab item via useTabItem", async () => {
  const Consumer = defineComponent({
    setup(_, { slots }) {
      useTabItem({ value: "a", label: "A" }, slots);

      return () => null;
    },
  });

  const wrapper = mount(
    defineComponent({
      components: { Tabs, Consumer },
      setup() {
        const value = ref("a");

        return { value };
      },
      template: `
        <Tabs v-model="value">
          <Consumer>Panel</Consumer>
        </Tabs>
      `,
    }),
  );

  await flushPromises();
  await nextTick();

  expect(wrapper.find('[role="tab"]').exists()).toBe(true);
  expect(wrapper.find('[role="tab"]').text()).toContain("A");
});
