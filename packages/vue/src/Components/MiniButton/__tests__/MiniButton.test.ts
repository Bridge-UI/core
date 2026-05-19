// ** External Imports
import { mount } from "@vue/test-utils";
import { Settings } from "lucide-vue-next";
import { expect, test } from "vitest";

// ** Local Imports
import { MiniButton } from "@/Components/MiniButton";

test("it should render a button with an icon", () => {
  const wrapper = mount(MiniButton, {
    props: { icon: Settings },
    attrs: { "aria-label": "Settings" },
  });

  expect(wrapper.find("button").exists()).toBe(true);
  expect(wrapper.find("button svg").exists()).toBe(true);
  expect(wrapper.attributes("aria-label")).toBe("Settings");
});

test("it should apply disabled attribute when disabled", () => {
  const wrapper = mount(MiniButton, {
    props: { icon: Settings, disabled: true },
    attrs: { "aria-label": "Settings" },
  });

  expect(wrapper.find("button").attributes("disabled")).toBeDefined();
});

test("it should show loading spinner when loading", () => {
  const wrapper = mount(MiniButton, {
    props: { icon: Settings, loading: true },
    attrs: { "aria-label": "Settings" },
  });

  expect(wrapper.find("svg.animate-spin").exists()).toBe(true);
  expect(wrapper.find("button").attributes("aria-busy")).toBe("true");
});

test("it should render as anchor when as is a", () => {
  const wrapper = mount(MiniButton, {
    props: { as: "a", href: "https://example.com", icon: Settings },
    attrs: { "aria-label": "Settings" },
  });

  const anchor = wrapper.find("a");

  expect(anchor.exists()).toBe(true);
  expect(anchor.attributes("href")).toBe("https://example.com");
  expect(anchor.find("svg").exists()).toBe(true);
});

test("it should merge class with root classes", () => {
  const wrapper = mount(MiniButton, {
    props: { icon: Settings, class: "custom-mini-button" },
    attrs: { "aria-label": "Settings" },
  });

  expect(wrapper.find("button").classes()).toContain("custom-mini-button");
});

test("it should forward fallthrough attrs to the root element", () => {
  const wrapper = mount(MiniButton, {
    props: { icon: Settings },
    attrs: {
      id: "settings-btn",
      "data-testid": "mini-button",
      "aria-label": "Settings",
    },
  });

  const root = wrapper.find("#settings-btn");

  expect(root.exists()).toBe(true);
  expect(root.attributes("data-testid")).toBe("mini-button");
});

test("it should render default slot in place of the icon", () => {
  const wrapper = mount(MiniButton, {
    attrs: { "aria-label": "Avatar" },
    slots: {
      default: '<span data-testid="avatar">AB</span>',
    },
  });

  expect(wrapper.find("[data-testid='avatar']").text()).toBe("AB");
  expect(wrapper.find("svg").exists()).toBe(false);
});

test("it should hide default slot when loading", () => {
  const wrapper = mount(MiniButton, {
    props: { loading: true },
    attrs: { "aria-label": "Avatar" },
    slots: {
      default: '<span data-testid="avatar">AB</span>',
    },
  });

  expect(wrapper.find("[data-testid='avatar']").exists()).toBe(false);
  expect(wrapper.find("svg.animate-spin").exists()).toBe(true);
});

test("it should prefer icon over default slot when both are provided", () => {
  const wrapper = mount(MiniButton, {
    props: { icon: Settings },
    attrs: { "aria-label": "Settings" },
    slots: {
      default: '<span data-testid="avatar">AB</span>',
    },
  });

  expect(wrapper.find("[data-testid='avatar']").exists()).toBe(false);
  expect(wrapper.find("svg").exists()).toBe(true);
});

test("it should forward partsProps to icon sub-parts", () => {
  const wrapper = mount(MiniButton, {
    props: {
      icon: Settings,
      partsProps: {
        icon: { id: "mini-button-icon" },
      },
    },
    attrs: { "aria-label": "Settings" },
  });

  expect(wrapper.find("#mini-button-icon").exists()).toBe(true);
});
