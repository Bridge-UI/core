// ** External Imports
import { mount } from "@vue/test-utils";
import { CircleAlert } from "lucide-vue-next";
import { expect, test } from "vitest";

// ** Local Imports
import { Button } from "@/Components/Button";

test("it should render a button with default slot content", () => {
  const wrapper = mount(Button, { slots: { default: "Click me" } });

  expect(wrapper.find("button").exists()).toBe(true);
  expect(wrapper.text()).toContain("Click me");
});

test("it should apply disabled attribute when disabled", () => {
  const wrapper = mount(Button, {
    props: { disabled: true },
    slots: { default: "Disabled" },
  });

  expect(wrapper.find("button").attributes("disabled")).toBeDefined();
});

test("it should show loading spinner when loading", () => {
  const wrapper = mount(Button, {
    props: { loading: true },
    slots: { default: "Saving" },
  });

  expect(wrapper.find("button").attributes("aria-busy")).toBe("true");
  expect(wrapper.find("svg.animate-spin").exists()).toBe(true);
});

test("it should render start icon when startIcon prop is set", () => {
  const wrapper = mount(Button, {
    props: { startIcon: CircleAlert },
    slots: { default: "With icon" },
  });

  expect(wrapper.find("button svg").exists()).toBe(true);
});

test("it should render as anchor when as is a", () => {
  const wrapper = mount(Button, {
    props: { as: "a", href: "https://example.com" },
    slots: { default: "Link" },
  });

  const anchor = wrapper.find("a");

  expect(anchor.exists()).toBe(true);
  expect(anchor.attributes("href")).toBe("https://example.com");
});

test("it should apply full width class when full is true", () => {
  const wrapper = mount(Button, {
    props: { full: true },
    slots: { default: "Full" },
  });

  expect(wrapper.find("button").classes()).toContain("w-full");
});

test("it should render start slot content", () => {
  const wrapper = mount(Button, {
    slots: {
      default: "Label",
      start: "◀",
    },
  });

  expect(wrapper.text()).toContain("◀");
  expect(wrapper.text()).toContain("Label");
});
