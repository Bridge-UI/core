// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test } from "vitest";
import { defineComponent, h } from "vue";

// ** Local Imports
import { useChartBar, type ChartBarOwnProps } from "@/Components/ChartBar";

function mountUseChartBar(props: Partial<ChartBarOwnProps> = {}) {
  let result!: ReturnType<typeof useChartBar>;

  const Probe = defineComponent({
    setup() {
      result = useChartBar(
        { categories: ["Q1", "Q2"], ...props },
        {
          radius: 4,
          size: "md",
          height: 280,
          animation: true,
          orientation: "vertical",
        },
      );

      return () => h("div");
    },
  });

  mount(Probe);

  return result;
}

test("it should merge the bar defaults", () => {
  const result = mountUseChartBar();

  expect(result.merged.value.radius).toBe(4);
  expect(result.merged.value.orientation).toBe("vertical");
  expect(result.context.value.family).toBe("bar");
});

test("it should let props override the defaults", () => {
  const result = mountUseChartBar({ radius: 0, orientation: "horizontal" });

  expect(result.merged.value.radius).toBe(0);
  expect(result.merged.value.orientation).toBe("horizontal");
});
