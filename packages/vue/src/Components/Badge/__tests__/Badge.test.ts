// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test } from "vitest";

// ** Local Imports
import { Badge } from "@/Components/Badge";

test("it should render default slot content", () => {
  const wrapper = mount(Badge, { slots: { default: "New" } });

  expect(wrapper.text()).toContain("New");
  expect(wrapper.find("span").exists()).toBe(true);
});

test("it should apply rounded-full by default", () => {
  const wrapper = mount(Badge, { slots: { default: "Label" } });

  expect(wrapper.find("span").classes()).toContain("rounded-full");
});

test("it should merge class with root classes", () => {
  const wrapper = mount(Badge, {
    slots: { default: "Styled" },
    props: { class: "custom-badge" },
  });

  expect(wrapper.find("span").classes()).toContain("custom-badge");
});

test("it should forward additional attributes to the root element", () => {
  const wrapper = mount(Badge, {
    slots: { default: "Tagged" },
    props: {
      id: "badge-root",
      "data-testid": "badge",
    },
  });

  const root = wrapper.find("#badge-root");

  expect(root.exists()).toBe(true);
  expect(root.attributes("data-testid")).toBe("badge");
});

test("it should forward fallthrough attrs to the root element", () => {
  const wrapper = mount(Badge, {
    slots: { default: "Tagged" },
    attrs: {
      id: "badge-from-attrs",
      "data-testid": "badge-attrs",
    },
  });

  const root = wrapper.find("#badge-from-attrs");

  expect(root.exists()).toBe(true);
  expect(root.attributes("data-testid")).toBe("badge-attrs");
});

test("it should apply user class after classes.root (tailwind-merge)", () => {
  const wrapper = mount(Badge, {
    slots: { default: "Priority" },
    props: {
      class: "p-4",
      classes: { root: "p-2" },
    },
  });

  const root = wrapper.find("span");

  expect(root.classes()).toContain("p-4");
  expect(root.classes()).not.toContain("p-2");
});
