// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test } from "vitest";
import { computed, defineComponent, h, provide } from "vue";

// ** Local Imports
import { LIST_INJECTION_KEY } from "@/Components/List";
import { useListItem, type ListItemOwnProps } from "@/Components/ListItem";

const libDefaults = {
  role: "button",
  align: "center",
} as const satisfies Partial<ListItemOwnProps>;

function mountUseListItem(
  props: Partial<ListItemOwnProps> = {},
  slots: Record<string, () => unknown> = {},
) {
  let result!: ReturnType<typeof useListItem>;

  const Wrapper = defineComponent({
    setup() {
      result = useListItem(
        props,
        libDefaults,
        slots as Parameters<typeof useListItem>[2],
      );

      return () => h("div");
    },
  });

  mount(Wrapper);

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
