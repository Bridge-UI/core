// ** External Imports
import { flushPromises, mount } from "@vue/test-utils";
import { getInstanceByDom } from "echarts/core";
import { afterEach, expect, test, vi } from "vitest";
import { h } from "vue";

// ** Local Imports
import { ChartFunnel } from "@/Components/ChartFunnel";
import { ChartLegend } from "@/Components/ChartLegend";
import {
  getEchartsHost,
  pressChartKey,
  stubPlotSize,
} from "@/Utils/Chart/__tests__/chartTestUtils";

const data = [
  { value: 420, label: "Signed up" },
  { value: 1200, label: "Visited" },
  { value: 96, label: "Paid" },
];

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

async function mountChart(props: Record<string, unknown> = {}) {
  const wrapper = mount(ChartFunnel, {
    props: { data, ...props },
    slots: { default: () => h(ChartLegend, { showPercent: true }) },
  });

  await flushPromises();

  return wrapper;
}

test("it should sort stages from the largest and summarize them", async () => {
  const wrapper = await mountChart();

  expect(wrapper.find("[role='img']").attributes("aria-label")).toBe(
    "Funnel chart with 3 stages, from Visited (1,200) to Paid (96).",
  );
  expect(wrapper.findAll("tbody th").map((cell) => cell.text())).toEqual([
    "Visited",
    "Signed up",
    "Paid",
  ]);
});

test("it should keep the data order with sort none", async () => {
  const wrapper = await mountChart({ sort: "none" });

  expect(wrapper.find("tbody th").text()).toBe("Signed up");
});

test("it should announce stages in visual order", async () => {
  const wrapper = await mountChart();

  await pressChartKey(wrapper, "ArrowRight");

  expect(wrapper.find("[role='status']").text()).toBe("Visited 1,200 (100%)");
});

test("it should mount ECharts with sorted data and no engine sort", async () => {
  stubPlotSize({ width: 320, height: 240 });

  const wrapper = await mountChart({ align: "left", animation: false });

  const option = getInstanceByDom(getEchartsHost(wrapper))?.getOption() as {
    series: Array<{
      data: Array<{ name: string }>;
      label: { show: boolean };
      sort: string;
    }>;
  };

  expect(option.series[0].sort).toBe("none");
  expect(option.series[0].label.show).toBe(true);
  expect(option.series[0].data.map((item) => item.name)).toEqual([
    "Visited",
    "Signed up",
    "Paid",
  ]);

  wrapper.unmount();
});
