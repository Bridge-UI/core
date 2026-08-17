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

function basicSteps() {
  return [
    h(Step, { label: "Account" }),
    h(Step, { label: "Profile" }),
    h(Step, { disabled: true, label: "Confirm" }),
  ];
}

function mountStepper(
  options: Parameters<typeof mount<typeof Stepper>>[1] = {},
) {
  const wrapper = mount(Stepper, {
    ...options,
    props: {
      ...(options.props ?? {}),
      "onUpdate:modelValue": (value: number) => {
        wrapper.setProps({ modelValue: value });
      },
    },
  });

  mountedWrappers.push(wrapper);

  return wrapper;
}

test("it should mark the active step with aria-current", () => {
  const wrapper = mountStepper({
    props: { modelValue: 1 },
    slots: { default: basicSteps },
  });

  const profile = wrapper
    .findAll("button")
    .find((button) => button.text().includes("Profile"));
  const account = wrapper
    .findAll("button")
    .find((button) => button.text().includes("Account"));

  expect(profile?.attributes("aria-current")).toBe("step");
  expect(account?.attributes("aria-current")).toBeUndefined();
});

test("it should select a completed step when clicked in linear mode", async () => {
  const wrapper = mountStepper({
    props: { modelValue: 1 },
    slots: { default: basicSteps },
  });

  const account = wrapper
    .findAll("button")
    .find((button) => button.text().includes("Account"));

  await account?.trigger("click");

  expect(wrapper.emitted("update:modelValue")?.at(-1)?.[0]).toBe(0);
});

test("it should not select an upcoming step in linear mode", async () => {
  const wrapper = mountStepper({
    props: { modelValue: 0 },
    slots: {
      default: () => [
        h(Step, { label: "Account" }),
        h(Step, { label: "Profile" }),
      ],
    },
  });

  await wrapper.findAll("li").at(1)?.trigger("click");

  expect(wrapper.emitted("update:modelValue")).toBeUndefined();
});

test("it should select an upcoming step when linear is false", async () => {
  const wrapper = mountStepper({
    slots: { default: basicSteps },
    props: { linear: false, modelValue: 0 },
  });

  const profile = wrapper
    .findAll("button")
    .find((button) => button.text().includes("Profile"));

  await profile?.trigger("click");

  expect(wrapper.emitted("update:modelValue")?.at(-1)?.[0]).toBe(1);
});

test("it should not select a disabled step", async () => {
  const wrapper = mountStepper({
    slots: { default: basicSteps },
    props: { linear: false, modelValue: 1 },
  });

  const confirm = wrapper
    .findAll("li")
    .find((item) => item.text().includes("Confirm"));

  await confirm?.trigger("click");

  expect(wrapper.emitted("update:modelValue")).toBeUndefined();
});

test("it should show vertical step content for the active step", () => {
  const wrapper = mountStepper({
    props: { modelValue: 1, orientation: "vertical" },
    slots: {
      default: () => [
        h(Step, { label: "Cart" }, { default: () => "Cart details" }),
        h(Step, { label: "Shipping" }, { default: () => "Shipping form" }),
      ],
    },
  });

  expect(wrapper.text()).toContain("Shipping form");
  expect(wrapper.text()).not.toContain("Cart details");
});

test("it should apply vertical orientation classes on the list", () => {
  const wrapper = mountStepper({
    props: { modelValue: 0, orientation: "vertical" },
    slots: {
      default: () => [h(Step, { label: "Account" })],
    },
  });

  expect(wrapper.find("ol").classes().join(" ")).toContain("flex-col");
});
