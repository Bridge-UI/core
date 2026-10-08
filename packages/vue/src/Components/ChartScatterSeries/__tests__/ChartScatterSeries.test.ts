// ** External Imports
import { flushPromises, mount } from "@vue/test-utils";
import { expect, test } from "vitest";
import { h } from "vue";

// ** Local Imports
import { ChartLine } from "@/Components/ChartLine";
import { ChartScatter } from "@/Components/ChartScatter";
import { ChartScatterSeries } from "@/Components/ChartScatterSeries";

test("it should register its points in the data table", async () => {
  const wrapper = mount(ChartScatter, {
    slots: {
      default: () =>
        h(ChartScatterSeries, {
          name: "A",
          data: [
            [1, 2],
            [3, 4],
          ],
        }),
    },
  });

  await flushPromises();

  expect(wrapper.findAll("tbody th").map((cell) => cell.text())).toEqual([
    "A",
    "A",
  ]);
});

test("it should throw inside a line chart", () => {
  expect(() =>
    mount(ChartLine, {
      props: { categories: ["Jan"] },
      global: { config: { warnHandler: () => undefined } },
      slots: {
        default: () => h(ChartScatterSeries, { name: "A", data: [[1, 2]] }),
      },
    }),
  ).toThrow("ChartScatterSeries must be used within ChartScatter");
});
