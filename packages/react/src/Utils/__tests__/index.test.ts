// ** External Imports
import { renderHook } from "@testing-library/react";
import { expect, test } from "vitest";

// ** Local Imports
import { derived, useBridgeUIMergedRegistryClasses } from "@/Utils";

test("derived runs the getter and returns its value", () => {
  let runs = 0;

  const value = derived(() => {
    runs += 1;

    return "ok";
  });

  expect(runs).toBe(1);
  expect(value).toBe("ok");
});

test("derived recalculates when called again", () => {
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
