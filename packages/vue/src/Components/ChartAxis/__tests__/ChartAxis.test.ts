// ** External Imports
import { flushPromises, mount } from "@vue/test-utils";
import { expect, test } from "vitest";
import { h } from "vue";

// ** Local Imports
import { Chart } from "@/Components/Chart";
import { ChartAxis } from "@/Components/ChartAxis";
import { ChartSeries } from "@/Components/ChartSeries";

const categories = ["Jan", "Feb", "Mar"];

test("it should render nothing of its own", async () => {
  const wrapper = mount(Chart, {
    props: { categories },
    slots: {
      default: () => [
        h(ChartSeries, { name: "A", data: [1, 2, 3] }),
        h(ChartAxis, { grid: true, position: "x", label: "Month" }),
        h(ChartAxis, { grid: false, hidden: true, position: "y" }),
      ],
    },
  });

  await flushPromises();

  expect(wrapper.find("[data-chart-mock]").exists()).toBe(false);
  expect(wrapper.find("[role='figure']").exists()).toBe(true);
  expect(wrapper.find("thead").text()).toContain("A");
});
