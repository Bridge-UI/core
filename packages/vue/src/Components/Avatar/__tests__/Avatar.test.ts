// ** External Imports
import { User } from "@lucide/vue";
import { mount } from "@vue/test-utils";
import { expect, test } from "vitest";

// ** Local Imports
import { Avatar } from "@/Components/Avatar";

test("it should render an image when src is passed", () => {
  const wrapper = mount(Avatar, {
    props: {
      alt: "Jane Doe",
      src: "https://example.com/avatar.jpg",
    },
  });

  const image = wrapper.find("img");

  expect(image.exists()).toBe(true);
  expect(image.attributes("src")).toBe("https://example.com/avatar.jpg");
  expect(image.attributes("alt")).toBe("Jane Doe");
});

test("it should render fallback text when fallback is passed", () => {
  const wrapper = mount(Avatar, { props: { fallback: "JP" } });

  expect(wrapper.text()).toContain("JP");
});

test("it should render default icon when no src or fallback is passed", () => {
  const wrapper = mount(Avatar);

  expect(wrapper.find("svg").exists()).toBe(true);
});

test("it should render custom icon when icon prop is passed", () => {
  const wrapper = mount(Avatar, { props: { icon: User } });

  expect(wrapper.find("svg").exists()).toBe(true);
});

test("it should render default slot content", () => {
  const wrapper = mount(Avatar, { slots: { default: "Custom" } });

  expect(wrapper.text()).toContain("Custom");
});

test("it should apply rounded-full by default", () => {
  const wrapper = mount(Avatar, { props: { fallback: "JP" } });

  expect(wrapper.find("div").classes()).toContain("rounded-full");
});

test("it should merge class with root classes", () => {
  const wrapper = mount(Avatar, {
    props: { fallback: "JP", class: "custom-avatar" },
  });

  expect(wrapper.find("div").classes()).toContain("custom-avatar");
});

test("it should forward additional attributes to the root element", () => {
  const wrapper = mount(Avatar, {
    props: {
      fallback: "JP",
      id: "avatar-root",
      "data-testid": "avatar",
    },
  });

  const root = wrapper.find("#avatar-root");

  expect(root.exists()).toBe(true);
  expect(root.attributes("data-testid")).toBe("avatar");
});

test("it should forward fallthrough attrs to the root element", () => {
  const wrapper = mount(Avatar, {
    props: { fallback: "JP" },
    attrs: {
      id: "avatar-from-attrs",
      "data-testid": "avatar-attrs",
    },
  });

  const root = wrapper.find("#avatar-from-attrs");

  expect(root.exists()).toBe(true);
  expect(root.attributes("data-testid")).toBe("avatar-attrs");
});

test("it should apply user class after classes.root (tailwind-merge)", () => {
  const wrapper = mount(Avatar, {
    props: {
      class: "p-4",
      fallback: "JP",
      classes: { root: "p-2" },
    },
  });

  const root = wrapper.find("div");

  expect(root.classes()).toContain("p-4");
  expect(root.classes()).not.toContain("p-2");
});
