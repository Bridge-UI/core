// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test } from "vitest";
import { defineComponent, h, nextTick } from "vue";

// ** Local Imports
import { useChartPie, type ChartPieOwnProps } from "@/Components/ChartPie";

function mountUseChartPie(props: Partial<ChartPieOwnProps> = {}) {
  let result!: ReturnType<typeof useChartPie>;

  const Probe = defineComponent({
    setup() {
      result = useChartPie(
        {
          data: [
            { value: 3, label: "A" },
            { value: 1, label: "B" },
          ],
          ...props,
        },
        { size: "md", height: 280, variant: "pie", thickness: 0.3 },
      );

      return () => h("div");
    },
  });

  mount(Probe);

  return result;
}

test("it should merge the pie defaults", () => {
  const result = mountUseChartPie();

  expect(result.variant.value).toBe("pie");
  expect(result.merged.value.thickness).toBe(0.3);
  expect(result.context.value.family).toBe("pie");
});

test("it should expose slices as legend items with percents", () => {
  const result = mountUseChartPie();

  expect(result.context.value.legendItems).toMatchObject([
    { value: 3, name: "A", percent: 75 },
    { value: 1, name: "B", percent: 25 },
  ]);
});

test("it should drop the percent of a hidden slice", async () => {
  const result = mountUseChartPie();

  result.context.value.toggleItem("slice-0");
  await nextTick();

  expect(result.context.value.legendItems).toMatchObject([
    { name: "A", hidden: true, percent: undefined },
    { name: "B", percent: 100, hidden: false },
  ]);
});
