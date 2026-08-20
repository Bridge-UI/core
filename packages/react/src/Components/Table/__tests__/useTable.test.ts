// ** External Imports
import { cleanup, renderHook } from "@testing-library/react";
import { afterEach, expect, test } from "vitest";

// ** Local Imports
import { useTable } from "@/Components/Table/hooks/useTable";

const libDefaults = {
  size: "md",
  full: true,
  rounded: "lg",
  striped: false,
  variant: "plain",
  hoverable: false,
  stickyHeader: false,
} as const;

afterEach(() => {
  cleanup();
});

test("it should expose table defaults from useTable", () => {
  const { result } = renderHook(() => useTable({}, libDefaults));

  expect(result.current.contextValue.full).toBe(true);
  expect(result.current.contextValue.striped).toBe(false);
  expect(result.current.contextValue.hoverable).toBe(false);
  expect(result.current.contextValue.stickyHeader).toBe(false);
  expect(result.current.tableBind.className).toContain("min-w-full");
  expect(result.current.rootBind.className).toContain("overflow-x-auto");
});

test("it should pass striped hover and sticky flags into context", () => {
  const { result } = renderHook(() =>
    useTable(
      { full: false, striped: true, hoverable: true, stickyHeader: true },
      libDefaults,
    ),
  );

  expect(result.current.contextValue.full).toBe(false);
  expect(result.current.contextValue.striped).toBe(true);
  expect(result.current.contextValue.hoverable).toBe(true);
  expect(result.current.contextValue.stickyHeader).toBe(true);
  expect(result.current.tableBind.className).not.toContain("min-w-full");
  expect(result.current.tableBind.className).toContain("border-separate");
  expect(result.current.rootBind.className).not.toContain("overflow-x-auto");
});

test("it should apply bordered chrome on the wrapper", () => {
  const { result } = renderHook(() =>
    useTable({ variant: "bordered" }, libDefaults),
  );

  expect(result.current.rootBind.className).toContain("ring-1");
  expect(result.current.contextValue.tokenClasses.variantHead).toContain(
    "border",
  );
});
