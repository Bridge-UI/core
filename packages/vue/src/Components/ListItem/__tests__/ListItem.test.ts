// ** External Imports
import { Link as InertiaLink } from "@inertiajs/vue3";
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

  expect(interactive.classes()).toContain("py-1");
  expect(interactive.classes()).toContain("rounded-md");
  expect(interactive.classes()).not.toContain("py-1.5");
});

test("it should inherit dense padding from parent List", () => {
  const Host = defineComponent({
    components: { List, ListItem },
    template:
      '<List dense><ListItem interactive primary="Dense item" role="menuitem" /></List>',
  });

  const wrapper = mount(Host);
  const interactive = wrapper.find('[role="menuitem"]');

  expect(interactive.classes()).toContain("py-1");
  expect(interactive.classes()).toContain("rounded-md");
  expect(interactive.classes()).not.toContain("py-1.5");
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

  expect(interactive.classes()).toContain("bg-dark-100");
  expect(interactive.classes()).toContain("text-dark-900");
});

test("it should render a check icon when selected is true", () => {
  const wrapper = mount(ListItem, {
    props: {
      selected: true,
      interactive: true,
      primary: "Selected",
    },
  });

  expect(wrapper.find("svg").exists()).toBe(true);
});

test("it should not render a selected icon when selectedIcon is null", () => {
  const wrapper = mount(ListItem, {
    props: {
      selected: true,
      interactive: true,
      selectedIcon: null,
      primary: "Selected",
    },
  });

  expect(wrapper.find("svg").exists()).toBe(false);
});

test("it should render an anchor when href is set", () => {
  const wrapper = mount(ListItem, {
    props: {
      href: "/inbox",
      target: "_blank",
      primary: "Inbox",
      rel: "noreferrer",
    },
  });

  const link = wrapper.get("a");

  expect(wrapper.element.tagName).toBe("LI");
  expect(link.attributes("href")).toBe("/inbox");
  expect(link.attributes("target")).toBe("_blank");
  expect(link.attributes("rel")).toBe("noreferrer");
});

test("it should omit href when the link is disabled", () => {
  const wrapper = mount(ListItem, {
    props: {
      disabled: true,
      href: "/archive",
      primary: "Archive",
    },
  });

  const link = wrapper.get("a");

  expect(link.attributes("href")).toBeUndefined();
  expect(link.attributes("aria-disabled")).toBe("true");
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

test("it should keep primary text from clipping truncated glyphs", () => {
  const wrapper = mount(ListItem, {
    props: { primary: "Configurações" },
  });

  const primary = wrapper.findAll("span").find((node) => {
    return node.text() === "Configurações";
  });

  expect(primary?.classes()).toContain("truncate");
  expect(primary?.classes()).toContain("leading-normal");
  expect(primary?.classes()).not.toContain("leading-none");
});

test("it should render linkAs inside the list item root", () => {
  const wrapper = mount(ListItem, {
    props: {
      href: "/inbox",
      primary: "Inbox",
      linkAs: InertiaLink,
      linkProps: { onBefore: () => false },
    },
  });

  const link = wrapper.get("a");
  const event = new MouseEvent("click", { bubbles: true, cancelable: true });

  link.element.dispatchEvent(event);

  expect(event.defaultPrevented).toBe(true);
  expect(wrapper.element.tagName).toBe("LI");
  expect(link.attributes("href")).toBe("/inbox");
  expect(link.classes()).toContain("no-underline");
  expect(link.element.parentElement?.tagName).toBe("LI");
});

test("it should forward linkProps to linkAs", () => {
  const wrapper = mount(ListItem, {
    props: {
      href: "/inbox",
      primary: "Inbox",
      linkAs: InertiaLink,
      linkProps: { method: "post" },
    },
  });

  const link = wrapper.get("button");

  expect(link.element.tagName).toBe("BUTTON");
  expect(link.attributes("type")).toBe("button");
  expect(link.element.parentElement?.tagName).toBe("LI");
});

test("it should keep a div root when as is div and linkAs is set", () => {
  const wrapper = mount(ListItem, {
    props: {
      as: "div",
      href: "/inbox",
      primary: "Inbox",
      linkAs: InertiaLink,
    },
  });

  const link = wrapper.get("a");

  expect(wrapper.element.tagName).toBe("DIV");
  expect(link.element.parentElement?.tagName).toBe("DIV");
});

test("it should keep a native anchor when linkAs is set and the item is disabled", () => {
  const wrapper = mount(ListItem, {
    props: {
      disabled: true,
      href: "/archive",
      primary: "Archive",
      linkAs: InertiaLink,
    },
  });

  expect(wrapper.get("a").attributes("href")).toBeUndefined();
});
