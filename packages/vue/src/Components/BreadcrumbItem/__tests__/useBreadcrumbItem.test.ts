// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test } from "vitest";
import { defineComponent, h } from "vue";

// ** Local Imports
import { Breadcrumb } from "@/Components/Breadcrumb";
import { useBreadcrumbItem } from "@/Components/BreadcrumbItem/composables/useBreadcrumbItem";

function mountUseBreadcrumbItem(
  props: Parameters<typeof useBreadcrumbItem>[0],
) {
  let result!: ReturnType<typeof useBreadcrumbItem>;

  const ItemHost = defineComponent({
    setup() {
      result = useBreadcrumbItem(props);

      return () => h("div");
    },
  });

  const Wrapper = defineComponent({
    setup() {
      return () =>
        h(Breadcrumb, null, {
          default: () => h(ItemHost),
        });
    },
  });

  mount(Wrapper);

  return { result };
}

test("it should resolve crumb as anchor when href is set", () => {
  const { result } = mountUseBreadcrumbItem({
    href: "/docs",
  });

  expect(result.crumbAs.value).toBe("a");
  expect(result.linkBind.value.href).toBe("/docs");
});

test("it should resolve crumb as span when current", () => {
  const { result } = mountUseBreadcrumbItem({
    current: true,
  });

  expect(result.crumbAs.value).toBe("span");
  expect(result.linkBind.value["aria-current"]).toBe("page");
});
