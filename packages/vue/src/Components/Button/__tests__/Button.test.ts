// ** External Imports
import { CircleAlert } from "@lucide/vue";
import { mount } from "@vue/test-utils";
import { expect, test } from "vitest";
import { defineComponent, h } from "vue";

// ** Local Imports
import { Button } from "@/Components/Button";

const RouterLinkStub = defineComponent({
  name: "RouterLinkStub",
  props: {
    href: String,
  },
  setup(props, { attrs, slots }) {
    return () => {
      return h(
        "a",
        {
          ...attrs,
          href: props.href,
          "data-testid": "router-link",
        },
        slots.default?.(),
      );
    };
  },
});

test("it should render a button with default slot content", () => {
  const wrapper = mount(Button, { slots: { default: "Click me" } });

  expect(wrapper.text()).toContain("Click me");
  expect(wrapper.find("button").exists()).toBe(true);
});

test("it should apply disabled attribute when disabled", () => {
  const wrapper = mount(Button, {
    props: { disabled: true },
    slots: { default: "Disabled" },
  });

  expect(wrapper.find("button").attributes("disabled")).toBeDefined();
});

test("it should keep label text in the DOM when loading", () => {
  const wrapper = mount(Button, {
    props: { loading: true },
    slots: { default: "Saving" },
  });

  expect(wrapper.text()).toContain("Saving");
  expect(wrapper.find("span.invisible").exists()).toBe(true);
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

test("it should keep text prop in the DOM when loading", () => {
  const wrapper = mount(Button, {
    props: { loading: true, text: "Saving" },
  });

  expect(wrapper.text()).toContain("Saving");
  expect(wrapper.find("span.invisible").exists()).toBe(true);
  expect(wrapper.find("svg.animate-spin").exists()).toBe(true);
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

test("it should default type to button", () => {
  const wrapper = mount(Button, {
    slots: { default: "Default" },
  });

  expect(wrapper.find("button").attributes("type")).toBe("button");
});

test("it should respect type submit", () => {
  const wrapper = mount(Button, {
    attrs: { type: "submit" },
    slots: { default: "Save" },
  });

  expect(wrapper.find("button").attributes("type")).toBe("submit");
});

test("it should respect type reset", () => {
  const wrapper = mount(Button, {
    attrs: { type: "reset" },
    slots: { default: "Cancel" },
  });

  expect(wrapper.find("button").attributes("type")).toBe("reset");
});

test("it should omit type when rendered as an anchor", () => {
  const wrapper = mount(Button, {
    slots: { default: "Link" },
    props: { as: "a", href: "https://example.com" },
  });

  expect(wrapper.find("a").attributes("type")).toBeUndefined();
});

test("it should mark the button as pressed when selected", () => {
  const wrapper = mount(Button, {
    slots: { default: "Bold" },
    props: { selected: true, variant: "outline" },
  });

  expect(wrapper.find("button").attributes("aria-pressed")).toBe("true");
  expect(wrapper.find("button").classes()).toContain("bg-primary-400/25");
});

test("it should render linkAs with href and anchor classes", () => {
  const wrapper = mount(Button, {
    slots: { default: "Settings" },
    props: { href: "/settings", linkAs: RouterLinkStub },
  });

  const link = wrapper.get("[data-testid='router-link']");
  const event = new MouseEvent("click", { bubbles: true, cancelable: true });

  link.element.dispatchEvent(event);

  expect(event.defaultPrevented).toBe(false);
  expect(link.attributes("href")).toBe("/settings");
  expect(link.classes()).toContain("inline-flex");
});

test("it should ignore linkAs when as is button", () => {
  const wrapper = mount(Button, {
    slots: { default: "Settings" },
    props: { as: "button", href: "/settings", linkAs: RouterLinkStub },
  });

  expect(wrapper.find("button").exists()).toBe(true);
  expect(wrapper.find("[data-testid='router-link']").exists()).toBe(false);
});

test("it should keep a native anchor when linkAs is set and the button is disabled", () => {
  const wrapper = mount(Button, {
    slots: { default: "Settings" },
    props: { disabled: true, href: "/settings", linkAs: RouterLinkStub },
  });

  expect(wrapper.find("[data-testid='router-link']").exists()).toBe(false);
  expect(wrapper.get("a").attributes("href")).toBeUndefined();
});
