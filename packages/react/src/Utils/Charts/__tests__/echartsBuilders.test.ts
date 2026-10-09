// ** External Imports
import { get } from "es-toolkit/compat";
import { describe, expect, test } from "vitest";

// ** Core Imports
import type {
  ChartCartesianRenderOptions,
  ChartCartesianRenderSeries,
  ChartPartRenderSlice,
  ChartRenderTheme,
} from "@bridge-ui/core/Domain";

// ** Local Imports
import { buildEchartsCartesianOption } from "@/Utils/Charts/echarts/cartesian";
import { buildEchartsFunnelOption } from "@/Utils/Charts/echarts/funnel";
import { buildEchartsPieOption } from "@/Utils/Charts/echarts/pie";
import { buildEchartsScatterOption } from "@/Utils/Charts/echarts/scatter";

const theme: ChartRenderTheme = {
  fontSize: 12,
  fontFamily: "Inter",
  axisColor: "rgb(1, 1, 1)",
  gridColor: "rgb(2, 2, 2)",
  textColor: "rgb(3, 3, 3)",
  backgroundColor: "rgb(255, 255, 255)",
};

const line: ChartCartesianRenderSeries = {
  id: "a",
  name: "A",
  area: false,
  step: false,
  kind: "line",
  labels: false,
  dashed: false,
  reference: [],
  data: [1, null],
  curve: "linear",
  colorRanges: [],
  itemColors: null,
  colorBy: "value",
  areaOpacity: 0.15,
  showPoints: false,
  color: "rgb(9, 9, 9)",
};

const bar: ChartCartesianRenderSeries = {
  id: "b",
  name: "B",
  kind: "bar",
  data: [1, 2],
  tone: "solid",
  labels: false,
  reference: [],
  colorRanges: [],
  itemColors: null,
  colorBy: "value",
  color: "rgb(8, 8, 8)",
};

const ranges = [
  { max: 50, label: "Good", color: "rgb(0, 200, 0)" },
  { min: 50, label: "Bad", color: "rgb(200, 0, 0)" },
];

function cartesian(
  options: Partial<ChartCartesianRenderOptions> = {},
): ChartCartesianRenderOptions {
  return {
    theme,
    xAxis: {},
    yAxis: {},
    radius: 4,
    width: 320,
    height: 180,
    series: [line],
    animation: false,
    sparkline: false,
    timestamps: null,
    orientation: "vertical",
    categories: ["Jan", "Feb"],
    formatLabel: (value) => `v${value}`,
    ...options,
  };
}

const slices: ChartPartRenderSlice[] = [
  { id: "a", value: 3, label: "A", percent: 75, color: "red", labelText: "A" },
  { id: "b", value: 1, label: "B", percent: 25, color: "blue", labelText: "B" },
];

describe("buildEchartsCartesianOption", () => {
  test("it should map label categories to a category x axis", () => {
    const option = buildEchartsCartesianOption(cartesian());

    expect(get(option, "yAxis.type")).toBe("value");
    expect(get(option, "xAxis.type")).toBe("category");
    expect(get(option, "series[0].data")).toEqual([1, null]);
    expect(get(option, "xAxis.data")).toEqual(["Jan", "Feb"]);
  });

  test("it should pair values with timestamps on a time axis", () => {
    const option = buildEchartsCartesianOption(
      cartesian({ timestamps: [100, 200] }),
    );

    expect(get(option, "xAxis.type")).toBe("time");
    expect(get(option, "xAxis.data")).toBeUndefined();
    expect(get(option, "series[0].data")).toEqual([
      [100, 1],
      [200, null],
    ]);
  });

  test("it should swap axes for horizontal bars", () => {
    const option = buildEchartsCartesianOption(
      cartesian({
        yAxis: { label: "Tag" },
        orientation: "horizontal",
        series: [{ ...bar, labels: true }],
      }),
    );

    expect(get(option, "yAxis.name")).toBe("Tag");
    expect(get(option, "xAxis.type")).toBe("value");
    expect(get(option, "yAxis.inverse")).toBe(true);
    expect(get(option, "yAxis.type")).toBe("category");
    expect(get(option, "series[0].label.position")).toBe("right");
    expect(get(option, "series[0].data[0].itemStyle.borderRadius")).toEqual([
      0, 4, 4, 0,
    ]);
  });

  test("it should format categories and numeric ticks separately", () => {
    const formatTick = (value: number) => `n${value + 1}`;
    const formatCategory = (category: string) => `c${category}`;

    const option = buildEchartsCartesianOption(
      cartesian({ yAxis: { formatTick }, xAxis: { formatCategory } }),
    );

    const formatX = get(option, "xAxis.axisLabel.formatter") as (
      value: number | string,
    ) => string;

    const formatY = get(option, "yAxis.axisLabel.formatter") as (
      value: number | string,
    ) => string;

    expect(formatY(1)).toBe("n2");
    expect(formatX("Jan")).toBe("cJan");
  });

  test("it should pass timestamps to formatTick on a time axis", () => {
    const formatTick = (value: number) => `t${value + 1}`;

    const option = buildEchartsCartesianOption(
      cartesian({ xAxis: { formatTick }, timestamps: [100, 200] }),
    );

    const formatX = get(option, "xAxis.axisLabel.formatter") as (
      value: number | string,
    ) => string;

    expect(formatX(100)).toBe("t101");
  });

  test("it should hide axes and padding for sparklines", () => {
    const option = buildEchartsCartesianOption(cartesian({ sparkline: true }));

    expect(get(option, "grid.left")).toBe(2);
    expect(get(option, "xAxis.show")).toBe(false);
    expect(get(option, "yAxis.show")).toBe(false);
    expect(get(option, "yAxis.splitLine.show")).toBe(false);
    expect(get(option, "series[0].lineStyle.width")).toBe(1.5);
  });

  test("it should format labels and reference lines with formatLabel", () => {
    const option = buildEchartsCartesianOption(
      cartesian({
        series: [{ ...line, labels: true, reference: [{ value: 5 }] }],
      }),
    );

    const formatLabel = get(option, "series[0].label.formatter") as (
      params: unknown,
    ) => string;

    const formatReference = get(
      option,
      "series[0].markLine.data[0].label.formatter",
    ) as (params: unknown) => string;

    expect(formatLabel({ dataIndex: 1 })).toBe("");
    expect(formatLabel({ dataIndex: 0 })).toBe("v1");
    expect(formatReference({ value: 5 })).toBe("v5");
    expect(get(option, "series[0].markLine.data[0].yAxis")).toBe(5);
  });

  test("it should fill the area with the series color and opacity", () => {
    const option = buildEchartsCartesianOption(
      cartesian({ series: [{ ...line, area: true, areaOpacity: 0.6 }] }),
    );

    expect(get(option, "visualMap")).toBeUndefined();
    expect(get(option, "series[0].areaStyle")).toEqual({
      opacity: 0.6,
      color: "rgb(9, 9, 9)",
    });
  });

  test("it should recolor ranged lines with a hidden visual map", () => {
    const option = buildEchartsCartesianOption(
      cartesian({ series: [{ ...line, area: true, colorRanges: ranges }] }),
    );

    expect(get(option, "visualMap[0]")).toMatchObject({
      show: false,
      dimension: 1,
      seriesIndex: 0,
      type: "piecewise",
      outOfRange: { color: "rgb(9, 9, 9)" },
      pieces: [
        { lt: 50, color: "rgb(0, 200, 0)" },
        { gte: 50, color: "rgb(200, 0, 0)" },
      ],
    });

    // A fixed stroke or fill would win over the visual map.
    expect(get(option, "series[0].lineStyle.color")).toBeUndefined();
    expect(get(option, "series[0].areaStyle")).toEqual({ opacity: 0.15 });
  });

  test("it should match category ranges by timestamp on a time axis", () => {
    const option = buildEchartsCartesianOption(
      cartesian({
        timestamps: [100, 200, 300],
        series: [
          {
            ...line,
            data: [1, 2, 3],
            colorBy: "category",
            colorRanges: [{ min: 1, max: 9, color: "red" }],
          },
        ],
      }),
    );

    expect(get(option, "visualMap[0].dimension")).toBe(0);
    expect(get(option, "visualMap[0].pieces")).toEqual([
      { gte: 200, lte: 300, color: "red" },
    ]);
  });

  test("it should use the value dimension of lines in horizontal charts", () => {
    const option = buildEchartsCartesianOption(
      cartesian({
        orientation: "horizontal",
        series: [{ ...line, colorRanges: ranges }],
      }),
    );

    expect(get(option, "visualMap[0].dimension")).toBe(0);
  });

  test("it should paint open ranges as a plain color", () => {
    const option = buildEchartsCartesianOption(
      cartesian({ series: [{ ...line, colorRanges: [{ color: "red" }] }] }),
    );

    expect(get(option, "visualMap")).toBeUndefined();
    expect(get(option, "series[0].lineStyle.color")).toBe("red");
  });

  test("it should paint each bar with its item color", () => {
    const option = buildEchartsCartesianOption(
      cartesian({ series: [{ ...bar, itemColors: ["red", "blue"] }] }),
    );

    expect(get(option, "series[0].data[0].itemStyle.color")).toBe("red");
    expect(get(option, "series[0].data[1].itemStyle.color")).toBe("blue");
  });

  test("it should keep the theme text color for labels inside muted bars", () => {
    const option = buildEchartsCartesianOption(
      cartesian({
        series: [{ ...bar, stack: "s", labels: true, tone: "muted" }],
      }),
    );

    expect(get(option, "series[0].label.position")).toBe("inside");
    expect(get(option, "series[0].label.color")).toBe("rgb(3, 3, 3)");
  });
});

describe("buildEchartsPieOption", () => {
  const base = {
    theme,
    slices,
    width: 320,
    rose: null,
    height: 240,
    minAngle: 2,
    padAngle: 0,
    labels: false,
    thickness: 0.3,
    cornerRadius: 0,
    animation: false,
    labelPosition: "outside",
  } as const;

  test("it should draw a full pie without labels", () => {
    const option = buildEchartsPieOption({ ...base, variant: "pie" });

    expect(get(option, "series[0].label.show")).toBe(false);
    expect(get(option, "series[0].radius")).toEqual(["0%", "92%"]);
  });

  test("it should leave a hole for donuts and room for outside labels", () => {
    const option = buildEchartsPieOption({
      ...base,
      padAngle: 1,
      labels: true,
      cornerRadius: 2,
      variant: "donut",
    });

    expect(get(option, "series[0].padAngle")).toBe(1);
    expect(get(option, "series[0].itemStyle.borderRadius")).toBe(2);
    expect(get(option, "series[0].labelLine.show")).toBe(true);
    expect(get(option, "series[0].radius")).toEqual(["49%", "70%"]);
  });

  test("it should draw inside labels in white on a full pie", () => {
    const option = buildEchartsPieOption({
      ...base,
      labels: true,
      variant: "pie",
      labelPosition: "inside",
    });

    expect(get(option, "series[0].label.color")).toBe("#fff");
    expect(get(option, "series[0].label.position")).toBe("inside");
    expect(get(option, "series[0].radius")).toEqual(["0%", "92%"]);
  });
});

describe("buildEchartsPieOption slices", () => {
  const base = {
    theme,
    slices,
    width: 320,
    height: 240,
    minAngle: 2,
    labels: false,
    thickness: 0.3,
    variant: "pie",
    animation: false,
    labelPosition: "outside",
  } as const;

  test("it should draw a rose with gaps and round corners", () => {
    const option = buildEchartsPieOption({
      ...base,
      padAngle: 3,
      rose: "area",
      cornerRadius: 6,
    });

    expect(get(option, "series[0].padAngle")).toBe(3);
    expect(get(option, "series[0].roseType")).toBe("area");
    expect(get(option, "series[0].itemStyle.borderRadius")).toBe(6);
  });

  test("it should skip the gap for a single slice", () => {
    const option = buildEchartsPieOption({
      ...base,
      rose: null,
      padAngle: 3,
      cornerRadius: 0,
      slices: [slices[0]],
    });

    expect(get(option, "series[0].padAngle")).toBe(0);
    expect(get(option, "series[0].roseType")).toBeUndefined();
  });
});

describe("buildEchartsScatterOption", () => {
  test("it should color points by their y range", () => {
    const option = buildEchartsScatterOption({
      theme,
      xAxis: {},
      yAxis: {},
      points: [],
      width: 320,
      height: 240,
      symbolSize: 8,
      animation: false,
      sizeDomain: null,
      bubbleSize: [8, 40],
      series: [
        {
          id: "s",
          name: "S",
          color: "gray",
          kind: "scatter",
          colorRanges: ranges,
          data: [
            [1, 10],
            [2, 80],
          ],
        },
      ],
    });

    expect(get(option, "series[0].data")).toEqual([
      { value: [1, 10], itemStyle: { color: "rgb(0, 200, 0)" } },
      { value: [2, 80], itemStyle: { color: "rgb(200, 0, 0)" } },
    ]);
  });
});

describe("buildEchartsFunnelOption", () => {
  test("it should keep the data order and narrow the shape for outside labels", () => {
    const option = buildEchartsFunnelOption({
      theme,
      slices,
      width: 320,
      height: 240,
      labels: true,
      align: "right",
      animation: false,
      labelPosition: "outside",
    });

    expect(get(option, "series[0].left")).toBe("36%");
    expect(get(option, "series[0].sort")).toBe("none");
    expect(get(option, "series[0].width")).toBe("60%");
    expect(get(option, "series[0].label.position")).toBe("left");
  });

  test("it should use the full width when labels are off", () => {
    const option = buildEchartsFunnelOption({
      theme,
      slices,
      width: 320,
      height: 240,
      labels: false,
      align: "center",
      animation: false,
      labelPosition: "outside",
    });

    expect(get(option, "series[0].width")).toBe("92%");
    expect(get(option, "series[0].label.show")).toBe(false);
  });
});
