// ** External Imports
import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react";
import { getInstanceByDom } from "echarts/core";
import type { ComponentProps } from "react";
import { afterEach, expect, test, vi } from "vitest";

// ** Local Imports
import { ChartLegend } from "@/Components/ChartLegend";
import { ChartPie } from "@/Components/ChartPie";
import { ChartTooltip } from "@/Components/ChartTooltip";
import {
  getEchartsHost,
  stubPlotSize,
} from "@/Utils/Charts/__tests__/chartTestUtils";

const data = [
  { value: 3450, label: "Housing" },
  { value: 1310, label: "Kids" },
  { value: 1240, label: "Groceries" },
  { value: 0, label: "Fun" },
];

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

function renderChart(props: Partial<ComponentProps<typeof ChartPie>> = {}) {
  return render(
    <ChartPie data={data} {...props}>
      <ChartLegend showValue showPercent position="right" />
      <ChartTooltip data-testid="tooltip" />
    </ChartPie>,
  );
}

test("it should summarize slices with percents that sum to 100", () => {
  renderChart();

  expect(screen.getByRole("img").getAttribute("aria-label")).toBe(
    "Pie chart with 3 slices: Housing 57%, Kids 22%, Groceries 21%.",
  );
});

test("it should list slices with value and share in the data table", () => {
  renderChart();

  expect(
    screen.getAllByRole("columnheader").map((cell) => cell.textContent),
  ).toEqual(["Category", "Value", "Share"]);
  expect(screen.getAllByRole("cell").map((cell) => cell.textContent)).toEqual([
    "3,450",
    "57%",
    "1,310",
    "22%",
    "1,240",
    "21%",
  ]);
});

test("it should show values and percents in a side legend", () => {
  renderChart();

  const legend = screen.getByRole("list", { name: "Legend" });
  const kids = within(legend).getByRole("button", { name: /Kids/ });

  expect(kids.textContent).toBe("Kids1,31022%");
  expect(screen.getByRole("figure").className).toContain("flex-row");
});

test("it should recompute percents when a slice is hidden", () => {
  renderChart();

  fireEvent.click(screen.getByRole("button", { name: /Housing/ }));

  expect(screen.getByRole("button", { name: /Kids/ }).textContent).toBe(
    "Kids1,31051%",
  );
  expect(screen.getByRole("button", { name: /Housing/ }).textContent).toBe(
    "Housing3,450—",
  );
});

test("it should announce the active slice with its share", () => {
  renderChart();

  fireEvent.keyDown(screen.getByRole("img"), { key: "ArrowRight" });

  expect(screen.getByTestId("tooltip").textContent).toContain("57%");
  expect(screen.getByRole("status").textContent).toBe("Housing 3,450 (57%)");
});

test("it should group small slices into Other", () => {
  renderChart({ maxSlices: 2 });

  expect(screen.queryByRole("button", { name: /Kids/ })).toBeNull();
  expect(screen.getByRole("button", { name: /Other/ })).toBeTruthy();
});

test("it should render the center slot for donuts only", () => {
  const { rerender } = renderChart({
    variant: "donut",
    slots: { center: <strong>R$ 6,9 mil</strong> },
  });

  expect(screen.getByText("R$ 6,9 mil")).toBeTruthy();

  rerender(
    <ChartPie data={data} slots={{ center: <strong>R$ 6,9 mil</strong> }} />,
  );

  expect(screen.queryByText("R$ 6,9 mil")).toBeNull();
});

test("it should mount a donut ring with plot labels", () => {
  stubPlotSize({ width: 320, height: 240 });

  renderChart({
    labels: true,
    animation: false,
    variant: "donut",
    labelContent: "percent",
  });

  const option = getInstanceByDom(getEchartsHost())?.getOption() as {
    series: Array<{ label: { show: boolean }; radius: string[] }>;
  };

  expect(option.series[0].label.show).toBe(true);
  expect(option.series[0].radius).toEqual(["49%", "70%"]);
});

test("it should show the empty message without positive slices", () => {
  render(<ChartPie data={[{ value: 0, label: "Fun" }]} />);

  expect(screen.getByText("No data")).toBeTruthy();
});

test("it should draw a rose with slice gaps and corners", () => {
  stubPlotSize({ width: 320, height: 240 });

  renderChart({
    padAngle: 4,
    rose: "radius",
    cornerRadius: 6,
    animation: false,
  });

  const option = getInstanceByDom(getEchartsHost())?.getOption() as {
    series: Array<{
      itemStyle: { borderRadius: number };
      padAngle: number;
      roseType: string;
    }>;
  };

  expect(option.series[0].padAngle).toBe(4);
  expect(option.series[0].roseType).toBe("radius");
  expect(option.series[0].itemStyle.borderRadius).toBe(6);
});
