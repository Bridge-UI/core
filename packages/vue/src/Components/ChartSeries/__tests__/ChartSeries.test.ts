// ** External Imports
import { flushPromises, mount } from "@vue/test-utils";
import { expect, test } from "vitest";
import { defineComponent, h, ref } from "vue";

// ** Local Imports
import { Chart } from "@/Components/Chart";
import { ChartSeries } from "@/Components/ChartSeries";

const categories = ["Jan", "Feb", "Mar"];

test("it should render nothing on its own and register with the chart", async () => {
  const wrapper = mount(Chart, {
    props: { categories },
    slots: {
      default: () => h(ChartSeries, { name: "Revenue", data: [1, 2, 3] }),
    },
  });

  await flushPromises();

  expect(wrapper.find("[data-chart-series]").exists()).toBe(false);
  expect(wrapper.find("thead").text()).toContain("Revenue");
});

test("it should list every series in the data table", async () => {
  const wrapper = mount(Chart, {
    props: { categories },
    slots: {
      default: () => [
        h(ChartSeries, { name: "A", type: "area", data: [1, 2, 3] }),
        h(ChartSeries, { name: "B", type: "bar", data: [1, 2, 3] }),
      ],
    },
  });

  await flushPromises();

  expect(wrapper.find("thead").text()).toContain("A");
  expect(wrapper.find("thead").text()).toContain("B");
});

test("it should unregister when unmounted", async () => {
  const visible = ref(true);

  const Toggle = defineComponent({
    setup() {
      return () =>
        h(
          Chart,
          { categories },
          {
            default: () => [
              h(ChartSeries, { name: "A", data: [1, 2, 3] }),
              visible.value
                ? h(ChartSeries, { name: "B", data: [3, 2, 1] })
                : null,
            ],
          },
        );
    },
  });

  const wrapper = mount(Toggle);

  await flushPromises();
  expect(wrapper.find("thead").text()).toContain("B");

  visible.value = false;
  await flushPromises();

  expect(wrapper.find("thead").text()).not.toContain("B");
});
