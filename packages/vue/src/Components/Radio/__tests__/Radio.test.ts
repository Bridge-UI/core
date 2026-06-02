// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test } from "vitest";

// ** Local Imports
import { Radio } from "@/Components/Radio";

test("it should render a radio control", () => {
  const wrapper = mount(Radio, {
    props: { value: "a", mainLabel: "Option A" },
  });

  expect(wrapper.find('input[type="radio"]').exists()).toBe(true);
});

test("it should render main label when mainLabel prop is provided", () => {
  const wrapper = mount(Radio, {
    props: { value: "a", mainLabel: "Option A" },
  });

  expect(wrapper.text()).toContain("Option A");
});

test("it should be checked when modelValue matches value", () => {
  const wrapper = mount(Radio, {
    props: { value: "a", modelValue: "a", mainLabel: "Option A" },
  });

  expect(
    (wrapper.find('input[type="radio"]').element as HTMLInputElement).checked,
  ).toBe(true);
});

test("it should not be checked when modelValue differs from value", () => {
  const wrapper = mount(Radio, {
    props: { value: "a", modelValue: "b", mainLabel: "Option A" },
  });

  expect(
    (wrapper.find('input[type="radio"]').element as HTMLInputElement).checked,
  ).toBe(false);
});

test("it should emit update:modelValue with option value when selected", async () => {
  const wrapper = mount(Radio, {
    props: { value: "a", modelValue: "b", mainLabel: "Option A" },
  });

  await wrapper.find('input[type="radio"]').trigger("change");

  expect(wrapper.emitted("update:modelValue")).toEqual([["a"]]);
});

test("it should apply disabled on the input when disabled", () => {
  const wrapper = mount(Radio, {
    props: { value: "a", mainLabel: "Option A", disabled: true },
  });

  expect(
    wrapper.find('input[type="radio"]').attributes("disabled"),
  ).toBeDefined();
});

test("it should set aria-invalid when error is set", () => {
  const wrapper = mount(Radio, {
    props: { value: "a", mainLabel: "Option A", error: true },
  });

  expect(wrapper.find('input[type="radio"]').attributes("aria-invalid")).toBe(
    "true",
  );
});

test("it should forward name to the native input", () => {
  const wrapper = mount(Radio, {
    props: { value: "a", name: "plan", mainLabel: "Option A" },
  });

  expect(wrapper.find('input[type="radio"]').attributes("name")).toBe("plan");
});

test("it should link label to control id", () => {
  const wrapper = mount(Radio, {
    attrs: { controlId: "plan-a" },
    props: { value: "a", mainLabel: "Option A", controlId: "plan-a" },
  });

  const inputId = wrapper.find('input[type="radio"]').attributes("id");

  expect(wrapper.find(`label[for="${inputId}"]`).exists()).toBe(true);
});
