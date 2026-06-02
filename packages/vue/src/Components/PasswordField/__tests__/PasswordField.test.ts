// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test } from "vitest";

// ** Local Imports
import { PasswordField } from "@/Components/PasswordField";

test("it should render a password input by default", () => {
  const wrapper = mount(PasswordField);

  expect(wrapper.find('input[type="password"]').exists()).toBe(true);
});

test("it should render visibility toggle button", () => {
  const wrapper = mount(PasswordField);

  expect(wrapper.find('button[aria-label="Show password"]').exists()).toBe(
    true,
  );
});

test("it should reveal password when toggle is clicked", async () => {
  const wrapper = mount(PasswordField, {
    props: {
      modelValue: "secret",
    },
  });

  await wrapper.find('button[aria-label="Show password"]').trigger("click");

  expect(wrapper.find('input[type="text"]').exists()).toBe(true);
  expect(wrapper.find('button[aria-label="Hide password"]').exists()).toBe(
    true,
  );
});

test("it should disable toggle button when disabled", () => {
  const wrapper = mount(PasswordField, { props: { disabled: true } });

  expect(wrapper.find("button").attributes("disabled")).toBeDefined();
});

test("it should render a label when label prop is provided", () => {
  const wrapper = mount(PasswordField, { props: { label: "Password" } });

  expect(wrapper.text()).toContain("Password");
});
