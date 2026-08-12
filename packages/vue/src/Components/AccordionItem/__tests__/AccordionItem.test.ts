// ** External Imports
import { flushPromises, mount } from "@vue/test-utils";
import { afterEach, expect, test } from "vitest";
import { h } from "vue";

// ** Local Imports
import { Accordion } from "@/Components/Accordion";
import { AccordionItem } from "@/Components/AccordionItem";

afterEach(async () => {
  while (mountedWrappers.length > 0) {
    mountedWrappers.pop()?.unmount();
  }

  await flushPromises();
});

const mountedWrappers: Array<ReturnType<typeof mount<typeof Accordion>>> = [];

function mountAccordionItem() {
  const wrapper = mount(Accordion, {
    props: {
      modelValue: "a",
      "onUpdate:modelValue": (value: string | string[]) => {
        wrapper.setProps({ modelValue: value });
      },
    },
    slots: {
      default: () => [
        h(
          AccordionItem,
          { value: "a", title: "Shipping" },
          {
            default: () => "Delivery details",
          },
        ),
      ],
    },
  });

  mountedWrappers.push(wrapper);

  return wrapper;
}

test("it should render title and panel content", () => {
  const wrapper = mountAccordionItem();

  expect(wrapper.text()).toContain("Shipping");
  expect(wrapper.text()).toContain("Delivery details");
});

test("it should wire aria-controls between trigger and panel", () => {
  const wrapper = mountAccordionItem();
  const trigger = wrapper.find("button");
  const panelId = trigger.attributes("aria-controls");

  expect(panelId).toBeTruthy();
  expect(wrapper.find(`#${panelId}`).exists()).toBe(true);
});
