// ** External Imports
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { getInstanceByDom } from "echarts/core";
import type { ComponentProps } from "react";
import { afterEach, expect, test, vi } from "vitest";

// ** Local Imports
import { ChartFunnel } from "@/Components/ChartFunnel";
import { ChartLegend } from "@/Components/ChartLegend";
import {
  getEchartsHost,
  stubPlotSize,
} from "@/Utils/Chart/__tests__/chartTestUtils";

const data = [
  { value: 420, label: "Signed up" },
  { value: 1200, label: "Visited" },
  { value: 96, label: "Paid" },
];

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

function renderChart(props: Partial<ComponentProps<typeof ChartFunnel>> = {}) {
  return render(
    <ChartFunnel data={data} {...props}>
      <ChartLegend showPercent />
    </ChartFunnel>,
  );
}

test("it should sort stages from the largest and summarize them", () => {
  renderChart();

  expect(screen.getByRole("img").getAttribute("aria-label")).toBe(
    "Funnel chart with 3 stages, from Visited (1,200) to Paid (96).",
  );
  expect(
    screen.getAllByRole("rowheader").map((cell) => cell.textContent),
  ).toEqual(["Visited", "Signed up", "Paid"]);
});

test("it should keep the data order with sort none", () => {
  renderChart({ sort: "none" });

  expect(screen.getAllByRole("rowheader")[0].textContent).toBe("Signed up");
});

test("it should compare shares to the largest stage with sort none", () => {
  renderChart({ sort: "none" });

  expect(screen.getByRole("button", { name: /Visited/ }).textContent).toBe(
    "Visited100%",
  );
  expect(screen.getByRole("button", { name: /Signed up/ }).textContent).toBe(
    "Signed up35%",
  );
});

test("it should compare each stage to the largest", () => {
  renderChart();

  expect(screen.getByRole("button", { name: /Paid/ }).textContent).toBe(
    "Paid8%",
  );
});

test("it should announce stages in visual order", () => {
  renderChart();

  fireEvent.keyDown(screen.getByRole("img"), { key: "ArrowRight" });

  expect(screen.getByRole("status").textContent).toBe("Visited 1,200 (100%)");
});

test("it should mount ECharts with sorted data and no engine sort", () => {
  stubPlotSize({ width: 320, height: 240 });

  renderChart({ align: "left", animation: false });

  const option = getInstanceByDom(getEchartsHost())?.getOption() as {
    series: Array<{
      data: Array<{ name: string }>;
      funnelAlign: string;
      sort: string;
    }>;
  };

  expect(option.series[0].sort).toBe("none");
  expect(option.series[0].funnelAlign).toBe("left");
  expect(option.series[0].data.map((item) => item.name)).toEqual([
    "Visited",
    "Signed up",
    "Paid",
  ]);
});
