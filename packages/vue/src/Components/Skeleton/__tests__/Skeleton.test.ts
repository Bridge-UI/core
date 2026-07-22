// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test } from "vitest";

// ** Local Imports
import { Skeleton } from "@/Components/Skeleton";

test("it should render as a div element", () => {
  const wrapper = mount(Skeleton, {
    props: { class: "h-4 w-32" },
  });

  expect(wrapper.find("div").exists()).toBe(true);
});

test("it should apply rounded-md by default", () => {
  const wrapper = mount(Skeleton, {
    props: { class: "h-4 w-32" },
  });

  expect(wrapper.find("div").classes()).toContain("rounded-md");
});

test("it should apply rounded-full when rounded is full", () => {
  const wrapper = mount(Skeleton, {
    props: { rounded: "full", class: "h-10 w-10" },
  });

  expect(wrapper.find("div").classes()).toContain("rounded-full");
});

test("it should merge class with root classes", () => {
  const wrapper = mount(Skeleton, {
    props: { class: "h-4 w-48" },
  });

  const root = wrapper.find("div");

  expect(root.classes()).toContain("h-4");
  expect(root.classes()).toContain("w-48");
});

test("it should apply pulse animation by default", () => {
  const wrapper = mount(Skeleton, {
    props: { class: "h-4 w-32" },
  });

  expect(wrapper.find("div").classes()).toContain("animate-pulse");
});

test("it should forward additional attributes to the root element", () => {
  const wrapper = mount(Skeleton, {
    props: {
      class: "h-4 w-32",
      id: "skeleton-root",
      "data-testid": "skeleton",
    },
  });

  const root = wrapper.find("#skeleton-root");

  expect(root.exists()).toBe(true);
  expect(root.attributes("data-testid")).toBe("skeleton");
});

test("it should forward fallthrough attrs to the root element", () => {
  const wrapper = mount(Skeleton, {
    attrs: {
      class: "h-4 w-32",
      id: "skeleton-from-attrs",
      "data-testid": "skeleton-attrs",
    },
  });

  const root = wrapper.find("#skeleton-from-attrs");

  expect(root.exists()).toBe(true);
  expect(root.attributes("data-testid")).toBe("skeleton-attrs");
});

test("it should apply user class after classes.root (tailwind-merge)", () => {
  const wrapper = mount(Skeleton, {
    props: {
      class: "h-8",
      classes: { root: "h-4" },
    },
  });

  const root = wrapper.find("div");

  expect(root.classes()).toContain("h-8");
  expect(root.classes()).not.toContain("h-4");
});
