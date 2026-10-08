// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test } from "vitest";
import { defineComponent, h, nextTick } from "vue";

// ** Local Imports
import { useChartScatter } from "@/Components/ChartScatter";

function mountUseChartScatter() {
  let result!: ReturnType<typeof useChartScatter>;

  const Probe = defineComponent({
    setup() {
      result = useChartScatter(
        {},
        { size: "md", height: 280, symbolSize: 8, animation: true },
      );

      return () => h("div");
    },
  });

  mount(Probe);

  return result;
}

test("it should merge the scatter defaults", () => {
  const result = mountUseChartScatter();

  expect(result.merged.value.symbolSize).toBe(8);
  expect(result.context.value.family).toBe("scatter");
});

test("it should list registered points", async () => {
  const result = mountUseChartScatter();

  result.context.value.upsertSeries?.({
    id: "a",
    name: "A",
    kind: "scatter",
    data: [
      [2, 1],
      [1, 1],
    ],
  });

  await nextTick();

  expect(result.frame.isEmpty.value).toBe(false);
  expect(result.frame.table.value.rows).toHaveLength(2);
});
