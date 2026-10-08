// ** External Imports
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { getInstanceByDom } from "echarts/core";
import type { ComponentProps } from "react";
import { afterEach, expect, test, vi } from "vitest";

// ** Local Imports
import { ChartBarSeries } from "@/Components/ChartBarSeries";
import { ChartLine } from "@/Components/ChartLine";
import { ChartLineSeries } from "@/Components/ChartLineSeries";
import { BridgeUIProvider } from "@/Provider";
import {
  getEchartsHost,
  stubPlotSize,
} from "@/Utils/Chart/__tests__/chartTestUtils";

const categories = ["Jan", "Feb", "Mar"];

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

function renderChart(props: Partial<ComponentProps<typeof ChartLine>> = {}) {
  return render(
    <ChartLine categories={categories} {...props}>
      <ChartLineSeries name="Revenue" data={[10, 20, 30]} />
      <ChartLineSeries area name="Costs" data={[5, null, 15]} />
    </ChartLine>,
  );
}

test("it should render a figure with an accessible plot summary", () => {
  renderChart();

  expect(screen.getByRole("figure")).toBeTruthy();

  const plot = screen.getByRole("img");
  const label = plot.getAttribute("aria-label") ?? "";

  expect(label).toContain("Revenue");
  expect(label).toContain("Costs");
  expect(label).toContain("Jan");
  expect(label).toContain("Mar");
  expect(plot.getAttribute("tabindex")).toBe("0");
});

test("it should use the summary prop as the plot label", () => {
  renderChart({ summary: "Revenue grows every month" });

  expect(screen.getByRole("img").getAttribute("aria-label")).toBe(
    "Revenue grows every month",
  );
});

test("it should render an sr-only data table with formatted values", () => {
  renderChart();

  const table = screen.getByRole("table", { hidden: true });

  expect(table.className).toContain("sr-only");
  expect(screen.getByRole("columnheader", { name: "Revenue" })).toBeTruthy();
  expect(screen.getByRole("rowheader", { name: "Feb" })).toBeTruthy();
  expect(screen.getAllByRole("cell").map((cell) => cell.textContent)).toEqual([
    "10",
    "5",
    "20",
    "—",
    "30",
    "15",
  ]);
});

test("it should format date categories and label the table column Date", () => {
  render(
    <ChartLine
      formatDate={(date) => `day ${date.getDate()}`}
      categories={[new Date(2026, 9, 1), new Date(2026, 9, 2)]}
    >
      <ChartLineSeries name="Spent" data={[100, 140]} />
    </ChartLine>,
  );

  expect(screen.getByRole("columnheader", { name: "Date" })).toBeTruthy();
  expect(screen.getByRole("rowheader", { name: "day 2" })).toBeTruthy();
  expect(screen.getByRole("img").getAttribute("aria-label")).toContain(
    "from day 1 to day 2",
  );
});

test("it should show the empty message when there is no series", () => {
  render(<ChartLine categories={categories} />);

  expect(screen.getByText("No data")).toBeTruthy();
  expect(screen.getByRole("img").getAttribute("aria-label")).toBe("No data");
});

test("it should render the empty slot", () => {
  render(
    <ChartLine
      categories={categories}
      slots={{ empty: <span>Nothing yet</span> }}
    />,
  );

  expect(screen.getByText("Nothing yet")).toBeTruthy();
});

test("it should render the loading slot while loading", () => {
  renderChart({ loading: true, slots: { loading: <span>Loading…</span> } });

  expect(screen.getByText("Loading…")).toBeTruthy();
  expect(screen.getByRole("figure").getAttribute("aria-busy")).toBe("true");
  expect(screen.queryByText("No data")).toBeNull();
});

test("it should navigate categories with the keyboard and announce values", () => {
  renderChart();

  const plot = screen.getByRole("img");
  const status = screen.getByRole("status");

  fireEvent.keyDown(plot, { key: "ArrowRight" });

  expect(status.textContent).toBe("Jan: Revenue 10, Costs 5");

  fireEvent.keyDown(plot, { key: "End" });
  expect(status.textContent).toContain("Mar");

  fireEvent.keyDown(plot, { key: "Escape" });
  expect(status.textContent).toBe("");
});

test("it should apply width, height, and className", () => {
  renderChart({ width: 480, height: 200, className: "custom-chart" });

  const root = screen.getByRole("figure");

  expect(root.className).toContain("custom-chart");
  expect(root.style.width).toBe("480px");
  expect(screen.getByRole("img").style.height).toBe("200px");
});

test("it should default sparklines to a 48px plot", () => {
  renderChart({ sparkline: true });

  expect(screen.getByRole("img").style.height).toBe("48px");
});

test("it should keep sparklines at 48px over a registry height", () => {
  render(
    <BridgeUIProvider
      components={{ ChartLine: { defaultProps: { height: 320 } } }}
    >
      <ChartLine sparkline categories={categories}>
        <ChartLineSeries name="Trend" data={[1, 2, 3]} />
      </ChartLine>
      <ChartLine categories={categories}>
        <ChartLineSeries name="Revenue" data={[1, 2, 3]} />
      </ChartLine>
    </BridgeUIProvider>,
  );

  const [sparkline, chart] = screen.getAllByRole("img");

  expect(chart.style.height).toBe("320px");
  expect(sparkline.style.height).toBe("48px");
});

test("it should throw when a bar series is placed inside", () => {
  vi.spyOn(console, "error").mockImplementation(() => {});

  expect(() =>
    render(
      <ChartLine categories={categories}>
        <ChartBarSeries name="Orders" data={[1, 2, 3]} />
      </ChartLine>,
    ),
  ).toThrow("ChartBarSeries must be used within ChartBar");
});

test("it should wait for a plot size before mounting ECharts and follow resizes", () => {
  const resize = stubPlotSize({ width: 0, height: 0 });

  renderChart({ animation: false });

  const host = getEchartsHost();

  expect(getInstanceByDom(host)).toBeUndefined();

  resize({ width: 320, height: 180 });

  const chart = getInstanceByDom(host);

  expect(chart?.getWidth()).toBe(320);
  expect(chart?.getHeight()).toBe(180);
  expect(host.querySelector("svg")).toBeTruthy();

  resize({ width: 480, height: 200 });

  expect(chart?.getWidth()).toBe(480);
  expect(getInstanceByDom(host)).toBe(chart);
});

test("it should dispose ECharts and remove its host on unmount", () => {
  stubPlotSize({ width: 320, height: 180 });

  const view = renderChart({ animation: false });
  const host = getEchartsHost();
  const chart = getInstanceByDom(host);

  expect(chart).toBeDefined();

  view.unmount();

  expect(host.isConnected).toBe(false);
  expect(chart?.isDisposed()).toBe(true);
});
