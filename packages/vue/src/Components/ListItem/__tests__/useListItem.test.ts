// ** External Imports
import { Check, Star } from "@lucide/vue";
import { mount } from "@vue/test-utils";
import { expect, test } from "vitest";
import { computed, defineComponent, h, provide } from "vue";

// ** Local Imports
import { LIST_INJECTION_KEY } from "@/Components/List";
import { useListItem, type ListItemOwnProps } from "@/Components/ListItem";
import BridgeUIProvider from "@/Provider/BridgeUIProvider.vue";

const libDefaults = {
  role: "button",
  align: "center",
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
  expect(interactiveBind.value?.class).toContain("cursor-pointer");
});

test("it should apply dense padding on interactive bind", () => {
  const { interactiveBind } = mountUseListItem({
    dense: true,
    interactive: true,
    primary: "Dense item",
  });

  expect(interactiveBind.value?.class).toContain("py-1.5");
  expect(interactiveBind.value?.class).not.toContain("py-2");
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
        computed(() => ({ dense: true })),
      );

      return () => h(Consumer);
    },
  });

  mount(Wrapper);

  expect(result.interactiveBind.value?.class).toContain("py-1.5");
});

test("it should apply selected styles on interactive bind", () => {
  const { interactiveBind } = mountUseListItem({
    selected: true,
    interactive: true,
    primary: "Selected",
  });

  expect(interactiveBind.value?.class).toContain("bg-primary-50");
});

test("it should resolve Check as the default selected icon", () => {
  const { resolvedSelectedIcon } = mountUseListItem({
    selected: true,
    interactive: true,
    primary: "Selected",
  });

  expect(resolvedSelectedIcon.value).toBe(Check);
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
