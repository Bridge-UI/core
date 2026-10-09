// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test } from "vitest";
import { h } from "vue";

// ** Local Imports
import { Heading } from "@/Components/Heading";
import BridgeUIProvider from "@/Provider/BridgeUIProvider.vue";

test("it should render as an h2 element by default", () => {
  const wrapper = mount(Heading, { slots: { default: () => "Title" } });

  expect(wrapper.find("h2").text()).toBe("Title");
});

test("it should render the element for the given level", () => {
  const wrapper = mount(Heading, { props: { level: 1 } });

  expect(wrapper.find("h1").exists()).toBe(true);
});

test("it should take the font size from the level", () => {
  const wrapper = mount(Heading, { props: { level: 1 } });

  expect(wrapper.find("h1").classes()).toContain("text-3xl");
});

test("it should let size override the level font size", () => {
  const root = mount(Heading, { props: { level: 1, size: "lg" } }).find("h1");

  expect(root.classes()).toContain("text-lg");
  expect(root.classes()).not.toContain("text-3xl");
});

test("it should apply default weight and color", () => {
  const root = mount(Heading).find("h2");

  expect(root.classes()).toContain("font-semibold");
  expect(root.classes()).toContain("text-dark-950");
});

test("it should apply muted color when variant is muted", () => {
  const wrapper = mount(Heading, { props: { variant: "muted" } });

  expect(wrapper.find("h2").classes()).toContain("text-dark-500");
});

test("it should ignore global defaultColor", () => {
  const wrapper = mount(BridgeUIProvider, {
    slots: { default: () => h(Heading) },
    props: { global: { defaultColor: "primary" } },
  });

  expect(wrapper.find("h2").classes()).toContain("text-dark-950");
});

test("it should use level tokens from the provider", () => {
  const wrapper = mount(BridgeUIProvider, {
    slots: { default: () => h(Heading) },
    props: {
      components: { Heading: { tokens: { level: { "2": "text-4xl" } } } },
    },
  });

  expect(wrapper.find("h2").classes()).toContain("text-4xl");
});

test("it should forward fallthrough attrs to the root element", () => {
  const wrapper = mount(Heading, {
    attrs: { id: "heading-root", "data-testid": "heading" },
  });

  const root = wrapper.find("#heading-root");

  expect(root.exists()).toBe(true);
  expect(root.attributes("data-testid")).toBe("heading");
});
