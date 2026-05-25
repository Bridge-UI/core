// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test } from "vitest";

// ** Local Imports
import { NumberField } from "@/Components/NumberField";

test("it should render the root element", () => {
  const wrapper = mount(NumberField, {
    attrs: { "aria-label": "Amount" },
  });

  expect(wrapper.find("input").exists()).toBe(true);
  expect(wrapper.find(".w-full").exists()).toBe(true);
});

test("it should use number type", () => {
  const wrapper = mount(NumberField, {
    attrs: { "aria-label": "Amount" },
  });

  expect(wrapper.find("input").attributes("type")).toBe("number");
});

test("it should render increment and decrement buttons", () => {
  const wrapper = mount(NumberField, {
    attrs: { "aria-label": "Amount" },
  });

  expect(wrapper.find("button[aria-label='Increment value']").exists()).toBe(
    true,
  );
  expect(wrapper.find("button[aria-label='Decrement value']").exists()).toBe(
    true,
  );
});

test("it should update modelValue when input changes", async () => {
  const wrapper = mount(NumberField, {
    attrs: { "aria-label": "Amount" },
    props: {
      modelValue: undefined,
      "onUpdate:modelValue": (value: number | null | undefined) => {
        wrapper.setProps({ modelValue: value });
      },
    },
  });

  await wrapper.find("input").setValue("7");

  expect(wrapper.props("modelValue")).toBe(7);
});

test("it should increment modelValue when increment button is clicked", async () => {
  const wrapper = mount(NumberField, {
    attrs: { "aria-label": "Amount" },
    props: {
      step: 2,
      modelValue: 2,
      "onUpdate:modelValue": (value: number | null | undefined) => {
        wrapper.setProps({ modelValue: value });
      },
    },
  });

  await wrapper.find("button[aria-label='Increment value']").trigger("click");

  expect(wrapper.props("modelValue")).toBe(4);
});

test("it should decrement modelValue when decrement button is clicked", async () => {
  const wrapper = mount(NumberField, {
    attrs: { "aria-label": "Amount" },
    props: {
      step: 2,
      modelValue: 4,
      "onUpdate:modelValue": (value: number | null | undefined) => {
        wrapper.setProps({ modelValue: value });
      },
    },
  });

  await wrapper.find("button[aria-label='Decrement value']").trigger("click");

  expect(wrapper.props("modelValue")).toBe(2);
});

test("it should forward min, max, and step to the input", () => {
  const wrapper = mount(NumberField, {
    attrs: { "aria-label": "Amount" },
    props: { min: 0, max: 10, step: 2, modelValue: 4 },
  });

  const input = wrapper.find("input");

  expect(input.attributes("min")).toBe("0");
  expect(input.attributes("max")).toBe("10");
  expect(input.attributes("step")).toBe("2");
});

test("it should disable stepper buttons when field is disabled", () => {
  const wrapper = mount(NumberField, {
    props: { disabled: true },
    attrs: { "aria-label": "Amount" },
  });

  expect(
    wrapper.find("button[aria-label='Increment value']").attributes("disabled"),
  ).toBeDefined();
  expect(
    wrapper.find("button[aria-label='Decrement value']").attributes("disabled"),
  ).toBeDefined();
});

test("it should not render error icon when error is set", () => {
  const wrapper = mount(NumberField, {
    props: { error: true },
    attrs: { "aria-label": "Amount" },
  });

  expect(wrapper.find(".lucide-circle-alert").exists()).toBe(false);
});

test("it should hide native spin buttons via input classes", () => {
  const wrapper = mount(NumberField, {
    attrs: { "aria-label": "Amount" },
  });

  expect(wrapper.find("input").classes()).toContain("appearance:textfield");
});

test("it should merge classes.increment and classes.decrement onto buttons", () => {
  const wrapper = mount(NumberField, {
    attrs: { "aria-label": "Amount" },
    props: {
      classes: {
        increment: "custom-increment",
        decrement: "custom-decrement",
      },
    },
  });

  expect(wrapper.find("button.custom-increment").exists()).toBe(true);
  expect(wrapper.find("button.custom-decrement").exists()).toBe(true);
});
