// ** External Imports
import { cleanup, renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, expect, test } from "vitest";

// ** Local Imports
import { ChartBar } from "@/Components/ChartBar";
import { useChartBarSeries } from "@/Components/ChartBarSeries";

afterEach(() => {
  cleanup();
});

function Wrapper({ children }: { children: ReactNode }) {
  return <ChartBar categories={["Q1", "Q2"]}>{children}</ChartBar>;
}

test("it should build a bar entry", () => {
  const { result } = renderHook(
    () =>
      useChartBarSeries({
        name: "A",
        stack: "s",
        data: [1, 2],
        reference: [{ type: "max" }],
      }),
    { wrapper: Wrapper },
  );

  expect(result.current.entry).toMatchObject({
    name: "A",
    stack: "s",
    kind: "bar",
    reference: [{ type: "max" }],
  });
});

test("it should throw outside a chart", () => {
  expect(() =>
    renderHook(() => useChartBarSeries({ name: "A", data: [1] })),
  ).toThrow("Chart components must be used within");
});
