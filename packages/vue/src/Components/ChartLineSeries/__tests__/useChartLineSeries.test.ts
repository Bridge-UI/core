// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test } from "vitest";
import { defineComponent, h } from "vue";

// ** Local Imports
import { ChartLine } from "@/Components/ChartLine";
import {
  useChartLineSeries,
  type ChartLineSeriesOwnProps,
} from "@/Components/ChartLineSeries";

function mountUseChartLineSeries(props: ChartLineSeriesOwnProps) {
  let result!: ReturnType<typeof useChartLineSeries>;

  const Probe = defineComponent({
    setup() {
      result = useChartLineSeries(props);

      return () => h("div");
    },
  });

  mount(ChartLine, {
    slots: { default: () => h(Probe) },
    props: { categories: ["Jan", "Feb"] },
  });

  return result;
}

test("it should build a line entry with a normalized reference list", () => {
  const result = mountUseChartLineSeries({
    name: "A",
    data: [1, 2],
    reference: { value: 10 },
  });

  expect(result.entry.value).toMatchObject({
    name: "A",
    kind: "line",
    reference: [{ value: 10 }],
  });
  expect(result.entry.value.area).toBeUndefined();
});
