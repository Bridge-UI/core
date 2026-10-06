// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test } from "vitest";
import { defineComponent, h, nextTick, ref } from "vue";

// ** Core Imports
import {
  DEFAULT_CHART_X_AXIS,
  DEFAULT_CHART_Y_AXIS,
  type ChartRenderOptions,
} from "@bridge-ui/core/Domain";

// ** Local Imports
import { useChart, type ChartOwnProps } from "@/Components/Chart";
import { buildEchartsOption } from "@/Components/Chart/echartsChart";

const libDefaults = {
  size: "md",
  height: 280,
  animation: true,
} as const;

function mountUseChart(props: Partial<ChartOwnProps> = {}) {
  let result!: ReturnType<typeof useChart>;

  const Probe = defineComponent({
    setup() {
      result = useChart(
        { categories: ["Jan", "Feb"], ...props },
        libDefaults as Parameters<typeof useChart>[1],
        { hostRef: ref(null), plotRef: ref(null), rootRef: ref(null) },
      );

      return () => h("div");
    },
  });

  mount(Probe);

  return result;
}

const seriesA = {
  id: "a",
  name: "A",
  data: [1, 2],
  type: "line",
  curve: "linear",
} as const;

test("it should merge default size, height, and animation", () => {
  const result = mountUseChart();

  expect(result.merged.value.size).toBe("md");
  expect(result.merged.value.height).toBe(280);
  expect(result.merged.value.animation).toBe(true);
});

test("it should be empty until a series registers", () => {
  const result = mountUseChart();

  expect(result.isEmpty.value).toBe(true);

  result.contextValue.value.upsertSeries({ ...seriesA, data: [1, 2] });

  expect(result.isEmpty.value).toBe(false);
  expect(result.contextValue.value.series).toHaveLength(1);
  expect(result.table.value.rows).toEqual([
    { values: ["1"], category: "Jan" },
    { values: ["2"], category: "Feb" },
  ]);
});

test("it should keep series order when an entry updates", () => {
  const result = mountUseChart();
  const { upsertSeries } = result.contextValue.value;

  upsertSeries({ ...seriesA, data: [1, 2] });
  upsertSeries({ ...seriesA, id: "b", name: "B", type: "bar", data: [3, 4] });
  upsertSeries({ ...seriesA, name: "A2", data: [1, 2] });

  expect(result.contextValue.value.series.map((item) => item.name)).toEqual([
    "A2",
    "B",
  ]);
});

test("it should toggle series visibility", async () => {
  const result = mountUseChart();

  result.contextValue.value.upsertSeries({ ...seriesA, data: [1, 2] });
  result.contextValue.value.toggleSeries("a");
  await nextTick();

  expect(result.contextValue.value.series[0]?.hidden).toBe(true);

  result.contextValue.value.toggleSeries("a");
  await nextTick();

  expect(result.contextValue.value.series[0]?.hidden).toBe(false);
});

test("it should expose figure, plot, and live region binds", () => {
  const result = mountUseChart({ summary: "Summary" });

  expect(result.rootBind.value.role).toBe("figure");
  expect(result.plotBind.value.role).toBe("img");
  expect(result.plotBind.value["aria-label"]).toBe("Summary");
  expect(result.liveBind.value["aria-live"]).toBe("polite");
  expect(result.plotBind.value.tabindex).toBe(0);
});

test("it should report loading instead of empty", () => {
  const result = mountUseChart({ loading: true });

  expect(result.isLoading.value).toBe(true);
  expect(result.isEmpty.value).toBe(false);
  expect(result.rootBind.value["aria-busy"]).toBe(true);
  expect(result.loadingBind.value.class).toContain("bg-white/50");
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

test("it should contain axis labels through outer bounds", () => {
  const grid = buildEchartsOption(plotOptions).grid as Record<string, unknown>;

  expect(grid.containLabel).toBeUndefined();
  expect(grid.outerBoundsMode).toBe("same");
  expect(grid.outerBoundsContain).toBe("axisLabel");
});
