// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test } from "vitest";
import { defineComponent, h } from "vue";

// ** Local Imports
import { Chart, useChartContext } from "@/Components/Chart";
import {
  useChartSeries,
  type ChartSeriesOwnProps,
} from "@/Components/ChartSeries";
import { BridgeUIProvider } from "@/Provider";

const libDefaults = { type: "line", curve: "linear" } as const;

function mountUseChartSeries(props: ChartSeriesOwnProps) {
  let result!: {
    chart: ReturnType<typeof useChartContext>;
    series: ReturnType<typeof useChartSeries>;
  };

  const Probe = defineComponent({
    setup() {
      result = {
        chart: useChartContext(),
        series: useChartSeries(props, libDefaults),
      };

      return () => h("div");
    },
  });

  mount(Chart, {
    slots: { default: () => h(Probe) },
    props: { categories: ["Jan", "Feb"] },
  });

  return result;
}

test("it should build the entry from props and defaults", () => {
  const { series } = mountUseChartSeries({ name: "A", data: [1, 2] });

  expect(series.entry.value).toMatchObject({
    name: "A",
    type: "line",
    data: [1, 2],
    curve: "linear",
  });
});

test("it should register the entry in the chart context", () => {
  const { chart, series } = mountUseChartSeries({
    name: "A",
    type: "bar",
    data: [1, 2],
    curve: "smooth",
  });

  expect(chart.value.series).toHaveLength(1);
  expect(chart.value.series[0]?.type).toBe("bar");
  expect(chart.value.series[0]?.curve).toBe("smooth");
  expect(chart.value.series[0]?.id).toBe(series.entry.value.id);
});

test("it should apply the registry default type", () => {
  let result!: ReturnType<typeof useChartSeries>;

  const Probe = defineComponent({
    setup() {
      result = useChartSeries({ name: "A", data: [1, 2] }, libDefaults);

      return () => h("div");
    },
  });

  mount(BridgeUIProvider, {
    props: {
      components: { ChartSeries: { defaultProps: { type: "bar" } } },
    },
    slots: {
      default: () =>
        h(Chart, { categories: ["Jan", "Feb"] }, { default: () => h(Probe) }),
    },
  });

  expect(result.entry.value.type).toBe("bar");
});

test("it should throw outside a Chart", () => {
  const Standalone = defineComponent({
    setup() {
      useChartSeries({ name: "A", data: [1] }, libDefaults);

      return () => h("div");
    },
  });

  expect(() =>
    mount(Standalone, {
      global: { config: { warnHandler: () => undefined } },
    }),
  ).toThrow("Chart components must be used within a Chart");
});
