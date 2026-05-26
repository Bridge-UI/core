// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test, vi } from "vitest";
import { nextTick } from "vue";

// ** Local Imports
import { PasswordField } from "@/Components/PasswordField";

test("it should render the root element", () => {
  const wrapper = mount(PasswordField, {
    attrs: { "aria-label": "Password" },
  });

  expect(wrapper.find("input").exists()).toBe(true);
  expect(wrapper.find(".w-full").exists()).toBe(true);
});

test("it should use password type by default", () => {
  const wrapper = mount(PasswordField, {
    attrs: { "aria-label": "Password" },
  });

  expect(wrapper.find("input").attributes("type")).toBe("password");
});

test("it should render visibility toggle button", () => {
  const wrapper = mount(PasswordField, {
    attrs: { "aria-label": "Password" },
  });

  expect(wrapper.find("button[aria-label='Show password']").exists()).toBe(
    true,
  );
});

test("it should default visible prop to null for uncontrolled mode", () => {
  const wrapper = mount(PasswordField, {
    attrs: { "aria-label": "Password" },
  });

  expect(wrapper.props("visible")).toBeNull();
});

test("it should toggle input type when visibility button is clicked", async () => {
  const wrapper = mount(PasswordField, {
    attrs: { "aria-label": "Password" },
  });

  expect(wrapper.find("input").attributes("type")).toBe("password");

  await wrapper.find("button[aria-label='Show password']").trigger("click");
  await nextTick();

  expect(wrapper.find("button[aria-label='Hide password']").exists()).toBe(
    true,
  );
  expect(wrapper.find("input").attributes("type")).toBe("text");
  expect(wrapper.find("svg").classes()).toContain("lucide-eye-off");

  await wrapper.find("button[aria-label='Hide password']").trigger("click");
  await nextTick();

  expect(wrapper.find("svg").classes()).toContain("lucide-eye");
  expect(wrapper.find("input").attributes("type")).toBe("password");
});

test("it should call onVisibilityChange when toggling", async () => {
  const onVisibilityChange = vi.fn();

  const wrapper = mount(PasswordField, {
    attrs: { "aria-label": "Password" },
    props: { onVisibilityChange },
  });

  await wrapper.find("button[aria-label='Show password']").trigger("click");
  await nextTick();

  expect(onVisibilityChange).toHaveBeenCalledWith(true);
});

test("it should respect controlled visible prop", async () => {
  const wrapper = mount(PasswordField, {
    props: { visible: false },
    attrs: { "aria-label": "Password" },
  });

  expect(wrapper.find("input").attributes("type")).toBe("password");

  await wrapper.setProps({ visible: true });

  expect(wrapper.find("input").attributes("type")).toBe("text");
});

test("it should disable visibility toggle when field is disabled", () => {
  const wrapper = mount(PasswordField, {
    props: { disabled: true },
    attrs: { "aria-label": "Password" },
  });

  expect(
    wrapper.find("button[aria-label='Show password']").attributes("disabled"),
  ).toBeDefined();
});

test("it should not render error icon when error is set", () => {
  const wrapper = mount(PasswordField, {
    props: { error: true },
    attrs: { "aria-label": "Password" },
  });

  expect(wrapper.find(".lucide-circle-alert").exists()).toBe(false);
});

test("it should render a label when label prop is provided", () => {
  const wrapper = mount(PasswordField, {
    props: { label: "Password" },
    attrs: { id: "password-field" },
  });

  expect(wrapper.text()).toContain("Password");
  expect(wrapper.find('label[for="password-field"]').exists()).toBe(true);
});

test("it should merge classes.toggle onto the visibility button", () => {
  const wrapper = mount(PasswordField, {
    attrs: { "aria-label": "Password" },
    props: {
      classes: { toggle: "custom-toggle-class" },
    },
  });

  expect(wrapper.find("button.custom-toggle-class").exists()).toBe(true);
});

test("it should update modelValue when input changes", async () => {
  const wrapper = mount(PasswordField, {
    attrs: { "aria-label": "Password" },
    props: {
      modelValue: "",
      "onUpdate:modelValue": (value: string | null | undefined) => {
        wrapper.setProps({ modelValue: value });
      },
    },
  });

  await wrapper.find("input").setValue("secret");

  expect(wrapper.props("modelValue")).toBe("secret");
});
