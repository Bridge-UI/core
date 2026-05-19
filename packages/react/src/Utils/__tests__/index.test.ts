// ** External Imports
import { renderHook } from "@testing-library/react";
import { expect, test } from "vitest";

// ** Local Imports
import { useBridgeUIMergedRegistryClasses } from "@/Utils";

test("it should return empty object when entry and props have no classes", () => {
  const { result } = renderHook(() =>
    useBridgeUIMergedRegistryClasses({ entry: undefined, props: {} }),
  );

  expect(result.current).toEqual({});
});

test("it should return entry classes when props has none", () => {
  const { result } = renderHook(() =>
    useBridgeUIMergedRegistryClasses({
      entry: { classes: { root: "bg-red-500", icon: "text-sm" } },
      props: {},
    }),
  );

  expect(result.current).toEqual({
    root: "bg-red-500",
    icon: "text-sm",
  });
});

test("it should return props classes when entry has none", () => {
  const { result } = renderHook(() =>
    useBridgeUIMergedRegistryClasses({
      entry: undefined,
      props: { classes: { root: "bg-blue-500" } },
    }),
  );

  expect(result.current).toEqual({ root: "bg-blue-500" });
});

test("it should merge entry and props classes with props winning", () => {
  const { result } = renderHook(() =>
    useBridgeUIMergedRegistryClasses({
      entry: { classes: { root: "bg-red-500", icon: "text-sm" } },
      props: { classes: { root: "bg-blue-500" } },
    }),
  );

  expect(result.current).toEqual({ root: "bg-blue-500", icon: "text-sm" });
});
