// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test } from "vitest";
import { defineComponent, h } from "vue";

// ** Local Imports
import { useTable } from "@/Components/Table/composables/useTable";
import type { TableOwnProps } from "@/Components/Table/table.types";

const libDefaults = {
  size: "md",
  full: true,
  rounded: "lg",
  striped: false,
  variant: "plain",
  hoverable: false,
  stickyHeader: false,
} as const;

function mountUseTable(props: Partial<TableOwnProps> = {}) {
  let result!: ReturnType<typeof useTable>;

  const Wrapper = defineComponent({
    setup() {
      result = useTable(props, libDefaults as Parameters<typeof useTable>[1]);

      return () => h("div");
    },
  });

  mount(Wrapper);

  return { result };
}

test("it should expose table defaults from useTable", () => {
  const { result } = mountUseTable();

  expect(result.contextValue.value.full).toBe(true);
  expect(result.contextValue.value.striped).toBe(false);
  expect(result.contextValue.value.hoverable).toBe(false);
  expect(result.contextValue.value.stickyHeader).toBe(false);
  expect(result.tableBind.value.class).toContain("min-w-full");
  expect(result.rootBind.value.class).toContain("overflow-x-auto");
});

test("it should pass striped hover and sticky flags into context", () => {
  const { result } = mountUseTable({
    full: false,
    striped: true,
    hoverable: true,
    stickyHeader: true,
  });

  expect(result.contextValue.value.full).toBe(false);
  expect(result.contextValue.value.striped).toBe(true);
  expect(result.contextValue.value.hoverable).toBe(true);
  expect(result.contextValue.value.stickyHeader).toBe(true);
  expect(result.tableBind.value.class).not.toContain("min-w-full");
  expect(result.tableBind.value.class).toContain("border-separate");
  expect(result.rootBind.value.class).not.toContain("overflow-x-auto");
});

test("it should apply bordered chrome on the wrapper", () => {
  const { result } = mountUseTable({ variant: "bordered" });

  expect(result.rootBind.value.class).toContain("ring-1");
  expect(result.contextValue.value.tokenClasses.variantHead).toContain(
    "border",
  );
});
