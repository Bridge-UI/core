// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test } from "vitest";
import { defineComponent } from "vue";

// ** Local Imports
import { List } from "@/Components/List";
import { ListItem } from "@/Components/ListItem";

test("it should render primary text from the primary prop", () => {
  const wrapper = mount(ListItem, {
    props: { primary: "Edit item" },
  });

  expect(wrapper.text()).toContain("Edit item");
});

test("it should render an interactive wrapper with menuitem role", () => {
  const wrapper = mount(ListItem, {
    props: {
      role: "menuitem",
      interactive: true,
      primary: "Action",
    },
  });

  const interactive = wrapper.find('[role="menuitem"]');

  expect(interactive.exists()).toBe(true);
  expect(interactive.attributes("tabindex")).toBe("0");
});

test("it should apply dense padding when dense prop is set", () => {
  const wrapper = mount(ListItem, {
    props: {
      dense: true,
      role: "menuitem",
      interactive: true,
      primary: "Dense item",
    },
  });

  const interactive = wrapper.find('[role="menuitem"]');

  expect(interactive.classes()).toContain("py-1.5");
  expect(interactive.classes()).not.toContain("py-2");
});

test("it should inherit dense padding from parent List", () => {
  const Host = defineComponent({
    components: { List, ListItem },
    template:
      '<List dense><ListItem interactive primary="Dense item" role="menuitem" /></List>',
  });

  const wrapper = mount(Host);
  const interactive = wrapper.find('[role="menuitem"]');

  expect(interactive.classes()).toContain("py-1.5");
  expect(interactive.classes()).not.toContain("py-2");
});

test("it should apply selected styles when selected is true", () => {
  const wrapper = mount(ListItem, {
    props: {
      selected: true,
      interactive: true,
      primary: "Selected",
    },
  });

  const interactive = wrapper.find('[role="button"]');

  expect(interactive.classes()).toContain("bg-primary-50");
  expect(interactive.classes()).toContain("text-primary-700");
});

test("it should disable interaction when disabled is true", () => {
  const wrapper = mount(ListItem, {
    props: {
      disabled: true,
      interactive: true,
      primary: "Disabled",
    },
  });

  const interactive = wrapper.find('[role="button"]');

  expect(interactive.attributes("tabindex")).toBe("-1");
  expect(interactive.attributes("aria-disabled")).toBe("true");
  expect(interactive.classes()).toContain("pointer-events-none");
});

test("it should apply divider border on the root item", () => {
  const wrapper = mount(ListItem, {
    props: { divider: true, primary: "With divider" },
  });

  expect(wrapper.classes().join(" ")).toContain("border-b");
});
