// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test } from "vitest";

// ** Local Imports
import { Alert } from "@/Components/Alert";

test("it should render the root element", () => {
  const wrapper = mount(Alert);

  expect(wrapper.find(".w-full").exists()).toBe(true);
});

test("it should render a title when title prop is provided", () => {
  const wrapper = mount(Alert, { props: { title: "Heads up!" } });

  expect(wrapper.text()).toContain("Heads up!");
});

test("it should render body content via default slot", () => {
  const wrapper = mount(Alert, {
    props: { title: "Info" },
    slots: { default: "This is the body content" },
  });

  expect(wrapper.text()).toContain("This is the body content");
});

test("it should render the default icon for error color", () => {
  const wrapper = mount(Alert, { props: { title: "Error", color: "error" } });

  expect(wrapper.find("svg").exists()).toBe(true);
});

test("it should not render an icon when icon is null", () => {
  const wrapper = mount(Alert, { props: { icon: null, title: "No icon" } });

  expect(wrapper.find("svg").exists()).toBe(false);
});

test("it should apply rounded classes when rounded prop is set", () => {
  const wrapper = mount(Alert, { props: { rounded: "lg", title: "Rounded" } });

  expect(wrapper.find(".w-full").classes()).toContain("rounded-lg");
});

test("it should apply shadow classes when shadow prop is set", () => {
  const wrapper = mount(Alert, { props: { shadow: "md", title: "Shadow" } });

  expect(wrapper.find(".w-full").classes()).toContain("shadow-md");
});

test("it should render footer slot content", () => {
  const wrapper = mount(Alert, {
    props: { title: "With footer" },
    slots: { footer: "Footer content" },
  });

  expect(wrapper.text()).toContain("Footer content");
});

test("it should render action slot content", () => {
  const wrapper = mount(Alert, {
    slots: { action: "Dismiss" },
    props: { title: "With action" },
  });

  expect(wrapper.text()).toContain("Dismiss");
});

test("it should merge class with root classes", () => {
  const wrapper = mount(Alert, {
    props: { title: "Custom class", class: "custom-alert" },
  });

  expect(wrapper.find(".w-full").classes()).toContain("custom-alert");
});

test("it should forward additional attributes to the root element", () => {
  const wrapper = mount(Alert, {
    props: {
      title: "With id",
      id: "alert-root",
      "data-testid": "alert",
    },
  });

  const root = wrapper.find("#alert-root");

  expect(root.exists()).toBe(true);
  expect(root.attributes("data-testid")).toBe("alert");
});

test("it should forward fallthrough attrs to the root element", () => {
  const wrapper = mount(Alert, {
    props: { title: "With attrs" },
    attrs: {
      id: "alert-from-attrs",
      "data-testid": "alert-attrs",
    },
  });

  const root = wrapper.find("#alert-from-attrs");

  expect(root.exists()).toBe(true);
  expect(root.attributes("data-testid")).toBe("alert-attrs");
});

test("it should forward customProps to the default icon", () => {
  const wrapper = mount(Alert, {
    props: {
      title: "Notice",
      customProps: {
        icon: { id: "alert-icon" },
      },
    },
  });

  expect(wrapper.find("#alert-icon").exists()).toBe(true);
});

test("it should forward customProps to title and body containers", () => {
  const wrapper = mount(Alert, {
    slots: { default: "Body text" },
    props: {
      title: "Title",
      customProps: {
        body: { id: "alert-body" },
        title: { id: "alert-title" },
      },
    },
  });

  expect(wrapper.find("#alert-body").exists()).toBe(true);
  expect(wrapper.find("#alert-title").exists()).toBe(true);
});

test("it should apply user class after classes.root (tailwind-merge)", () => {
  const wrapper = mount(Alert, {
    props: {
      class: "p-4",
      title: "Priority",
      classes: { root: "p-2" },
    },
  });

  const root = wrapper.find(".w-full");

  expect(root.classes()).toContain("p-4");
  expect(root.classes()).not.toContain("p-2");
});
