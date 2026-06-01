// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test } from "vitest";

// ** Local Imports
import { Textarea } from "@/Components/Textarea";

test("it should render a textarea element", () => {
  const wrapper = mount(Textarea);

  expect(wrapper.find("textarea").exists()).toBe(true);
  expect(wrapper.find(".w-full").exists()).toBe(true);
});

test("it should render a label when label prop is provided", () => {
  const wrapper = mount(Textarea, { props: { label: "Notes" } });

  expect(wrapper.text()).toContain("Notes");
  expect(wrapper.find("label[for]").exists()).toBe(true);
});

test("it should render description when description prop is provided", () => {
  const wrapper = mount(Textarea, { props: { description: "Helper text" } });

  expect(wrapper.text()).toContain("Helper text");
});

test("it should set aria-invalid when error is set", () => {
  const wrapper = mount(Textarea, { props: { error: true } });

  expect(wrapper.find("textarea").attributes("aria-invalid")).toBe("true");
});

test("it should apply disabled attribute when disabled", () => {
  const wrapper = mount(Textarea, { props: { disabled: true } });

  expect(wrapper.find("textarea").attributes("disabled")).toBeDefined();
});

test("it should apply vertical resize class when resize is vertical", () => {
  const wrapper = mount(Textarea, { props: { resize: "vertical" } });

  expect(wrapper.find("textarea").classes()).toContain("resize-y");
});

test("it should update modelValue when textarea changes", async () => {
  const wrapper = mount(Textarea, {
    props: {
      modelValue: "",
      "onUpdate:modelValue": (value: string | null | undefined) => {
        wrapper.setProps({ modelValue: value });
      },
    },
  });

  await wrapper.find("textarea").setValue("Hello");

  expect(wrapper.props("modelValue")).toBe("Hello");
});
