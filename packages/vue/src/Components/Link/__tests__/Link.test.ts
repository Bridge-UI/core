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
    props: { href: "/docs", disabled: true },
    slots: { default: "Disabled" },
  });

  const anchor = wrapper.find("a");

  expect(anchor.attributes("aria-disabled")).toBe("true");
  expect(anchor.attributes("href")).toBeUndefined();
});

test("it should open in a new tab when external is true", () => {
  const wrapper = mount(Link, {
    props: { href: "https://example.com", external: true },
    slots: { default: "External" },
  });

  const anchor = wrapper.find("a");

  expect(anchor.attributes("target")).toBe("_blank");
  expect(anchor.attributes("rel")).toBe("noopener noreferrer");
});

test("it should render left icon when leftIcon prop is set", () => {
  const wrapper = mount(Link, {
    props: { href: "/docs", leftIcon: Info },
    slots: { default: "Docs" },
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
    props: { href: "/docs", class: "custom-link" },
    slots: { default: "Styled" },
  });

  expect(wrapper.find("a").classes()).toContain("custom-link");
});

test("it should forward fallthrough attrs to the root element", () => {
  const wrapper = mount(Link, {
    slots: { default: "Docs" },
    attrs: {
      id: "link-from-attrs",
      href: "/docs",
      "data-testid": "link-attrs",
    },
  });

  const root = wrapper.find("#link-from-attrs");

  expect(root.exists()).toBe(true);
  expect(root.attributes("data-testid")).toBe("link-attrs");
});

test("it should forward partsProps to icon sub-parts", () => {
  const wrapper = mount(Link, {
    props: {
      href: "/docs",
      leftIcon: Info,
      partsProps: {
        leftIcon: { id: "link-left-icon" },
      },
    },
    slots: { default: "Docs" },
  });

  expect(wrapper.find("#link-left-icon").exists()).toBe(true);
});
