// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test } from "vitest";
import { defineComponent } from "vue";

// ** Local Imports
import { List } from "@/Components/List";
import { ListSection } from "@/Components/ListSection";

test("it should render the title from the title prop", () => {
  const wrapper = mount(ListSection, {
    props: { title: "Section title" },
  });

  expect(wrapper.text()).toContain("Section title");
});

test("it should render default slot content as the title", () => {
  const wrapper = mount(ListSection, {
    slots: { default: "Custom label" },
  });

  expect(wrapper.text()).toContain("Custom label");
});

test("it should apply sticky classes when sticky is true", () => {
  const wrapper = mount(ListSection, {
    props: { sticky: true, title: "Sticky" },
  });

  expect(wrapper.find('[role="presentation"]').classes()).toContain("sticky");
});

test("it should apply inset padding when inset is true", () => {
  const wrapper = mount(ListSection, {
    props: { inset: true, title: "Inset" },
  });

  expect(wrapper.find('[role="presentation"]').classes()).toContain("pl-14");
});

test("it should inherit dense padding from parent List", () => {
  const Host = defineComponent({
    components: { List, ListSection },
    template: '<List dense><ListSection title="Dense section" /></List>',
  });

  const wrapper = mount(Host);

  expect(wrapper.find('[role="presentation"]').classes()).toContain("py-1.5");
});

test("it should render a div root when as prop is div", () => {
  const wrapper = mount(ListSection, {
    props: { as: "div", title: "Div section" },
  });

  expect(wrapper.element.tagName).toBe("DIV");
});
