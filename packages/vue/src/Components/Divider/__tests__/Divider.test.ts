// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test } from "vitest";

// ** Local Imports
import { Divider } from "@/Components/Divider";

test("it should render as an hr element", () => {
  const wrapper = mount(Divider);

  expect(wrapper.find("hr").exists()).toBe(true);
});

test("it should apply horizontal orientation by default", () => {
  const wrapper = mount(Divider);
  const root = wrapper.find("hr");

  expect(root.classes()).toContain("w-full");
  expect(root.classes()).toContain("border-t");
  expect(root.attributes("aria-orientation")).toBe("horizontal");
});

test("it should apply vertical orientation when orientation is vertical", () => {
  const wrapper = mount(Divider, {
    props: { orientation: "vertical" },
  });
  const root = wrapper.find("hr");

  expect(root.classes()).toContain("border-l");
  expect(root.attributes("aria-orientation")).toBe("vertical");
});

test("it should apply dark color by default", () => {
  const wrapper = mount(Divider);

  expect(wrapper.find("hr").classes()).toContain("border-dark-200");
});

test("it should apply primary color when color is primary", () => {
  const wrapper = mount(Divider, {
    props: { color: "primary" },
  });

  expect(wrapper.find("hr").classes()).toContain("border-primary-200");
});

test("it should expose separator role", () => {
  const wrapper = mount(Divider);

  expect(wrapper.find("hr").attributes("role")).toBe("separator");
});

test("it should merge class with root classes", () => {
  const wrapper = mount(Divider, {
    props: { class: "my-4" },
  });

  expect(wrapper.find("hr").classes()).toContain("my-4");
});

test("it should forward additional attributes to the root element", () => {
  const wrapper = mount(Divider, {
    props: {
      id: "divider-root",
      "data-testid": "divider",
    },
  });

  const root = wrapper.find("#divider-root");

  expect(root.exists()).toBe(true);
  expect(root.attributes("data-testid")).toBe("divider");
});

test("it should forward fallthrough attrs to the root element", () => {
  const wrapper = mount(Divider, {
    attrs: {
      class: "my-4",
      id: "divider-from-attrs",
      "data-testid": "divider-attrs",
    },
  });

  const root = wrapper.find("#divider-from-attrs");

  expect(root.exists()).toBe(true);
  expect(root.attributes("data-testid")).toBe("divider-attrs");
});

test("it should apply user class after classes.root (tailwind-merge)", () => {
  const wrapper = mount(Divider, {
    props: {
      class: "my-8",
      classes: { root: "my-2" },
    },
  });

  const root = wrapper.find("hr");

  expect(root.classes()).toContain("my-8");
  expect(root.classes()).not.toContain("my-2");
});
