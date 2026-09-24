// ** External Imports
import { Link as InertiaLink } from "@inertiajs/vue3";
import { flushPromises, mount } from "@vue/test-utils";
import { afterEach, expect, test } from "vitest";
import { defineComponent, h } from "vue";

// ** Local Imports
import { Breadcrumb } from "@/Components/Breadcrumb";
import { BreadcrumbItem } from "@/Components/BreadcrumbItem";

const MarkerLink = defineComponent({
  name: "MarkerLink",
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
          "data-testid": "marker-link",
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

function mountItem(
  options: Parameters<typeof mount<typeof Breadcrumb>>[1] = {},
) {
  const wrapper = mount(Breadcrumb, options);

  mountedWrappers.push(wrapper);

  return wrapper;
}

test("it should mark the current crumb with aria-current", () => {
  const wrapper = mountItem({
    slots: {
      default: () => [
        h(BreadcrumbItem, { href: "/" }, () => "Home"),
        h(BreadcrumbItem, { current: true }, () => "Page"),
      ],
    },
  });

  expect(wrapper.find("[aria-current='page']").element.tagName).toBe("SPAN");
});

test("it should render as an anchor when href is set", () => {
  const wrapper = mountItem({
    slots: {
      default: () => [h(BreadcrumbItem, { href: "/docs" }, () => "Docs")],
    },
  });

  expect(wrapper.find("a[href='/docs']").exists()).toBe(true);
});

test("it should render linkAs with href and anchor classes", () => {
  const wrapper = mountItem({
    slots: {
      default: () => [
        h(
          BreadcrumbItem,
          {
            href: "/docs",
            linkAs: InertiaLink,
            linkProps: { onBefore: () => false },
          },
          () => "Docs",
        ),
      ],
    },
  });

  const link = wrapper.get("a");
  const event = new MouseEvent("click", { bubbles: true, cancelable: true });

  link.element.dispatchEvent(event);

  expect(event.defaultPrevented).toBe(true);
  expect(link.attributes("href")).toBe("/docs");
  expect(link.classes()).toContain("font-medium");
});

test("it should forward linkProps to linkAs", () => {
  const wrapper = mountItem({
    slots: {
      default: () => [
        h(
          BreadcrumbItem,
          {
            href: "/docs",
            linkAs: InertiaLink,
            linkProps: { method: "post" },
          },
          () => "Docs",
        ),
      ],
    },
  });

  const link = wrapper.get("button");

  expect(link.element.tagName).toBe("BUTTON");
  expect(link.attributes("type")).toBe("button");
});

test("it should prefer the item linkAs over the breadcrumb linkAs", () => {
  const wrapper = mountItem({
    props: { linkAs: MarkerLink },
    slots: {
      default: () => [
        h(BreadcrumbItem, { href: "/docs", linkAs: InertiaLink }, () => "Docs"),
      ],
    },
  });

  expect(wrapper.get("a").attributes("href")).toBe("/docs");
  expect(wrapper.find("[data-testid='marker-link']").exists()).toBe(false);
});

test("it should keep the current crumb as a span when linkAs is set", () => {
  const wrapper = mountItem({
    props: { linkAs: InertiaLink },
    slots: {
      default: () => [h(BreadcrumbItem, { current: true }, () => "Settings")],
    },
  });

  expect(wrapper.find("a").exists()).toBe(false);
  expect(wrapper.get("[aria-current='page']").element.tagName).toBe("SPAN");
});
