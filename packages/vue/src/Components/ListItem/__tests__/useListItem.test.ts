// ** External Imports
import { Star } from "@lucide/vue";
import { mount } from "@vue/test-utils";
import { expect, test } from "vitest";
import { computed, defineComponent, h, provide } from "vue";

// ** Local Imports
import { LIST_INJECTION_KEY } from "@/Components/List";
import { useListItem, type ListItemOwnProps } from "@/Components/ListItem";
import BridgeUIProvider from "@/Provider/BridgeUIProvider.vue";

const libDefaults = {
  role: "button",
} as const satisfies Partial<ListItemOwnProps>;

function mountUseListItem(
  props: Partial<ListItemOwnProps> = {},
  slots: Record<string, () => unknown> = {},
  options: { registrySelectedIcon?: null | typeof Star } = {},
) {
  let result!: ReturnType<typeof useListItem>;

  const Consumer = defineComponent({
    setup() {
      result = useListItem(
        props,
        libDefaults,
        slots as Parameters<typeof useListItem>[2],
      );

      return () => h("div");
    },
  });

  if (!("registrySelectedIcon" in options)) {
    mount(Consumer);

    return result;
  }

  mount(BridgeUIProvider, {
    slots: {
      default: () => h(Consumer),
    },
    props: {
      components: {
        ListItem: {
          defaultProps: { selectedIcon: options.registrySelectedIcon },
        },
      },
    },
  });

  return result;
}

test("it should return default role as button", () => {
  const { merged } = mountUseListItem();

  expect(merged.value.role).toBe("button");
});

test("it should override role when prop is passed", () => {
  const { merged } = mountUseListItem({ role: "menuitem" });

  expect(merged.value.role).toBe("menuitem");
});

test("it should expose interactive bind when interactive is true", () => {
  const { interactiveBind } = mountUseListItem({
    interactive: true,
    primary: "Action",
  });

  expect(interactiveBind.value?.role).toBe("button");
  expect(interactiveBind.value?.class).toContain("px-2");
  expect(interactiveBind.value?.class).toContain("min-h-8");
  expect(interactiveBind.value?.class).toContain("rounded-lg");
  expect(interactiveBind.value?.class).toContain("cursor-pointer");
});

test("it should use a compact rounded hit target when List is iconOnly", () => {
  let result!: ReturnType<typeof useListItem>;

  const Consumer = defineComponent({
    setup() {
      result = useListItem(
        { primary: "Home", interactive: true },
        libDefaults,
        {},
      );

      return () => h("div");
    },
  });

  const Wrapper = defineComponent({
    setup() {
      provide(
        LIST_INJECTION_KEY,
        computed(() => {
          return { dense: false, iconOnly: true };
        }),
      );

      return () => h(Consumer);
    },
  });

  mount(Wrapper);

  expect(result.interactiveBind.value?.class).toContain("h-8");
  expect(result.interactiveBind.value?.class).toContain("w-full");
  expect(result.interactiveBind.value?.class).toContain("px-2");
  expect(result.interactiveBind.value?.class).not.toContain("size-8");
  expect(result.interactiveBind.value?.class).not.toContain("justify-center");
  expect(result.interactiveBind.value?.class).toContain("rounded-lg");
  expect(result.tooltipContent.value).toBeUndefined();
});

test("it should collapse secondary rows to a square hit when List is iconOnly", () => {
  let result!: ReturnType<typeof useListItem>;

  const Consumer = defineComponent({
    setup() {
      result = useListItem(
        {
          interactive: true,
          primary: "Acme Inc",
          secondary: "Enterprise",
        },
        libDefaults,
        {},
      );

      return () => h("div");
    },
  });

  const Wrapper = defineComponent({
    setup() {
      provide(
        LIST_INJECTION_KEY,
        computed(() => {
          return { dense: false, iconOnly: true };
        }),
      );

      return () => h(Consumer);
    },
  });

  mount(Wrapper);

  expect(result.interactiveBind.value?.class).toContain("size-8");
  expect(result.interactiveBind.value?.class).not.toContain("px-2");
  expect(result.interactiveBind.value?.class).not.toContain("w-full");
});

test("it should use a taller hit target when secondary text is set", () => {
  const { interactiveBind } = mountUseListItem({
    interactive: true,
    primary: "Acme Inc",
    secondary: "Enterprise",
  });

  expect(interactiveBind.value?.class).toContain("min-h-12");
  expect(interactiveBind.value?.class).toContain("py-2");
  expect(interactiveBind.value?.class).not.toContain("min-h-8");
});

test("it should expose tooltip content when tooltip is set", () => {
  const { tooltipContent, tooltipPlacement } = mountUseListItem({
    primary: "Home",
    tooltip: "Home",
    interactive: true,
    tooltipPlacement: "right",
  });

  expect(tooltipContent.value).toBe("Home");
  expect(tooltipPlacement.value).toBe("right");
});

test("it should apply dense padding on interactive bind", () => {
  const { interactiveBind } = mountUseListItem({
    dense: true,
    interactive: true,
    primary: "Dense item",
  });

  expect(interactiveBind.value?.class).toContain("min-h-7");
  expect(interactiveBind.value?.class).not.toContain("min-h-8");
});

test("it should inherit dense padding from parent List context", () => {
  let result!: ReturnType<typeof useListItem>;

  const Consumer = defineComponent({
    setup() {
      result = useListItem(
        { role: "menuitem", interactive: true, primary: "Dense item" },
        libDefaults,
        {},
      );

      return () => h("div");
    },
  });

  const Wrapper = defineComponent({
    setup() {
      provide(
        LIST_INJECTION_KEY,
        computed(() => {
          return { dense: true, iconOnly: false };
        }),
      );

      return () => h(Consumer);
    },
  });

  mount(Wrapper);

  expect(result.interactiveBind.value?.class).toContain("min-h-7");
});

test("it should apply selected styles on interactive bind", () => {
  const { interactiveBind } = mountUseListItem({
    selected: true,
    interactive: true,
    primary: "Selected",
  });

  expect(interactiveBind.value?.class).toContain("bg-dark-100");
  expect(interactiveBind.value?.class).toContain("text-dark-900");
  expect(interactiveBind.value?.class).toContain("dark:text-white");
  expect(interactiveBind.value?.class).toContain("dark:bg-white/15");
});

test("it should resolve check as the default selected icon", () => {
  const { resolvedSelectedIcon } = mountUseListItem({
    selected: true,
    interactive: true,
    primary: "Selected",
  });

  expect(resolvedSelectedIcon.value).toBe("check");
});

test("it should suppress the selected icon when selectedIcon is null", () => {
  const { resolvedSelectedIcon } = mountUseListItem({
    selected: true,
    interactive: true,
    selectedIcon: null,
    primary: "Selected",
  });

  expect(resolvedSelectedIcon.value).toBeNull();
});

test("it should use a custom selectedIcon when provided", () => {
  const { resolvedSelectedIcon } = mountUseListItem({
    selected: true,
    interactive: true,
    selectedIcon: Star,
    primary: "Selected",
  });

  expect(resolvedSelectedIcon.value).toStrictEqual(Star);
});

test("it should resolve selectedIcon from BridgeUIProvider defaultProps", () => {
  const { resolvedSelectedIcon } = mountUseListItem(
    { selected: true, interactive: true, primary: "Selected" },
    {},
    { registrySelectedIcon: Star },
  );

  expect(resolvedSelectedIcon.value).toStrictEqual(Star);
});

test("it should suppress the selected icon from BridgeUIProvider when null", () => {
  const { resolvedSelectedIcon } = mountUseListItem(
    { selected: true, interactive: true, primary: "Selected" },
    {},
    { registrySelectedIcon: null },
  );

  expect(resolvedSelectedIcon.value).toBeNull();
});

test("it should disable interaction when disabled is true", () => {
  const { interactiveBind } = mountUseListItem({
    disabled: true,
    interactive: true,
    primary: "Disabled",
  });

  expect(interactiveBind.value?.tabindex).toBe(-1);
  expect(interactiveBind.value?.["aria-disabled"]).toBe(true);
});

test("it should apply divider border on root bind", () => {
  const { rootBind } = mountUseListItem({ divider: true, primary: "Item" });

  expect(rootBind.value.class).toContain("border-b");
});
