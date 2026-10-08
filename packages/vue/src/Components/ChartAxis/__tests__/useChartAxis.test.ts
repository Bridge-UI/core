// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test } from "vitest";
import { defineComponent, h, nextTick, reactive } from "vue";

// ** Local Imports
import { useChartAxis, type ChartAxisOwnProps } from "@/Components/ChartAxis";
import { ChartLine } from "@/Components/ChartLine";
import { ChartPie } from "@/Components/ChartPie";

function mountUseChartAxis(props: ChartAxisOwnProps) {
  let result!: ReturnType<typeof useChartAxis>;

  const Probe = defineComponent({
    setup() {
      result = useChartAxis(props);

      return () => h("div");
    },
  });

  mount(ChartLine, {
    slots: { default: () => h(Probe) },
    props: { categories: ["Jan", "Feb"] },
  });

  return result;
}

test("it should omit undefined options", () => {
  const result = mountUseChartAxis({ position: "y", label: "Revenue" });

  expect(result.options.value).toEqual({ label: "Revenue" });
});

test("it should keep options stable when the formatter changes", async () => {
  const props = reactive<ChartAxisOwnProps>({
    position: "y",
    formatTick: (value) => `${value}-a`,
  });

  const result = mountUseChartAxis(props);
  const first = result.options.value;

  props.formatTick = (value) => `${value}-b`;
  await nextTick();

  expect(result.options.value).toBe(first);
  expect(result.options.value.formatTick?.(5)).toBe("5-b");
});

test("it should throw outside a chart", () => {
  const Standalone = defineComponent({
    setup() {
      useChartAxis({ position: "x" });

      return () => h("div");
    },
  });

  expect(() =>
    mount(Standalone, {
      global: { config: { warnHandler: () => undefined } },
    }),
  ).toThrow("Chart components must be used within");
});

test("it should throw inside a chart without axes", () => {
  const Probe = defineComponent({
    setup() {
      useChartAxis({ position: "x" });

      return () => h("div");
    },
  });

  expect(() =>
    mount(ChartPie, {
      slots: { default: () => h(Probe) },
      props: { data: [{ value: 1, label: "A" }] },
      global: { config: { warnHandler: () => undefined } },
    }),
  ).toThrow(
    "ChartAxis must be used within ChartLine, ChartBar, or ChartScatter",
  );
});
