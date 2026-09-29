// ** External Imports
import { cleanup, renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, expect, test } from "vitest";

// ** Local Imports
import { Chart } from "@/Components/Chart";
import { useChartAxis } from "@/Components/ChartAxis";

afterEach(() => {
  cleanup();
});

function Wrapper({ children }: { children: ReactNode }) {
  return <Chart categories={["Jan", "Feb"]}>{children}</Chart>;
}

test("it should omit undefined options", () => {
  const { result } = renderHook(
    () => useChartAxis({ position: "y", label: "Revenue" }),
    { wrapper: Wrapper },
  );

  expect(result.current.options).toEqual({ label: "Revenue" });
});

test("it should keep options stable across inline formatters", () => {
  let calls = 0;

  const { result, rerender } = renderHook(
    () => {
      calls += 1;

      return useChartAxis({
        position: "y",
        formatTick: (value) => `${value}-${calls}`,
      });
    },
    { wrapper: Wrapper },
  );

  const first = result.current.options;

  rerender();

  expect(result.current.options).toBe(first);
  expect(result.current.options.formatTick?.(5)).toBe(`5-${calls}`);
});

test("it should throw outside a Chart", () => {
  expect(() => renderHook(() => useChartAxis({ position: "x" }))).toThrow(
    "Chart components must be used within a Chart",
  );
});
