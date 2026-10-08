// ** External Imports
import { flushPromises, mount } from "@vue/test-utils";
import { expect, test } from "vitest";
import { defineComponent, h } from "vue";

// ** Local Imports
import {
  useChartLegend,
  type ChartLegendOwnProps,
} from "@/Components/ChartLegend";
import { ChartLine } from "@/Components/ChartLine";
import { ChartLineSeries } from "@/Components/ChartLineSeries";

const libDefaults = {
  align: "center",
  interactive: true,
  position: "bottom",
} as const;

async function mountUseChartLegend(props: ChartLegendOwnProps = {}) {
  let result!: ReturnType<typeof useChartLegend>;

  const Probe = defineComponent({
    setup() {
      result = useChartLegend(props, libDefaults);

      return () => h("div");
    },
  });

  mount(ChartLine, {
    props: { categories: ["Jan", "Feb"] },
    slots: {
      default: () => [
        h(ChartLineSeries, { data: [1, 2], name: "Revenue" }),
        h(Probe),
      ],
    },
  });

  await flushPromises();

  return result;
}

test("it should merge default align, position, and interactive", async () => {
  const result = await mountUseChartLegend();

  expect(result.interactive.value).toBe(true);
  expect(result.merged.value.align).toBe("center");
  expect(result.merged.value.position).toBe("bottom");
});

test("it should expose chart series as items", async () => {
  const result = await mountUseChartLegend();

  expect(result.items.value.map((item) => item.name)).toEqual(["Revenue"]);
});

test("it should build pressed button binds for interactive items", async () => {
  const result = await mountUseChartLegend();

  const item = result.items.value[0];
  const bind = item ? result.getItemBind(item) : {};

  expect(bind.type).toBe("button");
  expect(bind["aria-pressed"]).toBe(true);
});

test("it should omit button semantics when not interactive", async () => {
  const result = await mountUseChartLegend({ interactive: false });

  const item = result.items.value[0];
  const bind = item ? result.getItemBind(item) : {};

  expect(bind.type).toBeUndefined();
  expect(bind["aria-pressed"]).toBeUndefined();
});
