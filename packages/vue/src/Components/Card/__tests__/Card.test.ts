// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test } from "vitest";
import { h } from "vue";

// ** Local Imports
import { Card } from "@/Components/Card";
import BridgeUIProvider from "@/Provider/BridgeUIProvider.vue";

test("it should render the root element", () => {
  const wrapper = mount(Card);

  expect(wrapper.find(".flex.w-full.flex-col").exists()).toBe(true);
});

test("it should render a title when title prop is provided", () => {
  const wrapper = mount(Card, { props: { title: "Card title" } });

  expect(wrapper.text()).toContain("Card title");
});

test("it should render body content via default slot", () => {
  const wrapper = mount(Card, {
    props: { title: "Info" },
    slots: { default: "This is the body content" },
  });

  expect(wrapper.text()).toContain("This is the body content");
});

test("it should apply rounded classes when rounded prop is set", () => {
  const wrapper = mount(Card, { props: { rounded: "lg", title: "Rounded" } });

  expect(wrapper.find(".flex.w-full").classes()).toContain("rounded-lg");
});

test("it should apply shadow classes for elevated variant", () => {
  const wrapper = mount(Card, {
    props: { shadow: "md", title: "Shadow", variant: "elevated" },
  });

  expect(wrapper.find(".flex.w-full").classes()).toContain("shadow-md");
});

test("it should not apply shadow for flat variant", () => {
  const wrapper = mount(Card, {
    props: { shadow: "md", title: "Flat", variant: "flat" },
  });

  const rootClasses = wrapper.find(".flex.w-full").classes().join(" ");

  expect(rootClasses.includes("shadow")).toBe(false);
});

test("it should apply outlined border on root", () => {
  const wrapper = mount(Card, {
    props: { title: "Outlined", variant: "outlined" },
  });

  expect(wrapper.find(".flex.w-full").classes()).toContain("border");
});

test("it should render footer slot content", () => {
  const wrapper = mount(Card, {
    props: { title: "With footer" },
    slots: { footer: "Footer content" },
  });

  expect(wrapper.text()).toContain("Footer content");
});

test("it should render action slot content", () => {
  const wrapper = mount(Card, {
    props: { title: "With action" },
    slots: { action: '<button type="button">Action</button>' },
  });

  expect(wrapper.text()).toContain("Action");
});

test("it should render header slot content", () => {
  const wrapper = mount(Card, {
    slots: {
      default: "Body",
      header: "<span>Custom header</span>",
    },
  });

  expect(wrapper.text()).toContain("Custom header");
});

test("it should merge class with root classes", () => {
  const wrapper = mount(Card, {
    props: { class: "custom-card", title: "Custom class" },
  });

  expect(wrapper.find(".flex.w-full").classes()).toContain("custom-card");
});

test("it should forward additional attributes to the root element", () => {
  const wrapper = mount(Card, {
    props: {
      id: "card-root",
      title: "With id",
      "data-testid": "card",
    },
  });

  const root = wrapper.find("#card-root");

  expect(root.exists()).toBe(true);
  expect(root.attributes("data-testid")).toBe("card");
});

test("it should forward fallthrough attrs to the root element", () => {
  const wrapper = mount(Card, {
    props: { title: "With attrs" },
    attrs: {
      id: "card-from-attrs",
      "data-testid": "card-attrs",
    },
  });

  const root = wrapper.find("#card-from-attrs");

  expect(root.exists()).toBe(true);
  expect(root.attributes("data-testid")).toBe("card-attrs");
});

test("it should forward customProps to title and body containers", () => {
  const wrapper = mount(Card, {
    slots: { default: "Body text" },
    props: {
      title: "Title",
      customProps: {
        body: { id: "card-body" },
        title: { id: "card-title" },
      },
    },
  });

  expect(wrapper.find("#card-body").exists()).toBe(true);
  expect(wrapper.find("#card-title").exists()).toBe(true);
});

test("it should forward customProps to footer container", () => {
  const wrapper = mount(Card, {
    slots: { footer: "Footer" },
    props: {
      title: "Title",
      customProps: { footer: { id: "card-footer" } },
    },
  });

  expect(wrapper.find("#card-footer").exists()).toBe(true);
});

test("it should apply user class after classes.root (tailwind-merge)", () => {
  const wrapper = mount(Card, {
    props: {
      class: "p-4",
      title: "Priority",
      classes: { root: "p-2" },
    },
  });

  const root = wrapper.find(".flex.w-full");

  expect(root.classes()).toContain("p-4");
  expect(root.classes()).not.toContain("p-2");
});

test("it should omit header border when borderless is true", () => {
  const wrapper = mount(Card, {
    props: { borderless: true, title: "Borderless" },
  });

  expect(wrapper.find(".border-b").exists()).toBe(false);
});

test("it should follow the Text size from the provider", () => {
  const wrapper = mount(BridgeUIProvider, {
    props: { components: { Text: { defaultProps: { size: "xs" } } } },
    slots: {
      default: () => {
        return h(
          Card,
          {
            title: "Title",
            customProps: {
              body: { id: "card-body" },
              title: { id: "card-title" },
            },
          },
          { default: () => "Body text" },
        );
      },
    },
  });

  expect(wrapper.find("#card-body").classes()).toContain("text-xs");
  expect(wrapper.find("#card-title").classes()).toContain("text-xs");
});

test("it should let classes override the title and body size", () => {
  const wrapper = mount(Card, {
    slots: { default: "Body text" },
    props: {
      title: "Title",
      classes: { title: "text-lg", body: "text-base" },
      customProps: {
        body: { id: "card-body" },
        title: { id: "card-title" },
      },
    },
  });

  expect(wrapper.find("#card-title").classes()).toContain("text-lg");
  expect(wrapper.find("#card-title").classes()).not.toContain("text-sm");
  expect(wrapper.find("#card-body").classes()).toContain("text-base");
  expect(wrapper.find("#card-body").classes()).not.toContain("text-sm");
});

test("it should size the title and body with the Text default size", () => {
  const wrapper = mount(Card, {
    slots: { default: "Body text" },
    props: {
      title: "Title",
      customProps: {
        body: { id: "card-body" },
        title: { id: "card-title" },
      },
    },
  });

  expect(wrapper.find("#card-body").classes()).toContain("text-sm");
  expect(wrapper.find("#card-title").classes()).toContain("text-sm");
});

test("it should ignore the Text weight from the provider", () => {
  const wrapper = mount(BridgeUIProvider, {
    props: { components: { Text: { defaultProps: { weight: "bold" } } } },
    slots: {
      default: () => {
        return h(
          Card,
          { title: "Title", customProps: { body: { id: "card-body" } } },
          { default: () => "Body text" },
        );
      },
    },
  });

  const body = wrapper.find("#card-body");

  expect(body.classes()).toContain("font-normal");
  expect(body.classes()).not.toContain("font-bold");
});
