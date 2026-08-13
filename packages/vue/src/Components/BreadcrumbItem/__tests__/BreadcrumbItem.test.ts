// ** External Imports
import { flushPromises, mount } from "@vue/test-utils";
import { afterEach, expect, test } from "vitest";
import { h } from "vue";

// ** Local Imports
import { Breadcrumb } from "@/Components/Breadcrumb";
import { BreadcrumbItem } from "@/Components/BreadcrumbItem";

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
