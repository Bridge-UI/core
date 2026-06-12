// ** External Imports
import { mount } from "@vue/test-utils";
import { CircleAlert } from "lucide-vue-next";
import { expect, test } from "vitest";

// ** Local Imports
import { Button } from "@/Components/Button";

test("it should render a button with default slot content", () => {
  const wrapper = mount(Button, { slots: { default: "Click me" } });

  expect(wrapper.find("button").exists()).toBe(true);
  expect(wrapper.text()).toContain("Click me");
});

test("it should apply disabled attribute when disabled", () => {
  const wrapper = mount(Button, {
    props: { disabled: true },
    slots: { default: "Disabled" },
  });

  expect(wrapper.find("button").attributes("disabled")).toBeDefined();
});

test("it should show loading spinner when loading", () => {
  const wrapper = mount(Button, {
    props: { loading: true },
    slots: { default: "Saving" },
  });

  expect(wrapper.text()).not.toContain("Saving");
  expect(wrapper.find("svg.animate-spin").exists()).toBe(true);
  expect(wrapper.find("button").attributes("aria-busy")).toBe("true");
});

test("it should render text prop when default slot is not used", () => {
  const wrapper = mount(Button, { props: { text: "Click me" } });

  expect(wrapper.text()).toContain("Click me");
  expect(wrapper.find("button").exists()).toBe(true);
});

test("it should prefer text prop over default slot", () => {
  const wrapper = mount(Button, {
    props: { text: "From prop" },
    slots: { default: "From slot" },
  });

  expect(wrapper.text()).toContain("From prop");
  expect(wrapper.text()).not.toContain("From slot");
});

test("it should replace text with spinner when loading", () => {
  const wrapper = mount(Button, {
    props: { loading: true, text: "Saving" },
  });

  expect(wrapper.find("svg.animate-spin").exists()).toBe(true);
  expect(wrapper.text()).not.toContain("Saving");
});

test("it should render start icon when startIcon prop is set", () => {
  const wrapper = mount(Button, {
    slots: { default: "With icon" },
    props: { startIcon: CircleAlert },
  });

  expect(wrapper.find("button svg").exists()).toBe(true);
});

test("it should render as anchor when as is a", () => {
  const wrapper = mount(Button, {
    slots: { default: "Link" },
    props: { as: "a", href: "https://example.com" },
  });

  const anchor = wrapper.find("a");

  expect(anchor.exists()).toBe(true);
  expect(anchor.attributes("href")).toBe("https://example.com");
});

test("it should apply full width class when full is true", () => {
  const wrapper = mount(Button, {
    props: { full: true },
    slots: { default: "Full" },
  });

  expect(wrapper.find("button").classes()).toContain("w-full");
});

test("it should render start slot content", () => {
  const wrapper = mount(Button, {
    slots: {
      start: "◀",
      default: "Label",
    },
  });

  expect(wrapper.text()).toContain("◀");
  expect(wrapper.text()).toContain("Label");
});

test("it should merge class with root classes", () => {
  const wrapper = mount(Button, {
    slots: { default: "Styled" },
    props: { class: "custom-button" },
  });

  expect(wrapper.find("button").classes()).toContain("custom-button");
});

test("it should forward additional attributes to the root element", () => {
  const wrapper = mount(Button, {
    slots: { default: "Submit" },
    props: {
      id: "submit-btn",
      "data-testid": "button",
    },
  });

  const button = wrapper.find("#submit-btn");

  expect(button.exists()).toBe(true);
  expect(button.attributes("data-testid")).toBe("button");
});

test("it should forward fallthrough attrs to the root element", () => {
  const wrapper = mount(Button, {
    slots: { default: "Submit" },
    attrs: {
      id: "button-from-attrs",
      "data-testid": "button-attrs",
    },
  });

  const root = wrapper.find("#button-from-attrs");

  expect(root.exists()).toBe(true);
  expect(root.attributes("data-testid")).toBe("button-attrs");
});

test("it should forward customProps to icon sub-parts", () => {
  const wrapper = mount(Button, {
    slots: { default: "Save" },
    props: {
      startIcon: CircleAlert,
      customProps: {
        endIcon: { id: "end-icon" },
        startIcon: { id: "start-icon" },
      },
    },
  });

  expect(wrapper.find("#start-icon").exists()).toBe(true);
});

test("it should forward customProps to slot wrappers", () => {
  const wrapper = mount(Button, {
    slots: {
      start: "◀",
      default: "Label",
    },
    props: {
      customProps: {
        start: { "data-testid": "start-slot" },
      },
    },
  });

  expect(wrapper.find('[data-testid="start-slot"]').exists()).toBe(true);
});

test("it should apply user class after classes.root (tailwind-merge)", () => {
  const wrapper = mount(Button, {
    slots: { default: "Priority" },
    props: {
      class: "p-4",
      classes: { root: "p-2" },
    },
  });

  const root = wrapper.find("button");

  expect(root.classes()).toContain("p-4");
  expect(root.classes()).not.toContain("p-2");
});
