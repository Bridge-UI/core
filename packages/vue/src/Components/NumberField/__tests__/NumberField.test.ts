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
      "onUpdate:modelValue": (value: null | number | undefined) => {
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
      "onUpdate:modelValue": (value: null | number | undefined) => {
        wrapper.setProps({ modelValue: value });
      },
    },
  });

  await wrapper.find('button[aria-label="Decrement value"]').trigger("click");

  expect(wrapper.props("modelValue")).toBe(2);
  expect(wrapper.emitted("change")).toEqual([[2]]);
});

test("it should start with defaultValue when v-model is not bound", () => {
  const wrapper = mount(NumberField, {
    props: { defaultValue: 5 },
  });

  expect(wrapper.find("input").element.value).toBe("5");
});

test("it should step freely when defaultValue is set without v-model", async () => {
  const wrapper = mount(NumberField, {
    props: { defaultValue: 5 },
  });

  await wrapper.find('button[aria-label="Increment value"]').trigger("click");

  expect(wrapper.find("input").element.value).toBe("6");
  expect(wrapper.emitted("change")).toEqual([[6]]);
});

test("it should ignore defaultValue when modelValue is bound", () => {
  const wrapper = mount(NumberField, {
    props: { modelValue: 3, defaultValue: 5 },
  });

  expect(wrapper.find("input").element.value).toBe("3");
});

test("it should not forward defaultValue to the native input", () => {
  const wrapper = mount(NumberField, {
    props: { defaultValue: 5 },
  });

  expect(wrapper.find("input").attributes("defaultvalue")).toBeUndefined();
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
