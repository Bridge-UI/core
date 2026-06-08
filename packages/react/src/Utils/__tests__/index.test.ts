// ** External Imports
import { renderHook } from "@testing-library/react";
import { expect, test } from "vitest";

// ** Local Imports
import { derived, useBridgeUIMergedRegistryClasses } from "@/Utils";

test("it should run the getter and return its value from derived", () => {
  let runs = 0;

  const value = derived(() => {
    runs += 1;

    return "ok";
  });

  expect(runs).toBe(1);
  expect(value).toBe("ok");
});

test("it should recalculate when called again from derived", () => {
  let count = 0;

  const first = derived(() => {
    count += 1;

    return count;
  });

  const second = derived(() => {
    count += 1;

    return count;
  });

  expect(first).toBe(1);
  expect(second).toBe(2);
});

test("it should return empty object when entry and props have no classes", () => {
  const { result } = renderHook(() =>
    useBridgeUIMergedRegistryClasses({ props: {}, entry: undefined }),
  );

  expect(result.current).toEqual({});
});

test("it should return entry classes when props has none", () => {
  const { result } = renderHook(() =>
    useBridgeUIMergedRegistryClasses({
      props: {},
      entry: { classes: { icon: "text-sm", root: "bg-red-500" } },
    }),
  );

  expect(result.current).toEqual({
    icon: "text-sm",
    root: "bg-red-500",
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
      props: { classes: { root: "bg-blue-500" } },
      entry: { classes: { icon: "text-sm", root: "bg-red-500" } },
    }),
  );

  expect(result.current).toEqual({ icon: "text-sm", root: "bg-blue-500" });
});
