// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test } from "vitest";

// ** Local Imports
import { MiniBadge } from "@/Components/MiniBadge";

test("it should render default slot content", () => {
  const wrapper = mount(MiniBadge, { slots: { default: "3" } });

  expect(wrapper.text()).toContain("3");
  expect(wrapper.find("span").exists()).toBe(true);
});

test("it should apply xs size by default", () => {
  const wrapper = mount(MiniBadge, { slots: { default: "1" } });

  expect(wrapper.find("span").classes()).toContain("min-w-5");
});

test("it should merge class with root classes", () => {
  const wrapper = mount(MiniBadge, {
    slots: { default: "Styled" },
    props: { class: "custom-mini-badge" },
  });

  expect(wrapper.find("span").classes()).toContain("custom-mini-badge");
});

test("it should forward additional attributes to the root element", () => {
  const wrapper = mount(MiniBadge, {
    slots: { default: "Count" },
    props: {
      id: "mini-badge-root",
      "data-testid": "mini-badge",
    },
  });

  const root = wrapper.find("#mini-badge-root");

  expect(root.exists()).toBe(true);
  expect(root.attributes("data-testid")).toBe("mini-badge");
});
