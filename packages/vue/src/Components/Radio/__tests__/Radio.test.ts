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

test("it should not be checked when modelValue is unset", () => {
  const wrapper = mount(Radio, {
    props: { value: "a", endLabel: "Option A" },
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

test("it should stay unchecked when v-model is bound and unset", () => {
  const wrapper = mount(Radio, {
    props: { value: "a", endLabel: "Option A" },
    attrs: { "onUpdate:modelValue": () => undefined },
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

test("it should forward fallthrough attrs only to the radio input", () => {
  const wrapper = mount(Radio, {
    attrs: {
      id: "field-attrs",
      name: "field-attrs",
      "data-test": "field-attrs",
      "aria-describedby": "field-help",
    },
  });

  const control = wrapper.find('input[type="radio"]');
  const tagged = wrapper.findAll('[data-test="field-attrs"]');

  expect(tagged).toHaveLength(1);
  expect(tagged[0]?.element).toBe(control.element);
  expect(control.attributes("id")).toBe("field-attrs");
  expect(control.attributes("name")).toBe("field-attrs");
  expect(wrapper.findAll("#field-attrs")).toHaveLength(1);
  expect(control.attributes("aria-describedby")).toBe("field-help");
});

test("it should apply class and style to the root, not the radio input", () => {
  const wrapper = mount(Radio, {
    attrs: { class: "field-root", style: "width: 240px" },
  });

  const root = wrapper.find(".field-root");
  const control = wrapper.find('input[type="radio"]');

  expect(control.attributes("style")).toBeUndefined();
  expect(control.classes()).not.toContain("field-root");
  expect(root.element.contains(control.element)).toBe(true);
  expect(root.attributes("style")).toContain("width: 240px");
});
