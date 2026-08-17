// ** External Imports
import { flushPromises, mount } from "@vue/test-utils";
import { afterEach, expect, test } from "vitest";
import { h } from "vue";

// ** Local Imports
import { Step } from "@/Components/Step";
import { Stepper } from "@/Components/Stepper";

afterEach(async () => {
  while (mountedWrappers.length > 0) {
    mountedWrappers.pop()?.unmount();
  }

  await flushPromises();
});

const mountedWrappers: Array<ReturnType<typeof mount<typeof Stepper>>> = [];

function mountStep() {
  const wrapper = mount(Stepper, {
    slots: {
      default: () => [h(Step, { label: "Account" })],
    },
    props: {
      modelValue: 0,
      "onUpdate:modelValue": (value: number) => {
        wrapper.setProps({ modelValue: value });
      },
    },
  });

  mountedWrappers.push(wrapper);

  return wrapper;
}

test("it should render the label and a numeric indicator", () => {
  const wrapper = mountStep();

  expect(wrapper.text()).toContain("Account");
  expect(wrapper.text()).toContain("1");
});

test("it should wire aria-controls when vertical content is shown", () => {
  const wrapper = mount(Stepper, {
    props: { modelValue: 0, orientation: "vertical" },
    slots: {
      default: () => [
        h(Step, { label: "Account" }, { default: () => "Account form" }),
      ],
    },
  });

  mountedWrappers.push(wrapper);

  const trigger = wrapper.find("button");
  const contentId = trigger.attributes("aria-controls");

  expect(contentId).toBeTruthy();
  expect(wrapper.find(`#${contentId}`).exists()).toBe(true);
  expect(wrapper.text()).toContain("Account form");
});

test("it should show a description when provided", () => {
  const wrapper = mount(Stepper, {
    props: { modelValue: 0 },
    slots: {
      default: () => [h(Step, { label: "Cart", description: "Review items" })],
    },
  });

  mountedWrappers.push(wrapper);

  expect(wrapper.text()).toContain("Review items");
});
