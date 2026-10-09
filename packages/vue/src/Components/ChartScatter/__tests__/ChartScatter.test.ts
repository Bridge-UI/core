// ** External Imports
import { flushPromises, mount } from "@vue/test-utils";
import { getInstanceByDom } from "echarts/core";
import { afterEach, expect, test, vi } from "vitest";
import { h } from "vue";

// ** Local Imports
import { ChartAxis } from "@/Components/ChartAxis";
import { ChartScatter } from "@/Components/ChartScatter";
import { ChartScatterSeries } from "@/Components/ChartScatterSeries";
import { ChartTooltip } from "@/Components/ChartTooltip";
import {
  getEchartsHost,
  pressChartKey,
  stubPlotSize,
} from "@/Utils/Charts/__tests__/chartTestUtils";

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

async function mountChart(props: Record<string, unknown> = {}) {
  const wrapper = mount(ChartScatter, {
    props,
    slots: {
      default: () => [
        h(ChartScatterSeries, {
          name: "Customers",
          sizeName: "Orders",
          data: [
            [31, 520, 4],
            [24, 340, 2],
          ],
        }),
        h(ChartScatterSeries, { name: "Leads", data: [[40, 100]] }),
        h(ChartAxis, { label: "Age", position: "x" }),
        h(ChartAxis, { position: "y", label: "Ticket" }),
        h(ChartTooltip, { "data-testid": "tooltip" }),
      ],
    },
  });

  await flushPromises();

  return wrapper;
}

test("it should summarize series and points", async () => {
  const wrapper = await mountChart();

  expect(wrapper.find("[role='img']").attributes("aria-label")).toBe(
    "Scatter chart with 2 series (Customers, Leads) and 3 points.",
  );
  expect(wrapper.findAll("thead th").map((cell) => cell.text())).toEqual([
    "Series",
    "Age",
    "Ticket",
    "Orders",
  ]);
});

test("it should move through points by x and show them in the tooltip", async () => {
  const wrapper = await mountChart();

  await pressChartKey(wrapper, "ArrowRight");

  expect(wrapper.find("[role='status']").text()).toBe(
    "Customers: Age 24, Ticket 340, Orders 2",
  );
  expect(wrapper.find("[data-testid='tooltip']").text()).toContain("Customers");

  await pressChartKey(wrapper, "End");

  expect(wrapper.find("[role='status']").text()).toBe(
    "Leads: Age 40, Ticket 100",
  );
});

test("it should mount ECharts with scaled bubbles", async () => {
  stubPlotSize({ width: 320, height: 180 });

  const wrapper = await mountChart({ animation: false, bubbleSize: [10, 30] });

  const option = getInstanceByDom(getEchartsHost(wrapper))?.getOption() as {
    series: Array<{ symbolSize: (point: number[]) => number }>;
  };

  expect(option.series[1].symbolSize([0, 0])).toBe(8);
  expect(option.series[0].symbolSize([0, 0, 4])).toBe(30);
  expect(option.series[0].symbolSize([0, 0, 2])).toBe(10);

  wrapper.unmount();
});

test("it should color points by their y range", async () => {
  stubPlotSize({ width: 320, height: 240 });

  const wrapper = mount(ChartScatter, {
    props: { animation: false },
    slots: {
      default: () => [
        h(ChartScatterSeries, {
          name: "Runs",
          color: "#888888",
          colorRanges: [{ min: 10, label: "Fast", color: "#ff0000" }],
          data: [
            [1, 5],
            [2, 20],
          ],
        }),
      ],
    },
  });

  await flushPromises();

  const option = getInstanceByDom(getEchartsHost(wrapper))?.getOption() as {
    series: Array<{ data: unknown[] }>;
  };

  expect(option.series[0].data[0]).toEqual([1, 5]);
  expect(option.series[0].data[1]).toMatchObject({ value: [2, 20] });
  expect(wrapper.findAll("td")[3].text()).toBe("20 (Fast)");
});
