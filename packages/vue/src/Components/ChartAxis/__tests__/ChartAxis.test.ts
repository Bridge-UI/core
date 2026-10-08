// ** External Imports
import { flushPromises, mount } from "@vue/test-utils";
import { expect, test } from "vitest";
import { h } from "vue";

// ** Local Imports
import { ChartAxis } from "@/Components/ChartAxis";
import { ChartLine } from "@/Components/ChartLine";
import { ChartLineSeries } from "@/Components/ChartLineSeries";

const categories = ["Jan", "Feb", "Mar"];

test("it should render nothing of its own", async () => {
  const wrapper = mount(ChartLine, {
    props: { categories },
    slots: {
      default: () => [
        h(ChartLineSeries, { name: "A", data: [1, 2, 3] }),
        h(ChartAxis, { grid: true, position: "x", label: "Month" }),
        h(ChartAxis, { grid: false, hidden: true, position: "y" }),
      ],
    },
  });

  await flushPromises();

  expect(wrapper.find("thead").text()).toContain("A");
  expect(wrapper.find("[role='figure']").exists()).toBe(true);
  expect(wrapper.find("[data-chart-mock]").exists()).toBe(false);
});
