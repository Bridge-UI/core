// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test } from "vitest";

// ** Local Imports
import { NumberField } from "@/Components/NumberField";

test("it should render a number input", () => {
  const wrapper = mount(NumberField);

  expect(wrapper.find('input[type="number"]').exists()).toBe(true);
});

test("it should render increment and decrement buttons", () => {
  const wrapper = mount(NumberField);

  expect(wrapper.find('button[aria-label="Increment value"]').exists()).toBe(
    true,
  );
  expect(wrapper.find('button[aria-label="Decrement value"]').exists()).toBe(
    true,
  );
});

test("it should increment value when increment button is clicked", async () => {
  const wrapper = mount(NumberField, {
    props: {
      step: 2,
      modelValue: 2,
      "onUpdate:modelValue": (value: number | null | undefined) => {
        wrapper.setProps({ modelValue: value });
      },
    },
  });

  await wrapper.find('button[aria-label="Increment value"]').trigger("click");

  expect(wrapper.props("modelValue")).toBe(4);
  expect(wrapper.emitted("change")).toEqual([[4]]);
});

test("it should emit change when decrement button is clicked", async () => {
  const wrapper = mount(NumberField, {
    props: {
      step: 2,
      modelValue: 4,
      "onUpdate:modelValue": (value: number | null | undefined) => {
        wrapper.setProps({ modelValue: value });
      },
    },
  });

  await wrapper.find('button[aria-label="Decrement value"]').trigger("click");

  expect(wrapper.props("modelValue")).toBe(2);
  expect(wrapper.emitted("change")).toEqual([[2]]);
});

test("it should disable stepper buttons when disabled", () => {
  const wrapper = mount(NumberField, { props: { disabled: true } });

  expect(
    wrapper.find('button[aria-label="Increment value"]').attributes("disabled"),
  ).toBeDefined();
  expect(
    wrapper.find('button[aria-label="Decrement value"]').attributes("disabled"),
  ).toBeDefined();
});

test("it should render a label when label prop is provided", () => {
  const wrapper = mount(NumberField, { props: { label: "Quantity" } });

  expect(wrapper.text()).toContain("Quantity");
});
