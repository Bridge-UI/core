// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test } from "vitest";
import { defineComponent, h } from "vue";

// ** Local Imports
import { ChartScatter } from "@/Components/ChartScatter";
import { useChartScatterSeries } from "@/Components/ChartScatterSeries";

test("it should build a scatter entry", () => {
  let result!: ReturnType<typeof useChartScatterSeries>;

  const Probe = defineComponent({
    setup() {
      result = useChartScatterSeries({
        name: "A",
        symbolSize: 12,
        data: [[1, 2, 3]],
        sizeName: "Orders",
      });

      return () => h("div");
    },
  });

  mount(ChartScatter, { slots: { default: () => h(Probe) } });

  expect(result.entry.value).toMatchObject({
    name: "A",
    symbolSize: 12,
    kind: "scatter",
    sizeName: "Orders",
  });
});
