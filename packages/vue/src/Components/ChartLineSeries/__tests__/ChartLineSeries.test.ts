// ** External Imports
import { flushPromises, mount } from "@vue/test-utils";
import { getInstanceByDom } from "echarts/core";
import { afterEach, expect, test, vi } from "vitest";
import { h } from "vue";

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
  step: false | string;
};

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

test("it should render a hidden placeholder and register a table column", async () => {
  const wrapper = mount(ChartLine, {
    props: { categories: ["Jan", "Feb"] },
    slots: {
      default: () => h(ChartLineSeries, { data: [1, 2], name: "Revenue" }),
    },
  });

  await flushPromises();

  expect(wrapper.find("span[hidden]").exists()).toBe(true);
  expect(wrapper.findAll("thead th").map((cell) => cell.text())).toContain(
    "Revenue",
  );
});

test("it should inherit root defaults and override them per series", async () => {
  stubPlotSize({ width: 320, height: 180 });

  const wrapper = mount(ChartLine, {
    props: {
      area: true,
      step: "middle",
      curve: "smooth",
      animation: false,
      categories: ["Jan", "Feb"],
    },
    slots: {
      default: () => [
        h(ChartLineSeries, { name: "A", data: [1, 2] }),
        h(ChartLineSeries, {
          name: "B",
          step: false,
          area: false,
          dashed: true,
          data: [2, 3],
          curve: "linear",
          showPoints: true,
          reference: { type: "average" },
        }),
      ],
    },
  });

  await flushPromises();

  const option = getInstanceByDom(getEchartsHost(wrapper))?.getOption() as {
    series: LineOption[];
  };

  const [first, second] = option.series;

  expect(first.smooth).toBe(true);
  expect(first.step).toBe("middle");
  expect(first.areaStyle).toBeDefined();

  expect(second.step).toBe(false);
  expect(second.smooth).toBe(false);
  expect(second.showSymbol).toBe(true);
  expect(second.areaStyle).toBeUndefined();
  expect(second.lineStyle.type).toBe("dashed");
  expect(second.markLine?.data).toHaveLength(1);

  wrapper.unmount();
});
