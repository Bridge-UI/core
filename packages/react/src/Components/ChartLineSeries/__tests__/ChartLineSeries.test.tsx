// ** External Imports
import { cleanup, render, screen } from "@testing-library/react";
import { getInstanceByDom } from "echarts/core";
import { afterEach, expect, test, vi } from "vitest";

// ** Local Imports
import { ChartLine } from "@/Components/ChartLine";
import { ChartLineSeries } from "@/Components/ChartLineSeries";
import {
  getEchartsHost,
  stubPlotSize,
} from "@/Utils/Chart/__tests__/chartTestUtils";

type LineOption = {
  areaStyle?: object;
  lineStyle: { type: string };
  markLine?: { data: object[] };
  showSymbol: boolean;
  smooth: boolean;
  stack?: string;
  step: false | string;
};

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

function getSeriesOptions() {
  const option = getInstanceByDom(getEchartsHost())?.getOption() as {
    series: LineOption[];
  };

  return option.series;
}

test("it should render nothing of its own and register a table column", () => {
  const { container } = render(
    <ChartLine categories={["Jan", "Feb"]}>
      <ChartLineSeries data={[1, 2]} name="Revenue" />
    </ChartLine>,
  );

  expect(screen.getByRole("columnheader", { name: "Revenue" })).toBeTruthy();
  expect(container.querySelectorAll("figure, [role='figure']")).toHaveLength(1);
});

test("it should inherit root defaults and override them per series", () => {
  stubPlotSize({ width: 320, height: 180 });

  render(
    <ChartLine
      area
      stack="total"
      step="middle"
      curve="smooth"
      animation={false}
      categories={["Jan", "Feb"]}
    >
      <ChartLineSeries name="A" data={[1, 2]} />
      <ChartLineSeries
        dashed
        name="B"
        showPoints
        step={false}
        area={false}
        data={[2, 3]}
        curve="linear"
        reference={{ label: "Avg", type: "average" }}
      />
    </ChartLine>,
  );

  const [first, second] = getSeriesOptions();

  expect(first.smooth).toBe(true);
  expect(first.step).toBe("middle");
  expect(first.stack).toBe("total");
  expect(first.areaStyle).toBeDefined();

  expect(second.step).toBe(false);
  expect(second.smooth).toBe(false);
  expect(second.showSymbol).toBe(true);
  expect(second.areaStyle).toBeUndefined();
  expect(second.lineStyle.type).toBe("dashed");
  expect(second.markLine?.data).toHaveLength(1);
});

test("it should unregister on unmount", () => {
  const { rerender } = render(
    <ChartLine categories={["Jan"]}>
      <ChartLineSeries data={[1]} name="Revenue" />
    </ChartLine>,
  );

  rerender(<ChartLine categories={["Jan"]} />);

  expect(screen.queryByRole("columnheader", { name: "Revenue" })).toBeNull();
});
