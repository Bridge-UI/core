// ** External Imports
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { getInstanceByDom } from "echarts/core";
import type { ComponentProps } from "react";
import { afterEach, expect, test, vi } from "vitest";

// ** Local Imports
import { ChartAxis } from "@/Components/ChartAxis";
import { ChartScatter } from "@/Components/ChartScatter";
import { ChartScatterSeries } from "@/Components/ChartScatterSeries";
import { ChartTooltip } from "@/Components/ChartTooltip";
import {
  getEchartsHost,
  stubPlotSize,
} from "@/Utils/Charts/__tests__/chartTestUtils";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

function renderChart(props: Partial<ComponentProps<typeof ChartScatter>> = {}) {
  return render(
    <ChartScatter {...props}>
      <ChartScatterSeries
        name="Customers"
        sizeName="Orders"
        data={[
          [31, 520, 4],
          [24, 340, 2],
        ]}
      />
      <ChartScatterSeries name="Leads" data={[[40, 100]]} />
      <ChartAxis label="Age" position="x" />
      <ChartAxis position="y" label="Ticket" />
      <ChartTooltip data-testid="tooltip" />
    </ChartScatter>,
  );
}

test("it should summarize series and points", () => {
  renderChart();

  expect(screen.getByRole("img").getAttribute("aria-label")).toBe(
    "Scatter chart with 2 series (Customers, Leads) and 3 points.",
  );
});

test("it should list every point in the data table", () => {
  renderChart();

  expect(
    screen.getAllByRole("columnheader").map((cell) => cell.textContent),
  ).toEqual(["Series", "Age", "Ticket", "Orders"]);
  expect(screen.getAllByRole("rowheader")).toHaveLength(3);
});

test("it should move through points by x and show them in the tooltip", () => {
  renderChart();

  const plot = screen.getByRole("img");

  fireEvent.keyDown(plot, { key: "ArrowRight" });

  expect(screen.getByRole("status").textContent).toBe(
    "Customers: Age 24, Ticket 340, Orders 2",
  );
  expect(screen.getByTestId("tooltip").textContent).toContain("Customers");

  fireEvent.keyDown(plot, { key: "End" });

  expect(screen.getByRole("status").textContent).toBe(
    "Leads: Age 40, Ticket 100",
  );
});

test("it should mount ECharts with value axes and scaled bubbles", () => {
  stubPlotSize({ width: 320, height: 180 });

  renderChart({ animation: false, bubbleSize: [10, 30] });

  const option = getInstanceByDom(getEchartsHost())?.getOption() as {
    series: Array<{ symbolSize: (point: number[]) => number }>;
    xAxis: Array<{ type: string }>;
  };

  expect(option.xAxis[0].type).toBe("value");
  expect(option.series[1].symbolSize([0, 0])).toBe(8);
  expect(option.series[0].symbolSize([0, 0, 4])).toBe(30);
  expect(option.series[0].symbolSize([0, 0, 2])).toBe(10);
});

test("it should show the empty message", () => {
  render(<ChartScatter />);

  expect(screen.getByText("No data")).toBeTruthy();
});
