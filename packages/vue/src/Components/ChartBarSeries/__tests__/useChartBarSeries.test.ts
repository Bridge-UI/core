// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test } from "vitest";
import { defineComponent, h } from "vue";

// ** Local Imports
import { ChartBar } from "@/Components/ChartBar";
import { useChartBarSeries } from "@/Components/ChartBarSeries";

test("it should build a bar entry", () => {
  let result!: ReturnType<typeof useChartBarSeries>;

  const Probe = defineComponent({
    setup() {
      result = useChartBarSeries({
        name: "A",
        stack: "s",
        data: [1, 2],
        reference: [{ type: "max" }],
      });

      return () => h("div");
    },
  });

  mount(ChartBar, {
    slots: { default: () => h(Probe) },
    props: { categories: ["Q1", "Q2"] },
  });

  expect(result.entry.value).toMatchObject({
    name: "A",
    stack: "s",
    kind: "bar",
    reference: [{ type: "max" }],
  });
});
