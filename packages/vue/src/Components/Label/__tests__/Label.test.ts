// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test } from "vitest";

// ** Local Imports
import { Label } from "@/Components/Label";

test("it should render label text", () => {
  const wrapper = mount(Label, {
    props: { for: "field-id" },
    slots: { default: "Email" },
  });

  expect(wrapper.text()).toContain("Email");
  expect(wrapper.find("label").attributes("for")).toBe("field-id");
});

test("it should apply error color when error is true", () => {
  const wrapper = mount(Label, {
    props: { error: true },
    slots: { default: "Email" },
  });

  expect(wrapper.find("label").classes()).toContain("text-error-600");
});

test("it should render required asterisk when required is true", () => {
  const wrapper = mount(Label, {
    props: { required: true },
    slots: { default: "Email" },
  });

  expect(wrapper.text()).toContain("*");
  expect(wrapper.find("span").classes()).toContain("text-error-500");
});

test("it should apply size typography class", () => {
  const wrapper = mount(Label, {
    props: { size: "lg" },
    slots: { default: "Email" },
  });

  expect(wrapper.find("label").classes()).toContain("text-sm");
});
