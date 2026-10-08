// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test } from "vitest";
import { defineComponent, h } from "vue";

// ** Local Imports
import { useChartFunnel } from "@/Components/ChartFunnel";

test("it should merge the funnel defaults and keep zero stages", () => {
  let result!: ReturnType<typeof useChartFunnel>;

  const Probe = defineComponent({
    setup() {
      result = useChartFunnel(
        {
          data: [
            { value: 4, label: "A" },
            { value: 0, label: "B" },
          ],
        },
        { size: "md", height: 280, labels: "inside", sort: "descending" },
      );

      return () => h("div");
    },
  });

  mount(Probe);

  expect(result.context.value.family).toBe("funnel");
  expect(result.merged.value.sort).toBe("descending");
  expect(result.context.value.legendItems).toMatchObject([
    { name: "A", percent: 100 },
    { name: "B", percent: 0 },
  ]);
});
