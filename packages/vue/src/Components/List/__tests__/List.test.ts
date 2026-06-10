// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test } from "vitest";

// ** Local Imports
import { List } from "@/Components/List";

test("it should render the root element", () => {
  const wrapper = mount(List);

  expect(wrapper.element.tagName).toBe("UL");
  expect(wrapper.classes()).toContain("m-0");
  expect(wrapper.classes()).toContain("list-none");
});

test("it should apply padding classes when padding prop is set", () => {
  const none = mount(List, { props: { padding: "none" } });
  const normal = mount(List, { props: { padding: "normal" } });

  expect(none.classes()).toContain("p-0");
  expect(none.classes()).not.toContain("py-2");

  expect(normal.classes()).toContain("py-2");
  expect(normal.classes()).not.toContain("p-0");
});

test("it should apply nested indent when nested is true", () => {
  const wrapper = mount(List, { props: { nested: true } });

  expect(wrapper.classes()).toContain("pl-4");
});

test("it should render default slot content", () => {
  const wrapper = mount(List, {
    slots: { default: "<li>Item one</li>" },
  });

  expect(wrapper.text()).toContain("Item one");
});

test("it should render a custom root element when as prop is set", () => {
  const wrapper = mount(List, { props: { as: "div" } });

  expect(wrapper.element.tagName).toBe("DIV");
});

test("it should merge class with root classes", () => {
  const wrapper = mount(List, {
    props: { class: "custom-list" },
  });

  expect(wrapper.classes()).toContain("custom-list");
});
