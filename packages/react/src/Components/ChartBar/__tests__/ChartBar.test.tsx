// ** External Imports
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { getInstanceByDom } from "echarts/core";
import type { ComponentProps } from "react";
import { afterEach, expect, test, vi } from "vitest";

// ** Local Imports
import { ChartBar } from "@/Components/ChartBar";
import { ChartBarSeries } from "@/Components/ChartBarSeries";
import { ChartLineSeries } from "@/Components/ChartLineSeries";
import {
  getEchartsHost,
  stubPlotSize,
} from "@/Utils/Chart/__tests__/chartTestUtils";

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

test("it should throw when a line series is placed inside", () => {
  vi.spyOn(console, "error").mockImplementation(() => {});

  expect(() =>
    render(
      <ChartBar categories={categories}>
        <ChartLineSeries name="Goal" data={[1, 2, 3]} />
      </ChartBar>,
    ),
  ).toThrow("ChartLineSeries must be used within ChartLine");
});

test("it should show the empty message", () => {
  render(<ChartBar categories={categories} />);

  expect(screen.getByText("No data")).toBeTruthy();
});
