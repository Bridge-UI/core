// ** External Imports
import { cleanup, render, screen } from "@testing-library/react";
import { getInstanceByDom } from "echarts/core";
import { afterEach, expect, test, vi } from "vitest";

// ** Local Imports
import { ChartBar } from "@/Components/ChartBar";
import { ChartBarSeries } from "@/Components/ChartBarSeries";
import {
  getEchartsHost,
  stubPlotSize,
} from "@/Utils/Charts/__tests__/chartTestUtils";

type BarOption = {
  data: Array<null | { itemStyle: { borderRadius: number | number[] } }>;
  label?: { show: boolean };
  stack?: string;
};

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

test("it should register a table column", () => {
  render(
    <ChartBar categories={["Q1"]}>
      <ChartBarSeries data={[3]} name="Orders" />
    </ChartBar>,
  );

  expect(screen.getByRole("columnheader", { name: "Orders" })).toBeTruthy();
});

test("it should round only the outermost bar of a stack", () => {
  stubPlotSize({ width: 320, height: 180 });

  render(
    <ChartBar stack="total" animation={false} categories={["Q1", "Q2"]}>
      <ChartBarSeries name="A" data={[1, -2]} />
      <ChartBarSeries labels name="B" data={[2, null]} />
    </ChartBar>,
  );

  const option = getInstanceByDom(getEchartsHost())?.getOption() as {
    series: BarOption[];
  };

  const [first, second] = option.series;

  expect(first.stack).toBe("total");
  expect(second.label?.show).toBe(true);
  expect(first.data[0]?.itemStyle.borderRadius).toBe(0);
  expect(first.data[1]?.itemStyle.borderRadius).toEqual([0, 0, 4, 4]);
  expect(second.data[0]?.itemStyle.borderRadius).toEqual([4, 4, 0, 0]);
});
