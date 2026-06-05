// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test } from "vitest";

// ** Local Imports
import { Checkbox } from "@/Components/Checkbox";

test("it should render a checkbox control", () => {
  const wrapper = mount(Checkbox, {
    props: { mainLabel: "Accept terms" },
  });

  expect(wrapper.find('input[type="checkbox"]').exists()).toBe(true);
});

test("it should render main label when mainLabel prop is provided", () => {
  const wrapper = mount(Checkbox, {
    props: { mainLabel: "Accept terms" },
  });

  expect(wrapper.text()).toContain("Accept terms");
});

test("it should render description when description prop is provided", () => {
  const wrapper = mount(Checkbox, {
    props: {
      mainLabel: "Accept",
      description: "You must accept to continue",
    },
  });

  expect(wrapper.text()).toContain("You must accept to continue");
});

test("it should render error message when error is set", () => {
  const wrapper = mount(Checkbox, {
    props: {
      error: true,
      mainLabel: "Accept",
      errorMessage: "Required",
    },
  });

  expect(wrapper.text()).toContain("Required");
});

test("it should apply disabled on the input when disabled", () => {
  const wrapper = mount(Checkbox, {
    props: { disabled: true, mainLabel: "Accept" },
  });

  expect(
    wrapper.find('input[type="checkbox"]').attributes("disabled"),
  ).toBeDefined();
});

test("it should set aria-invalid when error is set", () => {
  const wrapper = mount(Checkbox, {
    props: { error: true, mainLabel: "Accept" },
  });

  expect(
    wrapper.find('input[type="checkbox"]').attributes("aria-invalid"),
  ).toBe("true");
});

test("it should emit update:modelValue when toggled", async () => {
  const wrapper = mount(Checkbox, {
    props: { modelValue: false, mainLabel: "Accept" },
  });

  await wrapper.find('input[type="checkbox"]').setValue(true);

  expect(wrapper.emitted("update:modelValue")).toEqual([[true]]);
});

test("it should reflect checked state from modelValue", () => {
  const wrapper = mount(Checkbox, {
    props: { modelValue: true, mainLabel: "Accept" },
  });

  expect(
    (wrapper.find('input[type="checkbox"]').element as HTMLInputElement)
      .checked,
  ).toBe(true);
});

test("it should set indeterminate on the native input when indeterminate is true", async () => {
  const wrapper = mount(Checkbox, {
    props: { modelValue: false, indeterminate: true, mainLabel: "Select all" },
  });

  await wrapper.vm.$nextTick();

  expect(
    (wrapper.find('input[type="checkbox"]').element as HTMLInputElement)
      .indeterminate,
  ).toBe(true);
});

test("it should link main label to control id", () => {
  const wrapper = mount(Checkbox, {
    attrs: { controlId: "terms-checkbox" },
    props: { mainLabel: "Accept", controlId: "terms-checkbox" },
  });

  const inputId = wrapper.find('input[type="checkbox"]').attributes("id");

  expect(wrapper.find(`label[for="${inputId}"]`).exists()).toBe(true);
});
