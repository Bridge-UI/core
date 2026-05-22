// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test } from "vitest";
import { defineComponent, h } from "vue";

// ** Local Imports
import { useLink, type LinkOwnProps } from "@/Components/Link";

const libDefaults = {
  size: "md",
  color: "primary",
  underline: "hover",
} satisfies Partial<LinkOwnProps>;

function mountUseLink(props: Partial<LinkOwnProps> = {}) {
  let result!: ReturnType<typeof useLink>;

  const Wrapper = defineComponent({
    setup() {
      result = useLink(props, libDefaults);

      return () => h("div");
    },
  });

  mount(Wrapper);

  return result;
}

test("it should merge default color", () => {
  const { merged } = mountUseLink();

  expect(merged.value.color).toBe("primary");
});

test("it should be disabled when disabled prop is true", () => {
  const { merged, rootHref, rootAriaDisabled } = mountUseLink({
    href: "/docs",
    disabled: true,
  });

  expect(rootHref.value).toBeUndefined();
  expect(merged.value.disabled).toBe(true);
  expect(rootAriaDisabled.value).toBe(true);
});

test("it should apply hover underline classes by default", () => {
  const { rootBind } = mountUseLink();

  expect(rootBind.value.class).toContain("no-underline");
  expect(rootBind.value.class).toContain("hover:underline");
});

test("it should apply none underline when underline is none", () => {
  const { rootBind } = mountUseLink({ underline: "none" });

  expect(rootBind.value.class).toContain("no-underline");
  expect(rootBind.value.class).not.toContain("hover:underline");
});

test("it should expose rootBind for additional attributes", () => {
  const { rootBind, merged } = mountUseLink({
    href: "/docs",
    id: "docs-link",
    "data-testid": "link",
  });

  expect(merged.value.href).toBe("/docs");
  expect(rootBind.value.id).toBe("docs-link");
});

test("it should apply class after classes.root in root bind", () => {
  const { rootBind } = mountUseLink({
    class: "p-4",
    classes: { root: "p-2" },
  });

  expect(rootBind.value.class).toContain("p-4");
  expect(rootBind.value.class).not.toContain("p-2");
});
