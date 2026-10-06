// ** External Imports
import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";

// ** Local Imports
import { usePagination } from "@/Components/Pagination/hooks/usePagination";

const libDefaults = {
  size: "md",
  rounded: "md",
  color: "dark",
  defaultPage: 1,
  disabled: false,
  siblingCount: 1,
  variant: "ghost",
  mode: "numbered",
  boundaryCount: 1,
  hideNextButton: false,
  hidePrevButton: false,
} as const;

afterEach(() => {
  cleanup();
});

test("it should expose defaults from usePagination", () => {
  const { result } = renderHook(() => usePagination({}, libDefaults));

  expect(result.current.page).toBe(1);
  expect(result.current.showNext).toBe(true);
  expect(result.current.showPrev).toBe(true);
  expect(result.current.rootBind["aria-label"]).toBe("Pagination");
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

test("it should derive simple-mode availability from the cursors", () => {
  const { result } = renderHook(() =>
    usePagination(
      { mode: "simple", nextCursor: "c", prevCursor: null },
      { ...libDefaults, mode: "simple" },
    ),
  );

  expect(result.current.prevBind.disabled).toBe(true);
  expect(result.current.nextBind.disabled).toBe(false);
});

test("it should call onCursorChange with the cursor of the target page", () => {
  const onNext = vi.fn();
  const onCursorChange = vi.fn();

  const { result } = renderHook(() =>
    usePagination(
      {
        onNext,
        cursor: "b",
        mode: "simple",
        onCursorChange,
        nextCursor: "c",
        prevCursor: "a",
      },
      { ...libDefaults, mode: "simple" },
    ),
  );

  act(() => {
    result.current.nextBind.onClick?.({} as never);
  });

  expect(onNext).toHaveBeenCalledOnce();
  expect(onCursorChange).toHaveBeenCalledWith("c");
});
