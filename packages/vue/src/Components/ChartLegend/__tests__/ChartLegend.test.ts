// ** External Imports
import { flushPromises, mount } from "@vue/test-utils";
import { expect, test } from "vitest";
import { h } from "vue";

// ** Local Imports
import { Chart } from "@/Components/Chart";
import { ChartLegend } from "@/Components/ChartLegend";
import { ChartSeries } from "@/Components/ChartSeries";

const categories = ["Jan", "Feb", "Mar"];

async function mountLegend(props: Record<string, unknown> = {}) {
  const wrapper = mount(Chart, {
    props: { categories },
    slots: {
      default: () => [
        h(ChartSeries, { name: "Revenue", data: [1, 2, 3] }),
        h(ChartSeries, { name: "Costs", data: [3, 2, 1] }),
        h(ChartLegend, props),
      ],
    },
  });

  await flushPromises();

  return wrapper;
}

function findButton(
  wrapper: Awaited<ReturnType<typeof mountLegend>>,
  name: string,
) {
  const button = wrapper.findAll("button").find((item) => item.text() === name);

  if (!button) {
    throw new Error(`Legend button "${name}" not found`);
  }

  return button;
}

test("it should render a labelled list with one button per series", async () => {
  const wrapper = await mountLegend();

  expect(wrapper.find("ul").attributes("aria-label")).toBe("Legend");
  expect(wrapper.findAll("button").map((button) => button.text())).toEqual([
    "Revenue",
    "Costs",
  ]);
});

test("it should toggle series visibility on click", async () => {
  const wrapper = await mountLegend();

  const button = findButton(wrapper, "Revenue");

  expect(button.attributes("aria-pressed")).toBe("true");

  await button.trigger("click");
  await flushPromises();

  expect(button.attributes("aria-pressed")).toBe("false");

  await button.trigger("click");
  await flushPromises();

  expect(button.attributes("aria-pressed")).toBe("true");
});

test("it should render static items when not interactive", async () => {
  const wrapper = await mountLegend({ interactive: false });

  expect(wrapper.find("button").exists()).toBe(false);
  expect(wrapper.find("ul").text()).toContain("Revenue");
});

test("it should move to the top and align items", async () => {
  const wrapper = await mountLegend({ align: "end", position: "top" });

  const list = wrapper.find("ul");

  expect(list.classes()).toContain("order-first");
  expect(list.classes()).toContain("justify-end");
});
