// ** External Imports
import { mount } from "@vue/test-utils";
import { Info } from "lucide-vue-next";
import { expect, test } from "vitest";

// ** Local Imports
import { Icon } from "@/Components/Icon";

test("it should render an svg element", () => {
  const wrapper = mount(Icon, { props: { icon: Info } });

  expect(wrapper.find("svg").exists()).toBe(true);
});

test("it should apply default md size classes", () => {
  const wrapper = mount(Icon, { props: { icon: Info } });

  const svg = wrapper.find("svg");

  expect(svg.classes()).toContain("w-4");
  expect(svg.classes()).toContain("h-4");
});

test("it should apply sm size classes", () => {
  const wrapper = mount(Icon, { props: { icon: Info, size: "sm" } });

  const svg = wrapper.find("svg");

  expect(svg.classes()).toContain("w-3.5");
  expect(svg.classes()).toContain("h-3.5");
});

test("it should apply xl size classes", () => {
  const wrapper = mount(Icon, { props: { icon: Info, size: "xl" } });

  const svg = wrapper.find("svg");

  expect(svg.classes()).toContain("w-6");
  expect(svg.classes()).toContain("h-6");
});

test("it should merge custom class prop", () => {
  const wrapper = mount(Icon, { props: { icon: Info, class: "text-red-500" } });

  expect(wrapper.find("svg").classes()).toContain("text-red-500");
});

test("it should forward additional attributes to the svg element", () => {
  const wrapper = mount(Icon, {
    props: {
      icon: Info,
      id: "info-icon",
      "aria-hidden": true,
      "data-testid": "icon",
    },
  });

  const svg = wrapper.find("#info-icon");

  expect(svg.exists()).toBe(true);
  expect(svg.attributes("data-testid")).toBe("icon");
  expect(svg.attributes("aria-hidden")).toBe("true");
});

test("it should forward fallthrough attrs to the svg element", () => {
  const wrapper = mount(Icon, {
    props: { icon: Info },
    attrs: {
      id: "icon-from-attrs",
      "data-testid": "icon-attrs",
    },
  });

  const svg = wrapper.find("#icon-from-attrs");

  expect(svg.exists()).toBe(true);
  expect(svg.attributes("data-testid")).toBe("icon-attrs");
});

test("it should apply lg size classes", () => {
  const wrapper = mount(Icon, { props: { icon: Info, size: "lg" } });

  const svg = wrapper.find("svg");

  expect(svg.classes()).toContain("w-5");
  expect(svg.classes()).toContain("h-5");
});
