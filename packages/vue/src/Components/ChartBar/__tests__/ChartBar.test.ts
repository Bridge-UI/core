// ** External Imports
import { flushPromises, mount } from "@vue/test-utils";
import { getInstanceByDom } from "echarts/core";
import { afterEach, expect, test, vi } from "vitest";
import { h } from "vue";

// ** Local Imports
import { ChartBar } from "@/Components/ChartBar";
import { ChartBarSeries } from "@/Components/ChartBarSeries";
import { ChartLineSeries } from "@/Components/ChartLineSeries";
import {
  getEchartsHost,
  pressChartKey,
  stubPlotSize,
} from "@/Utils/Chart/__tests__/chartTestUtils";

const categories = ["Housing", "Kids", "Food"];

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

async function mountChart(props: Record<string, unknown> = {}) {
  const wrapper = mount(ChartBar, {
    props: { categories, ...props },
    slots: {
      default: () => [
        h(ChartBarSeries, { name: "October", data: [3450, 1310, 1240] }),
        h(ChartBarSeries, { name: "Average", data: [3300, 1200, null] }),
      ],
    },
  });

  await flushPromises();

  return wrapper;
}

test("it should render a summary and data table", async () => {
  const wrapper = await mountChart();

  expect(wrapper.find("[role='img']").attributes("aria-label")).toContain(
    "October",
  );
  expect(wrapper.findAll("td").map((cell) => cell.text())).toEqual([
    "3,450",
    "3,300",
    "1,310",
    "1,200",
    "1,240",
    "—",
  ]);
});

test("it should navigate categories with the keyboard", async () => {
  const wrapper = await mountChart();

  await pressChartKey(wrapper, "End");

  expect(wrapper.find("[role='status']").text()).toBe("Food: October 1,240");
});

test("it should mount ECharts with horizontal bars", async () => {
  stubPlotSize({ width: 320, height: 180 });

  const wrapper = await mountChart({
    animation: false,
    orientation: "horizontal",
  });

  const option = getInstanceByDom(getEchartsHost(wrapper))?.getOption() as {
    xAxis: Array<{ type: string }>;
    yAxis: Array<{ data: string[]; type: string }>;
  };

  expect(option.xAxis[0].type).toBe("value");
  expect(option.yAxis[0].type).toBe("category");
  expect(option.yAxis[0].data).toEqual(categories);

  wrapper.unmount();
});

test("it should throw when a line series is placed inside", () => {
  expect(() =>
    mount(ChartBar, {
      props: { categories },
      global: { config: { warnHandler: () => undefined } },
      slots: { default: () => h(ChartLineSeries, { data: [1], name: "Goal" }) },
    }),
  ).toThrow("ChartLineSeries must be used within ChartLine");
});
