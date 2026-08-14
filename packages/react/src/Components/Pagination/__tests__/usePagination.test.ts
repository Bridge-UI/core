// ** External Imports
import { cleanup, renderHook } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";

// ** Local Imports
import { usePagination } from "@/Components/Pagination/hooks/usePagination";

const libDefaults = {
  size: "md",
  defaultPage: 1,
  variant: "text",
  disabled: false,
  siblingCount: 1,
  mode: "numbered",
  color: "primary",
  boundaryCount: 1,
  hideNextButton: false,
  hidePrevButton: false,
} as const;

afterEach(() => {
  cleanup();
});

test("it should expose defaults from usePagination", () => {
  const { result } = renderHook(() => usePagination({}, libDefaults));

  expect(result.current.rootBind["aria-label"]).toBe("Pagination");
  expect(result.current.page).toBe(1);
  expect(result.current.showPrev).toBe(true);
  expect(result.current.showNext).toBe(true);
});

test("it should build page entries for numbered mode", () => {
  const { result } = renderHook(() =>
    usePagination({ page: 5, count: 12 }, libDefaults),
  );

  expect(result.current.entries).toEqual([
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
  const onNext = vi.fn();

  const { result } = renderHook(() =>
    usePagination(
      { onNext, hasNext: true, mode: "simple" },
      { ...libDefaults, mode: "simple" },
    ),
  );

  expect(result.current.entries).toEqual([]);
  expect(result.current.nextBind.disabled).toBe(false);
});
