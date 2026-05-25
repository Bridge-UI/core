// ** External Imports
import { mount } from "@vue/test-utils";
import { afterEach, expect, test } from "vitest";

// ** Local Imports
import { FormField } from "@/Components/FormField";

afterEach(() => {
  document.body.innerHTML = "";
});

test("it should render label text from prop", () => {
  const wrapper = mount(FormField, {
    props: { label: "Email", controlId: "field-id" },
    slots: { default: '<input id="field-id" />' },
  });

  expect(wrapper.text()).toContain("Email");
  expect(wrapper.find('label[for="field-id"]').exists()).toBe(true);
});

test("it should apply error color on label when error is true", () => {
  const wrapper = mount(FormField, {
    props: { label: "Email", error: true },
  });

  expect(wrapper.find("label").classes()).toContain("text-error-600");
});

test("it should render required asterisk when required is true", () => {
  const wrapper = mount(FormField, {
    props: { label: "Email", required: true },
  });

  expect(wrapper.text()).toContain("*");
  expect(wrapper.find("span").classes()).toContain("text-error-500");
});

test("it should render description when provided", () => {
  const wrapper = mount(FormField, {
    props: { description: "Helper text" },
  });

  expect(wrapper.text()).toContain("Helper text");
  expect(wrapper.find("p").attributes("id")).toMatch(/-description$/);
});

test("it should hide description when field is invalid", () => {
  const wrapper = mount(FormField, {
    props: { error: true, description: "Helper text" },
  });

  expect(wrapper.text()).not.toContain("Helper text");
});

test("it should render error message when errorMessage is set", () => {
  const wrapper = mount(FormField, {
    props: { errorMessage: "Required" },
  });

  expect(wrapper.text()).toContain("Required");
});

test("it should apply size typography on corner", () => {
  const wrapper = mount(FormField, {
    props: { corner: "Optional", size: "2xl" },
  });

  expect(wrapper.find("span").classes()).toContain("text-lg");
});
