// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test, vi } from "vitest";
import { defineComponent, h, ref, type Ref } from "vue";

// ** Local Imports
import { useDataTablePagination } from "@/Components/DataTable/composables/useDataTablePagination";
import type { DataTablePaginationOwnProps } from "@/Components/DataTable/dataTablePagination.types";

const libDefaults = {
  size: "sm",
  rounded: "md",
  disabled: false,
} as const;

function mountUseDataTablePagination(
  props: Partial<DataTablePaginationOwnProps> = {},
  model: Ref<number | undefined> = ref(1),
) {
  let result!: ReturnType<typeof useDataTablePagination>;
  const emit = vi.fn();

  const Wrapper = defineComponent({
    setup() {
      result = useDataTablePagination(
        props,
        libDefaults,
        model,
        emit as Parameters<typeof useDataTablePagination>[3],
      );

      return () => h("div");
    },
  });

  mount(Wrapper);

  return { emit, model, result };
}

test("it should expose first and last binds from useDataTablePagination", () => {
  const { result } = mountUseDataTablePagination({ count: 7 }, ref(2));

  expect(result.page.value).toBe(2);
  expect(result.firstBind.value.disabled).toBe(false);
  expect(result.lastBind.value.disabled).toBe(false);
  expect(result.prevBind.value.disabled).toBe(false);
  expect(result.nextBind.value.disabled).toBe(false);
});

test("it should disable first and previous on the first page", () => {
  const { result } = mountUseDataTablePagination({ count: 7 }, ref(1));

  expect(result.firstBind.value.disabled).toBe(true);
  expect(result.prevBind.value.disabled).toBe(true);
});

test("it should disable last and next on the last page", () => {
  const { result } = mountUseDataTablePagination({ count: 7 }, ref(7));

  expect(result.lastBind.value.disabled).toBe(true);
  expect(result.nextBind.value.disabled).toBe(true);
});
