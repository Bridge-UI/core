// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test } from "vitest";
import { defineComponent, h } from "vue";

// ** Local Imports
import type { BreadcrumbOwnProps } from "@/Components/Breadcrumb/breadcrumb.types";
import { useBreadcrumb } from "@/Components/Breadcrumb/composables/useBreadcrumb";

const libDefaults = {
  size: "md",
  separator: "chevronRight",
} as const;

function mountUseBreadcrumb(props: Partial<BreadcrumbOwnProps> = {}) {
  let result!: ReturnType<typeof useBreadcrumb>;

  const Wrapper = defineComponent({
    setup() {
      result = useBreadcrumb(
        props,
        libDefaults as Parameters<typeof useBreadcrumb>[1],
      );

      return () => h("div");
    },
  });

  mount(Wrapper);

  return { result };
}

test("it should expose defaults from useBreadcrumb", () => {
  const { result } = mountUseBreadcrumb();

  expect(result.contextValue.value.separator).toBe("chevronRight");
  expect(result.contextValue.value.tokenClasses.iconSize).toBe("md");
  expect(result.rootBind.value["aria-label"]).toBe("Breadcrumb");
});

test("it should collapse items when maxItems is set", () => {
  const { result } = mountUseBreadcrumb({
    maxItems: 3,
    items: [
      { href: "/", label: "Home" },
      { href: "/a", label: "A" },
      { href: "/b", label: "B" },
      { label: "Page", current: true },
    ],
  });

  expect(result.collapsedItems.value).toEqual([
    {
      index: 0,
      type: "item",
      item: { href: "/", label: "Home" },
    },
    { type: "ellipsis" },
    {
      index: 3,
      type: "item",
      item: { label: "Page", current: true },
    },
  ]);
});
