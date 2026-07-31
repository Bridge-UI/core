// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test } from "vitest";

// ** Local Imports
import { Radio } from "@/Components/Radio";

test("it should render a radio control", () => {
  const wrapper = mount(Radio, {
    props: { value: "a", endLabel: "Option A" },
  });

  expect(wrapper.find('input[type="radio"]').exists()).toBe(true);
});

test("it should render end label when endLabel prop is provided", () => {
  const wrapper = mount(Radio, {
    props: { value: "a", endLabel: "Option A" },
  });

  expect(wrapper.text()).toContain("Option A");
});

test("it should be checked when modelValue matches value", () => {
  const wrapper = mount(Radio, {
    props: { value: "a", modelValue: "a", endLabel: "Option A" },
  });

  expect(
    (wrapper.find('input[type="radio"]').element as HTMLInputElement).checked,
  ).toBe(true);
});

test("it should not be checked when modelValue differs from value", () => {
  const wrapper = mount(Radio, {
    props: { value: "a", modelValue: "b", endLabel: "Option A" },
  });

  expect(
    (wrapper.find('input[type="radio"]').element as HTMLInputElement).checked,
  ).toBe(false);
});

test("it should emit update:modelValue with option value when selected", async () => {
  const wrapper = mount(Radio, {
    props: { value: "a", modelValue: "b", endLabel: "Option A" },
  });

  await wrapper.find('input[type="radio"]').trigger("change");

  expect(wrapper.emitted("update:modelValue")).toEqual([["a"]]);
});

test("it should apply disabled on the input when disabled", () => {
  const wrapper = mount(Radio, {
    props: { value: "a", disabled: true, endLabel: "Option A" },
  });

  expect(
    wrapper.find('input[type="radio"]').attributes("disabled"),
  ).toBeDefined();
});

test("it should set aria-invalid when error is set", () => {
  const wrapper = mount(Radio, {
    props: { value: "a", error: true, endLabel: "Option A" },
  });

  expect(wrapper.find('input[type="radio"]').attributes("aria-invalid")).toBe(
    "true",
  );
});

test("it should forward name to the native input", () => {
  const wrapper = mount(Radio, {
    props: { value: "a", name: "plan", endLabel: "Option A" },
  });

  expect(wrapper.find('input[type="radio"]').attributes("name")).toBe("plan");
});

test("it should start selected when defaultChecked is set without v-model", () => {
  const wrapper = mount(Radio, {
    props: { value: "a", defaultChecked: true, endLabel: "Option A" },
  });

  expect(
    (wrapper.find('input[type="radio"]').element as HTMLInputElement).checked,
  ).toBe(true);
});

test("it should ignore defaultChecked when modelValue is bound", () => {
  const wrapper = mount(Radio, {
    props: {
      value: "a",
      modelValue: "b",
      defaultChecked: true,
      endLabel: "Option A",
    },
  });

  expect(
    (wrapper.find('input[type="radio"]').element as HTMLInputElement).checked,
  ).toBe(false);
});

test("it should link label to control id", () => {
  const wrapper = mount(Radio, {
    attrs: { controlId: "plan-a" },
    props: { value: "a", controlId: "plan-a", endLabel: "Option A" },
  });

  const inputId = wrapper.find('input[type="radio"]').attributes("id");

  expect(wrapper.find(`label[for="${inputId}"]`).exists()).toBe(true);
});
