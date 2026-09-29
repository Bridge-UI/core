// ** External Imports
import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, expect, test } from "vitest";

// ** Core Imports
import {
  DEFAULT_CHART_X_AXIS,
  DEFAULT_CHART_Y_AXIS,
  type ChartRenderOptions,
} from "@bridge-ui/core/Domain";

// ** Local Imports
import { useChart, type ChartProps } from "@/Components/Chart";
import { buildEchartsOption } from "@/Components/Chart/echartsChart";

const libDefaults = {
  size: "md",
  height: 280,
  animation: true,
} as const;

afterEach(() => {
  cleanup();
});

function renderUseChart(props: Partial<ChartProps> = {}) {
  return renderHook(() =>
    useChart(
      { categories: ["Jan", "Feb"], ...props } as ChartProps,
      libDefaults as Parameters<typeof useChart>[1],
    ),
  );
}

test("it should merge default size, height, and animation", () => {
  const { result } = renderUseChart();

  expect(result.current.merged.size).toBe("md");
  expect(result.current.merged.height).toBe(280);
  expect(result.current.merged.animation).toBe(true);
});

test("it should be empty until a series registers", () => {
  const { result } = renderUseChart();

  expect(result.current.isEmpty).toBe(true);

  act(() => {
    result.current.contextValue.upsertSeries({
      id: "a",
      name: "A",
      type: "line",
      data: [1, 2],
      curve: "linear",
    });
  });

  expect(result.current.isEmpty).toBe(false);
  expect(result.current.contextValue.series).toHaveLength(1);
  expect(result.current.table.rows).toEqual([
    { values: ["1"], category: "Jan" },
    { values: ["2"], category: "Feb" },
  ]);
});

test("it should keep series order when an entry updates", () => {
  const { result } = renderUseChart();

  act(() => {
    result.current.contextValue.upsertSeries({
      id: "a",
      name: "A",
      type: "line",
      data: [1, 2],
      curve: "linear",
    });
    result.current.contextValue.upsertSeries({
      id: "b",
      name: "B",
      type: "bar",
      data: [3, 4],
      curve: "linear",
    });
    result.current.contextValue.upsertSeries({
      id: "a",
      name: "A2",
      type: "line",
      data: [1, 2],
      curve: "linear",
    });
  });

  expect(result.current.contextValue.series.map((item) => item.name)).toEqual([
    "A2",
    "B",
  ]);
});

test("it should toggle series visibility", () => {
  const { result } = renderUseChart();

  act(() => {
    result.current.contextValue.upsertSeries({
      id: "a",
      name: "A",
      type: "line",
      data: [1, 2],
      curve: "linear",
    });
  });

  act(() => {
    result.current.contextValue.toggleSeries("a");
  });

  expect(result.current.contextValue.series[0]?.hidden).toBe(true);

  act(() => {
    result.current.contextValue.toggleSeries("a");
  });

  expect(result.current.contextValue.series[0]?.hidden).toBe(false);
});

test("it should expose figure, plot, and live region binds", () => {
  const { result } = renderUseChart({ summary: "Summary" });

  expect(result.current.rootBind.role).toBe("figure");
  expect(result.current.plotBind.role).toBe("img");
  expect(result.current.plotBind["aria-label"]).toBe("Summary");
  expect(result.current.liveBind["aria-live"]).toBe("polite");
  expect(result.current.plotBind.tabIndex).toBe(0);
});

test("it should report loading instead of empty", () => {
  const { result } = renderUseChart({ loading: true });

  expect(result.current.isLoading).toBe(true);
  expect(result.current.isEmpty).toBe(false);
});

const plotOptions: ChartRenderOptions = {
  width: 320,
  height: 180,
  animation: true,
  categories: ["Jan", "Feb"],
  xAxis: { ...DEFAULT_CHART_X_AXIS, label: "Month" },
  yAxis: {
    ...DEFAULT_CHART_Y_AXIS,
    min: 0,
    max: 50,
    formatTick: (value) => `$${value}`,
  },
  theme: {
    fontSize: 12,
    fontFamily: "Inter",
    axisColor: "rgb(1, 2, 3)",
    gridColor: "rgb(4, 5, 6)",
    textColor: "rgb(7, 8, 9)",
  },
  series: [
    {
      id: "a",
      type: "line",
      name: "Revenue",
      curve: "smooth",
      data: [1, null],
      color: "rgb(255, 0, 0)",
    },
    {
      id: "b",
      type: "bar",
      data: [2, 3],
      name: "Costs",
      curve: "linear",
      color: "rgb(0, 0, 255)",
    },
  ],
};

test("it should map series and axes onto the plot option", () => {
  const option = buildEchartsOption(plotOptions);
  const series = option.series as Array<Record<string, unknown>>;
  const xAxis = option.xAxis as Record<string, unknown>;
  const yAxis = option.yAxis as Record<string, unknown>;
  const tooltip = option.tooltip as Record<string, unknown>;

  expect(series.map((item) => item.type)).toEqual(["line", "bar"]);
  expect(series[0]?.smooth).toBe(true);
  expect(series[0]?.connectNulls).toBe(false);
  expect(xAxis.name).toBe("Month");
  expect(xAxis.boundaryGap).toBe(true);
  expect(yAxis.min).toBe(0);
  expect(yAxis.max).toBe(50);
  expect(tooltip.showContent).toBe(false);
  expect(tooltip.trigger).toBe("axis");

  const format = (yAxis.axisLabel as { formatter: (value: number) => string })
    .formatter;

  expect(format(12)).toBe("$12");
});
