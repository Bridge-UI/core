// ** External Imports
import { Info } from "@lucide/vue";
import { mount } from "@vue/test-utils";
import { expect, test } from "vitest";
import { defineComponent, h } from "vue";

// ** Local Imports
import { Link } from "@/Components/Link";

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

test("it should render as an anchor with default slot content", () => {
  const wrapper = mount(Link, {
    props: { href: "/docs" },
    slots: { default: "Documentation" },
  });

  const anchor = wrapper.find("a");

  expect(anchor.exists()).toBe(true);
  expect(anchor.attributes("href")).toBe("/docs");
  expect(wrapper.text()).toContain("Documentation");
});

test("it should apply aria-disabled when disabled", () => {
  const wrapper = mount(Link, {
    slots: { default: "Disabled" },
    props: { href: "/docs", disabled: true },
  });

  const anchor = wrapper.find("a");

  expect(anchor.attributes("href")).toBeUndefined();
  expect(anchor.attributes("aria-disabled")).toBe("true");
});

test("it should open in a new tab when external is true", () => {
  const wrapper = mount(Link, {
    slots: { default: "External" },
    props: { external: true, href: "https://example.com" },
  });

  const anchor = wrapper.find("a");

  expect(anchor.attributes("target")).toBe("_blank");
  expect(anchor.attributes("rel")).toBe("noopener noreferrer");
});

test("it should render left icon when leftIcon prop is set", () => {
  const wrapper = mount(Link, {
    slots: { default: "Docs" },
    props: { href: "/docs", leftIcon: Info },
  });

  expect(wrapper.find("a svg").exists()).toBe(true);
});

test("it should render prepend slot content", () => {
  const wrapper = mount(Link, {
    props: { href: "/docs" },
    slots: {
      prepend: "◀",
      default: "Docs",
    },
  });

  expect(wrapper.text()).toContain("◀");
  expect(wrapper.text()).toContain("Docs");
});

test("it should merge class with root classes", () => {
  const wrapper = mount(Link, {
    slots: { default: "Styled" },
    props: { href: "/docs", class: "custom-link" },
  });

  expect(wrapper.find("a").classes()).toContain("custom-link");
});

test("it should forward fallthrough attrs to the root element", () => {
  const wrapper = mount(Link, {
    slots: { default: "Docs" },
    attrs: {
      href: "/docs",
      id: "link-from-attrs",
      "data-testid": "link-attrs",
    },
  });

  const root = wrapper.find("#link-from-attrs");

  expect(root.exists()).toBe(true);
  expect(root.attributes("data-testid")).toBe("link-attrs");
});

test("it should forward customProps to icon sub-parts", () => {
  const wrapper = mount(Link, {
    slots: { default: "Docs" },
    props: {
      href: "/docs",
      leftIcon: Info,
      customProps: {
        leftIcon: { id: "link-left-icon" },
      },
    },
  });

  expect(wrapper.find("#link-left-icon").exists()).toBe(true);
});

test("it should render linkAs with href and anchor classes", () => {
  const wrapper = mount(Link, {
    slots: { default: "Documentation" },
    props: { href: "/docs", linkAs: RouterLinkStub },
  });

  const link = wrapper.get("[data-testid='router-link']");
  const event = new MouseEvent("click", { bubbles: true, cancelable: true });

  link.element.dispatchEvent(event);

  expect(event.defaultPrevented).toBe(false);
  expect(link.attributes("href")).toBe("/docs");
  expect(link.classes()).toContain("font-medium");
  expect(link.text()).toContain("Documentation");
});

test("it should keep a native anchor when linkAs is set and the link is disabled", () => {
  const wrapper = mount(Link, {
    slots: { default: "Disabled" },
    props: { href: "/docs", disabled: true, linkAs: RouterLinkStub },
  });

  expect(wrapper.find("[data-testid='router-link']").exists()).toBe(false);
  expect(wrapper.get("a").attributes("href")).toBeUndefined();
});
