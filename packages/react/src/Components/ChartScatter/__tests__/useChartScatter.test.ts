// ** External Imports
import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, expect, test } from "vitest";

// ** Local Imports
import { useChartScatter } from "@/Components/ChartScatter";

afterEach(() => {
  cleanup();
});

function renderUseChartScatter() {
  return renderHook(() =>
    useChartScatter(
      {},
      { size: "md", height: 280, symbolSize: 8, animation: true },
    ),
  );
}

test("it should merge the scatter defaults", () => {
  const { result } = renderUseChartScatter();

  expect(result.current.merged.symbolSize).toBe(8);
  expect(result.current.context.family).toBe("scatter");
});

test("it should count points for keyboard navigation", () => {
  const { result } = renderUseChartScatter();

  act(() => {
    result.current.context.upsertSeries?.({
      id: "a",
      name: "A",
      kind: "scatter",
      data: [
        [2, 1],
        [1, 1],
      ],
    });
  });

  expect(result.current.frame.isEmpty).toBe(false);
  expect(result.current.frame.table.rows).toHaveLength(2);
});
