// ** External Imports
import { mount } from "@vue/test-utils";
import { Info } from "lucide-vue-next";
import { expect, test } from "vitest";
import { defineComponent, h } from "vue";

// ** Local Imports
import { useLink, type LinkOwnProps, type LinkProps } from "@/Components/Link";

const libDefaults: Partial<LinkOwnProps> = {
  size: "md",
  color: "primary",
  underline: "hover",
};

function mountUseLink(props: LinkProps = {}) {
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
  const { isDisabled } = mountUseLink({ disabled: true });

  expect(isDisabled.value).toBe(true);
});

test("it should show left icon when leftIcon is set", () => {
  const { showLeftIcon } = mountUseLink({ leftIcon: Info });

  expect(showLeftIcon.value).toBe(true);
});

test("it should apply hover underline classes by default", () => {
  const { rootClass } = mountUseLink();

  expect(rootClass.value).toContain("hover:underline");
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

test("it should apply class after classes.root in rootClass", () => {
  const { rootClass } = mountUseLink({
    class: "p-4",
    classes: { root: "p-2" },
  });

  expect(rootClass.value).toContain("p-4");
  expect(rootClass.value).not.toContain("p-2");
});
