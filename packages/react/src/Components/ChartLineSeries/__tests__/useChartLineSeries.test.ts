// ** External Imports
import { cleanup, renderHook } from "@testing-library/react";
import { createElement, type ReactNode } from "react";
import { afterEach, expect, test } from "vitest";

// ** Local Imports
import { ChartLine } from "@/Components/ChartLine";
import { useChartLineSeries } from "@/Components/ChartLineSeries";

afterEach(() => {
  cleanup();
});

function Wrapper({ children }: { children: ReactNode }) {
  return createElement(ChartLine, { categories: ["Jan", "Feb"] }, children);
}

test("it should build a line entry with a normalized reference list", () => {
  const { result } = renderHook(
    () =>
      useChartLineSeries({
        name: "A",
        data: [1, 2],
        reference: { value: 10 },
      }),
    { wrapper: Wrapper },
  );

  expect(result.current.entry).toMatchObject({
    name: "A",
    kind: "line",
    data: [1, 2],
    reference: [{ value: 10 }],
  });
  expect(result.current.entry.id).toContain("-series");
});

test("it should leave unset options undefined so the root decides", () => {
  const { result } = renderHook(
    () => useChartLineSeries({ name: "A", data: [1] }),
    { wrapper: Wrapper },
  );

  expect(result.current.entry.area).toBeUndefined();
  expect(result.current.entry.curve).toBeUndefined();
});

test("it should throw outside a chart", () => {
  expect(() =>
    renderHook(() => useChartLineSeries({ name: "A", data: [1] })),
  ).toThrow("Chart components must be used within");
});
