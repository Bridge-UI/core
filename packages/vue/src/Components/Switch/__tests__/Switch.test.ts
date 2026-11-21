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

test("it should start on when defaultChecked is set without v-model", () => {
  const wrapper = mount(Switch, {
    props: { defaultChecked: true, endLabel: "Notifications" },
  });

  expect(
    (wrapper.find('input[role="switch"]').element as HTMLInputElement).checked,
  ).toBe(true);
});

test("it should toggle freely when defaultChecked is set without v-model", async () => {
  const wrapper = mount(Switch, {
    props: { defaultChecked: true, endLabel: "Notifications" },
  });

  await wrapper.find('input[role="switch"]').setValue(false);

  expect(
    (wrapper.find('input[role="switch"]').element as HTMLInputElement).checked,
  ).toBe(false);
});

test("it should ignore defaultChecked when modelValue is bound", () => {
  const wrapper = mount(Switch, {
    props: {
      modelValue: false,
      defaultChecked: true,
      endLabel: "Notifications",
    },
  });

  expect(
    (wrapper.find('input[role="switch"]').element as HTMLInputElement).checked,
  ).toBe(false);
});

test("it should forward fallthrough attrs only to the switch input", () => {
  const wrapper = mount(Switch, {
    attrs: {
      id: "field-attrs",
      name: "field-attrs",
      "data-test": "field-attrs",
      "aria-describedby": "field-help",
    },
  });

  const control = wrapper.find('input[role="switch"]');
  const tagged = wrapper.findAll('[data-test="field-attrs"]');

  expect(tagged).toHaveLength(1);
  expect(tagged[0]?.element).toBe(control.element);
  expect(control.attributes("id")).toBe("field-attrs");
  expect(control.attributes("name")).toBe("field-attrs");
  expect(wrapper.findAll("#field-attrs")).toHaveLength(1);
  expect(control.attributes("aria-describedby")).toBe("field-help");
});

test("it should apply class and style to the root, not the switch input", () => {
  const wrapper = mount(Switch, {
    attrs: { class: "field-root", style: "width: 240px" },
  });

  const root = wrapper.find(".field-root");
  const control = wrapper.find('input[role="switch"]');

  expect(control.attributes("style")).toBeUndefined();
  expect(control.classes()).not.toContain("field-root");
  expect(root.element.contains(control.element)).toBe(true);
  expect(root.attributes("style")).toContain("width: 240px");
});
