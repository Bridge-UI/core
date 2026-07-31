// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test } from "vitest";

// ** Local Imports
import { Switch } from "@/Components/Switch";

test("it should render a switch control", () => {
  const wrapper = mount(Switch, {
    props: { endLabel: "Notifications" },
  });

  const input = wrapper.find('input[role="switch"]');

  expect(input.exists()).toBe(true);
});

test("it should render end label when endLabel prop is provided", () => {
  const wrapper = mount(Switch, {
    props: { endLabel: "Notifications" },
  });

  expect(wrapper.text()).toContain("Notifications");
});

test("it should emit update:modelValue when toggled", async () => {
  const wrapper = mount(Switch, {
    props: { modelValue: false, endLabel: "Notifications" },
  });

  await wrapper.find('input[role="switch"]').setValue(true);

  expect(wrapper.emitted("update:modelValue")).toEqual([[true]]);
});

test("it should reflect checked state from modelValue", () => {
  const wrapper = mount(Switch, {
    props: { modelValue: true, endLabel: "Notifications" },
  });

  expect(
    (wrapper.find('input[role="switch"]').element as HTMLInputElement).checked,
  ).toBe(true);
});

test("it should apply disabled on the input when disabled", () => {
  const wrapper = mount(Switch, {
    props: { disabled: true, endLabel: "Notifications" },
  });

  expect(
    wrapper.find('input[role="switch"]').attributes("disabled"),
  ).toBeDefined();
});

test("it should set aria-invalid when error is set", () => {
  const wrapper = mount(Switch, {
    props: { error: true, endLabel: "Notifications" },
  });

  expect(wrapper.find('input[role="switch"]').attributes("aria-invalid")).toBe(
    "true",
  );
});

test("it should render track and thumb elements", () => {
  const wrapper = mount(Switch, {
    props: { endLabel: "Notifications" },
  });

  expect(wrapper.findAll("label span").length).toBeGreaterThanOrEqual(2);
});
