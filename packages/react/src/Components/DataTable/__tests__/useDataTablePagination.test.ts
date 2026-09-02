// ** External Imports
import { cleanup, renderHook } from "@testing-library/react";
import { afterEach, expect, test } from "vitest";

// ** Local Imports
import { useDataTablePagination } from "@/Components/DataTable/hooks/useDataTablePagination";

const libDefaults = {
  size: "sm",
  rounded: "md",
  defaultPage: 1,
  disabled: false,
} as const;

afterEach(() => {
  cleanup();
});

test("it should expose first and last binds from useDataTablePagination", () => {
  const { result } = renderHook(() =>
    useDataTablePagination({ page: 2, count: 7 }, libDefaults),
  );

  expect(result.current.page).toBe(2);
  expect(result.current.firstBind.disabled).toBe(false);
  expect(result.current.lastBind.disabled).toBe(false);
  expect(result.current.prevBind.disabled).toBe(false);
  expect(result.current.nextBind.disabled).toBe(false);
});

test("it should disable first and previous on the first page", () => {
  const { result } = renderHook(() =>
    useDataTablePagination({ page: 1, count: 7 }, libDefaults),
  );

  expect(result.current.firstBind.disabled).toBe(true);
  expect(result.current.prevBind.disabled).toBe(true);
});
