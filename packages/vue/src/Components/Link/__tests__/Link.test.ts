// ** External Imports
import { mount } from "@vue/test-utils";
import { Info } from "lucide-vue-next";
import { expect, test } from "vitest";

// ** Local Imports
import { Link } from "@/Components/Link";

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
