// ** External Imports
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { getInstanceByDom } from "echarts/core";
import type { ComponentProps } from "react";
import { afterEach, expect, test, vi } from "vitest";

// ** Local Imports
import { ChartBar } from "@/Components/ChartBar";
import { ChartBarSeries } from "@/Components/ChartBarSeries";
import { ChartLineSeries } from "@/Components/ChartLineSeries";
import { ChartScatterSeries } from "@/Components/ChartScatterSeries";
import {
  getEchartsHost,
  stubPlotSize,
} from "@/Utils/Charts/__tests__/chartTestUtils";

const categories = ["Housing", "Kids", "Food"];

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

function renderChart(props: Partial<ComponentProps<typeof ChartBar>> = {}) {
  return render(
    <ChartBar categories={categories} {...props}>
      <ChartBarSeries name="October" data={[3450, 1310, 1240]} />
      <ChartBarSeries name="Average" data={[3300, 1200, null]} />
    </ChartBar>,
  );
}

test("it should render a figure with a summary and data table", () => {
  renderChart();

  expect(screen.getByRole("img").getAttribute("aria-label")).toContain(
    "October",
  );
  expect(screen.getByRole("rowheader", { name: "Kids" })).toBeTruthy();
  expect(screen.getAllByRole("cell").map((cell) => cell.textContent)).toEqual([
    "3,450",
    "3,300",
    "1,310",
    "1,200",
    "1,240",
    "—",
  ]);
});

test("it should navigate categories with the keyboard", () => {
  renderChart();

  fireEvent.keyDown(screen.getByRole("img"), { key: "End" });

  expect(screen.getByRole("status").textContent).toBe("Food: October 1,240");
});

test("it should mount ECharts with horizontal bars", () => {
  stubPlotSize({ width: 320, height: 180 });

  renderChart({ animation: false, orientation: "horizontal" });

  const option = getInstanceByDom(getEchartsHost())?.getOption() as {
    xAxis: Array<{ type: string }>;
    yAxis: Array<{ data: string[]; type: string }>;
  };

  expect(option.xAxis[0].type).toBe("value");
  expect(option.yAxis[0].type).toBe("category");
  expect(option.yAxis[0].data).toEqual(categories);
});

test("it should draw a line series over the bars", () => {
  stubPlotSize({ width: 320, height: 180 });

  render(
    <ChartBar animation={false} categories={categories}>
      <ChartBarSeries name="Orders" data={[30, 20, 10]} />
      <ChartLineSeries dashed name="Returns" data={[3, 4, 2]} />
    </ChartBar>,
  );

  const option = getInstanceByDom(getEchartsHost())?.getOption() as {
    series: Array<{ name: string; type: string }>;
    xAxis: Array<{ boundaryGap: boolean }>;
  };

  expect(option.xAxis[0].boundaryGap).toBe(true);
  expect(option.series.map((item) => item.type)).toEqual(["bar", "line"]);
  expect(screen.getByRole("columnheader", { name: "Returns" })).toBeTruthy();
});

test("it should keep a line out of the bar stack", () => {
  stubPlotSize({ width: 320, height: 180 });

  render(
    <ChartBar stack="total" animation={false} categories={categories}>
      <ChartBarSeries name="Online" data={[30, 20, 10]} />
      <ChartBarSeries name="Retail" data={[10, 20, 30]} />
      <ChartLineSeries name="Target" data={[35, 35, 35]} />
      <ChartLineSeries stack="total" name="Stacked" data={[1, 1, 1]} />
    </ChartBar>,
  );

  const option = getInstanceByDom(getEchartsHost())?.getOption() as {
    series: Array<{ stack?: string }>;
  };

  expect(option.series.map((item) => item.stack)).toEqual([
    "total",
    "total",
    undefined,
    "total",
  ]);
});

test("it should throw when a scatter series is placed inside", () => {
  vi.spyOn(console, "error").mockImplementation(() => {});

  expect(() =>
    render(
      <ChartBar categories={categories}>
        <ChartScatterSeries name="Leads" data={[[1, 2]]} />
      </ChartBar>,
    ),
  ).toThrow("ChartScatterSeries must be used within ChartScatter");
});

test("it should show the empty message", () => {
  render(<ChartBar categories={categories} />);

  expect(screen.getByText("No data")).toBeTruthy();
});
