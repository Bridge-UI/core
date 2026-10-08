// ** External Imports
import { cleanup, renderHook } from "@testing-library/react";
import { afterEach, expect, test } from "vitest";

// ** Local Imports
import { useChartFunnel } from "@/Components/ChartFunnel";

afterEach(() => {
  cleanup();
});

test("it should merge the funnel defaults", () => {
  const { result } = renderHook(() =>
    useChartFunnel(
      { data: [{ value: 1, label: "A" }] },
      {
        size: "md",
        height: 280,
        labels: true,
        align: "center",
        animation: true,
        sort: "descending",
        labelPosition: "inside",
      },
    ),
  );

  expect(result.current.merged.labels).toBe(true);
  expect(result.current.merged.labelPosition).toBe("inside");
  expect(result.current.context.family).toBe("funnel");
  expect(result.current.merged.sort).toBe("descending");
});

test("it should keep zero stages", () => {
  const { result } = renderHook(() =>
    useChartFunnel(
      {
        data: [
          { value: 4, label: "A" },
          { value: 0, label: "B" },
        ],
      },
      { size: "md", height: 280 },
    ),
  );

  expect(result.current.context.legendItems).toMatchObject([
    { name: "A", percent: 100 },
    { name: "B", percent: 0 },
  ]);
});
