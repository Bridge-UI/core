// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test } from "vitest";
import { defineComponent, h, nextTick } from "vue";

// ** Local Imports
import { useChartLine, type ChartLineOwnProps } from "@/Components/ChartLine";

function mountUseChartLine(props: Partial<ChartLineOwnProps> = {}) {
  let result!: ReturnType<typeof useChartLine>;

  const Probe = defineComponent({
    setup() {
      result = useChartLine(
        { categories: ["Jan", "Feb"], ...props },
        { size: "md", height: 280, animation: true },
      );

      return () => h("div");
    },
  });

  mount(Probe);

  return result;
}

test("it should merge default size, height, and animation", () => {
  const result = mountUseChartLine();

  expect(result.merged.value.size).toBe("md");
  expect(result.merged.value.height).toBe(280);
  expect(result.merged.value.animation).toBe(true);
});

test("it should be empty until a series registers", async () => {
  const result = mountUseChartLine();

  expect(result.frame.isEmpty.value).toBe(true);
  expect(result.context.value.family).toBe("line");

  result.context.value.upsertSeries?.({
    id: "a",
    name: "A",
    kind: "line",
    data: [1, 2],
  });

  await nextTick();

  expect(result.frame.isEmpty.value).toBe(false);
  expect(result.context.value.legendItems).toHaveLength(1);
  expect(result.frame.table.value.rows).toEqual([
    { key: "0-Jan", cells: ["Jan", "1"] },
    { key: "1-Feb", cells: ["Feb", "2"] },
  ]);
});

test("it should hide and show a series", async () => {
  const result = mountUseChartLine();

  result.context.value.upsertSeries?.({
    id: "a",
    name: "A",
    kind: "line",
    data: [1, 2],
  });

  result.context.value.toggleItem("a");
  await nextTick();

  expect(result.context.value.legendItems[0].hidden).toBe(true);

  result.context.value.toggleItem("a");
  await nextTick();

  expect(result.context.value.legendItems[0].hidden).toBe(false);
});
