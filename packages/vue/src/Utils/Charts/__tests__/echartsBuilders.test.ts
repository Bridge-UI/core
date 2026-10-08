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

const theme: ChartRenderTheme = {
  fontSize: 12,
  fontFamily: "Inter",
  axisColor: "rgb(1, 1, 1)",
  gridColor: "rgb(2, 2, 2)",
  textColor: "rgb(3, 3, 3)",
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
  showPoints: false,
  color: "rgb(9, 9, 9)",
};

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
        series: [{ ...line, kind: "bar", labels: true, data: [1, 2] }],
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
});

describe("buildEchartsPieOption", () => {
  const base = {
    theme,
    slices,
    width: 320,
    height: 240,
    minAngle: 2,
    labels: false,
    thickness: 0.3,
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
      labels: true,
      variant: "donut",
    });

    expect(get(option, "series[0].padAngle")).toBe(1);
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
