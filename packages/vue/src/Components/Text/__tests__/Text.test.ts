// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test } from "vitest";
import { h } from "vue";

// ** Local Imports
import { Text } from "@/Components/Text";
import BridgeUIProvider from "@/Provider/BridgeUIProvider.vue";

test("it should render as a p element by default", () => {
  const wrapper = mount(Text, { slots: { default: () => "Hello" } });

  expect(wrapper.find("p").text()).toBe("Hello");
});

test("it should render the element set by as", () => {
  const wrapper = mount(Text, { props: { as: "span" } });

  expect(wrapper.find("span").exists()).toBe(true);
  expect(wrapper.find("p").exists()).toBe(false);
});

test("it should apply default size, weight and color", () => {
  const root = mount(Text).find("p");

  expect(root.classes()).toContain("text-base");
  expect(root.classes()).toContain("font-normal");
  expect(root.classes()).toContain("text-dark-950");
  expect(root.classes()).toContain("dark:text-dark-50");
});

test("it should apply muted dark color when variant is muted", () => {
  const root = mount(Text, { props: { variant: "muted" } }).find("p");

  expect(root.classes()).toContain("text-dark-500");
  expect(root.classes()).toContain("dark:text-dark-400");
});

test("it should apply the color for the given variant", () => {
  const wrapper = mount(Text, {
    props: { color: "error", variant: "muted" },
  });

  expect(wrapper.find("p").classes()).toContain("text-error-600/75");
});

test("it should apply size and weight tokens", () => {
  const root = mount(Text, {
    props: { size: "xl", weight: "semibold" },
  }).find("p");

  expect(root.classes()).toContain("text-xl");
  expect(root.classes()).toContain("font-semibold");
});

test("it should apply numeric, truncate and uppercase classes", () => {
  const root = mount(Text, {
    props: { numeric: true, truncate: true, uppercase: true },
  }).find("p");

  expect(root.classes()).toContain("tabular-nums");
  expect(root.classes()).toContain("truncate");
  expect(root.classes()).toContain("uppercase");
});

test("it should ignore global defaultColor", () => {
  const wrapper = mount(BridgeUIProvider, {
    slots: { default: () => h(Text) },
    props: { global: { defaultColor: "primary" } },
  });

  expect(wrapper.find("p").classes()).toContain("text-dark-950");
});

test("it should use defaultProps from the provider", () => {
  const wrapper = mount(BridgeUIProvider, {
    slots: { default: () => h(Text) },
    props: { components: { Text: { defaultProps: { variant: "muted" } } } },
  });

  expect(wrapper.find("p").classes()).toContain("text-dark-500");
});

test("it should use variant tokens from the provider", () => {
  const wrapper = mount(BridgeUIProvider, {
    slots: { default: () => h(Text, { variant: "muted" }) },
    props: {
      components: {
        Text: { tokens: { variant: { muted: { dark: "text-dark-600" } } } },
      },
    },
  });

  expect(wrapper.find("p").classes()).toContain("text-dark-600");
});

test("it should let class override the token color", () => {
  const root = mount(Text, { attrs: { class: "text-info-700" } }).find("p");

  expect(root.classes()).toContain("text-info-700");
  expect(root.classes()).not.toContain("text-dark-950");
});

test("it should forward fallthrough attrs to the root element", () => {
  const wrapper = mount(Text, {
    attrs: { id: "text-root", "data-testid": "text" },
  });

  const root = wrapper.find("#text-root");

  expect(root.exists()).toBe(true);
  expect(root.attributes("data-testid")).toBe("text");
});
