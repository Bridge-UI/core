// ** External Imports
import { flushPromises, mount } from "@vue/test-utils";
import { getInstanceByDom } from "echarts/core";
import { afterEach, expect, test, vi } from "vitest";
import { h } from "vue";

// ** Local Imports
import { ChartBar } from "@/Components/ChartBar";
import { ChartBarSeries } from "@/Components/ChartBarSeries";
import {
  getEchartsHost,
  stubPlotSize,
} from "@/Utils/Chart/__tests__/chartTestUtils";

type BarOption = {
  data: Array<null | { itemStyle: { borderRadius: number | number[] } }>;
  label?: { show: boolean };
  stack?: string;
};

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

test("it should round only the outermost bar of a stack", async () => {
  stubPlotSize({ width: 320, height: 180 });

  const wrapper = mount(ChartBar, {
    props: { stack: "total", animation: false, categories: ["Q1", "Q2"] },
    slots: {
      default: () => [
        h(ChartBarSeries, { name: "A", data: [1, -2] }),
        h(ChartBarSeries, { name: "B", labels: true, data: [2, null] }),
      ],
    },
  });

  await flushPromises();

  const option = getInstanceByDom(getEchartsHost(wrapper))?.getOption() as {
    series: BarOption[];
  };

  const [first, second] = option.series;

  expect(first.stack).toBe("total");
  expect(second.label?.show).toBe(true);
  expect(first.data[0]?.itemStyle.borderRadius).toBe(0);
  expect(first.data[1]?.itemStyle.borderRadius).toEqual([0, 0, 4, 4]);
  expect(second.data[0]?.itemStyle.borderRadius).toEqual([4, 4, 0, 0]);

  wrapper.unmount();
});
