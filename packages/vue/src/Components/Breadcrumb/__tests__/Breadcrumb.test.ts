// ** External Imports
import { flushPromises, mount } from "@vue/test-utils";
import { afterEach, expect, test } from "vitest";
import { defineComponent, h } from "vue";

// ** Local Imports
import { Breadcrumb } from "@/Components/Breadcrumb";
import { BreadcrumbItem } from "@/Components/BreadcrumbItem";

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

afterEach(async () => {
  while (mountedWrappers.length > 0) {
    mountedWrappers.pop()?.unmount();
  }

  await flushPromises();
});

const mountedWrappers: Array<ReturnType<typeof mount<typeof Breadcrumb>>> = [];

function mountBreadcrumb(
  options: Parameters<typeof mount<typeof Breadcrumb>>[1] = {},
) {
  const wrapper = mount(Breadcrumb, options);

  mountedWrappers.push(wrapper);

  return wrapper;
}

test("it should render a nav list with crumbs", () => {
  const wrapper = mountBreadcrumb({
    slots: {
      default: () => [
        h(BreadcrumbItem, { href: "/" }, () => "Home"),
        h(BreadcrumbItem, { href: "/docs" }, () => "Docs"),
        h(BreadcrumbItem, { current: true }, () => "Avatar"),
      ],
    },
  });

  expect(wrapper.find("nav[aria-label='Breadcrumb']").exists()).toBe(true);
  expect(wrapper.find("a[href='/']").text()).toContain("Home");
  expect(wrapper.find("[aria-current='page']").text()).toContain("Avatar");
});

test("it should render from items data", () => {
  const wrapper = mountBreadcrumb({
    props: {
      items: [
        { href: "/", label: "Home" },
        { href: "/docs", label: "Docs" },
        { current: true, label: "Avatar" },
      ],
    },
  });

  expect(wrapper.find("a[href='/docs']").text()).toContain("Docs");
  expect(wrapper.find("[aria-current='page']").text()).toContain("Avatar");
});

test("it should collapse middle items when maxItems is set", () => {
  const wrapper = mountBreadcrumb({
    props: {
      maxItems: 3,
      items: [
        { href: "/", label: "Home" },
        { href: "/a", label: "A" },
        { href: "/b", label: "B" },
        { href: "/c", label: "C" },
        { label: "Page", current: true },
      ],
    },
  });

  expect(wrapper.text()).toContain("Home");
  expect(wrapper.text()).toContain("…");
  expect(wrapper.text()).toContain("Page");
  expect(wrapper.text()).not.toContain("A");
});

test("it should render an icon-only crumb with aria-label", () => {
  const wrapper = mountBreadcrumb({
    slots: {
      default: () => [
        h(BreadcrumbItem, {
          href: "/",
          startIcon: "user",
          "aria-label": "Home",
        }),
        h(BreadcrumbItem, { current: true }, () => "Page"),
      ],
    },
  });

  expect(wrapper.find("a[aria-label='Home']").exists()).toBe(true);
  expect(wrapper.find("a[aria-label='Home']").text()).toBe("");
});

test("it should pass linkAs to crumbs rendered from items", () => {
  const wrapper = mountBreadcrumb({
    props: {
      linkAs: RouterLinkStub,
      items: [
        { href: "/", label: "Home" },
        { current: true, label: "Settings" },
      ],
    },
  });

  const link = wrapper.get("[data-testid='router-link']");

  expect(link.attributes("href")).toBe("/");
  expect(link.classes()).toContain("font-medium");
  expect(wrapper.findAll("[data-testid='router-link']")).toHaveLength(1);
  expect(wrapper.get("[aria-current='page']").element.tagName).toBe("SPAN");
});
