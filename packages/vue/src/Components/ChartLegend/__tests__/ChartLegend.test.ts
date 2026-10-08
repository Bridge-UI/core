// ** External Imports
import { flushPromises, mount } from "@vue/test-utils";
import { expect, test } from "vitest";
import { h } from "vue";

// ** Local Imports
import { ChartLegend } from "@/Components/ChartLegend";
import { ChartLine } from "@/Components/ChartLine";
import { ChartLineSeries } from "@/Components/ChartLineSeries";
import { ChartPie } from "@/Components/ChartPie";

const categories = ["Jan", "Feb", "Mar"];

async function mountLegend(props: Record<string, unknown> = {}) {
  const wrapper = mount(ChartLine, {
    props: { categories },
    slots: {
      default: () => [
        h(ChartLineSeries, { name: "Revenue", data: [1, 2, 3] }),
        h(ChartLineSeries, { name: "Costs", data: [3, 2, 1] }),
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

test("it should stack entries beside the plot on the left", async () => {
  const wrapper = await mountLegend({ position: "left" });

  expect(wrapper.find("ul").classes()).toContain("flex-col");
  expect(wrapper.find("ul").classes()).toContain("order-first");
  expect(wrapper.find("[role='figure']").classes()).toContain("flex-row");
});

test("it should show formatted values and percents for slices", async () => {
  const wrapper = mount(ChartPie, {
    props: {
      data: [
        { value: 3000, label: "Housing" },
        { value: 1000, label: "Kids" },
      ],
    },
    slots: {
      default: () =>
        h(ChartLegend, {
          showValue: true,
          showPercent: true,
          formatValue: (value: number) => `$${value}`,
        }),
    },
  });

  await flushPromises();

  expect(wrapper.findAll("button")[0].text().replace(/\s+/g, "")).toBe(
    "Housing$300075%",
  );
});

test("it should not show value columns for series", async () => {
  const wrapper = await mountLegend({ showValue: true, showPercent: true });

  expect(findButton(wrapper, "Revenue").text()).toBe("Revenue");
});
