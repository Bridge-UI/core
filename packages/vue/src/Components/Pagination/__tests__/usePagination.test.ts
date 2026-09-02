// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test, vi } from "vitest";
import { defineComponent, h, ref, type Ref } from "vue";

// ** Local Imports
import { usePagination } from "@/Components/Pagination/composables/usePagination";
import type { PaginationOwnProps } from "@/Components/Pagination/pagination.types";

const libDefaults = {
  size: "md",
  rounded: "md",
  color: "dark",
  disabled: false,
  siblingCount: 1,
  variant: "ghost",
  mode: "numbered",
  boundaryCount: 1,
  hideNextButton: false,
  hidePrevButton: false,
} as const;

function mountUsePagination(
  props: Partial<PaginationOwnProps> = {},
  model: Ref<number | undefined> = ref(1),
  defaults: typeof libDefaults = libDefaults,
) {
  let result!: ReturnType<typeof usePagination>;
  const emit = vi.fn();

  const Wrapper = defineComponent({
    setup() {
      result = usePagination(
        props,
        defaults as Parameters<typeof usePagination>[1],
        model,
        emit as Parameters<typeof usePagination>[3],
      );

      return () => h("div");
    },
  });

  mount(Wrapper);

  return { emit, model, result };
}

test("it should expose defaults from usePagination", () => {
  const { result } = mountUsePagination();

  expect(result.page.value).toBe(1);
  expect(result.showNext.value).toBe(true);
  expect(result.showPrev.value).toBe(true);
  expect(result.rootBind.value["aria-label"]).toBe("Pagination");
});

test("it should build page entries for numbered mode", () => {
  const { result } = mountUsePagination({ count: 12 }, ref(5));

  expect(result.entries.value).toEqual([
    { page: 1, type: "page" },
    { type: "ellipsis" },
    { page: 4, type: "page" },
    { page: 5, type: "page" },
    { page: 6, type: "page" },
    { type: "ellipsis" },
    { page: 12, type: "page" },
  ]);
});

test("it should skip page entries in simple mode", () => {
  const { result } = mountUsePagination(
    { hasNext: true, mode: "simple" },
    ref(1),
    { ...libDefaults, mode: "simple" },
  );

  expect(result.entries.value).toEqual([]);
  expect(result.nextBind.value.disabled).toBe(false);
});
