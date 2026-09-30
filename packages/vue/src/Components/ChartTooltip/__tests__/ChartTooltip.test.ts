// ** External Imports
import { flushPromises, mount } from "@vue/test-utils";
import { expect, test } from "vitest";
import { h } from "vue";

// ** Local Imports
import { Chart } from "@/Components/Chart";
import { ChartLegend } from "@/Components/ChartLegend";
import { ChartSeries } from "@/Components/ChartSeries";
import {
  ChartTooltip,
  type ChartTooltipContentContext,
} from "@/Components/ChartTooltip";

const categories = ["Jan", "Feb", "Mar"];

async function mountTooltip(
  props: Record<string, unknown> = {},
  slots: Record<string, unknown> = {},
) {
  const wrapper = mount(Chart, {
    props: { categories },
    slots: {
      default: () => [
        h(ChartSeries, { name: "Revenue", data: [1200, 2000, 3000] }),
        h(ChartSeries, { name: "Costs", data: [500, null, 800] }),
        h(ChartLegend),
        h(ChartTooltip, { "data-testid": "tooltip", ...props }, slots),
      ],
    },
  });

  await flushPromises();

  return wrapper;
}

type Wrapper = Awaited<ReturnType<typeof mountTooltip>>;

async function activate(wrapper: Wrapper, index: number) {
  const plot = wrapper.find("[role='img']");

  for (let step = 0; step <= index; step += 1) {
    await plot.trigger("keydown", { key: "ArrowRight" });
  }

  await flushPromises();
}

function tooltip(wrapper: Wrapper) {
  return wrapper.find("[data-testid='tooltip']");
}

test("it should stay closed until a category is active", async () => {
  const wrapper = await mountTooltip();

  expect(tooltip(wrapper).exists()).toBe(false);
});

test("it should show the category and series values on hover", async () => {
  const wrapper = await mountTooltip();

  await activate(wrapper, 0);

  expect(tooltip(wrapper).attributes("aria-hidden")).toBe("true");
  expect(tooltip(wrapper).text()).toContain("Jan");
  expect(tooltip(wrapper).text()).toContain("1,200");
  expect(tooltip(wrapper).text()).toContain("500");
});

test("it should skip null values and close on leave", async () => {
  const wrapper = await mountTooltip();

  await activate(wrapper, 1);

  expect(tooltip(wrapper).text()).toContain("Feb");
  expect(tooltip(wrapper).text()).not.toContain("Costs");

  await wrapper.find("[role='img']").trigger("keydown", { key: "Escape" });
  await flushPromises();

  expect(tooltip(wrapper).exists()).toBe(false);
});

test("it should exclude hidden series", async () => {
  const wrapper = await mountTooltip();

  const costs = wrapper
    .findAll("button")
    .find((button) => button.text() === "Costs");

  await costs?.trigger("click");
  await activate(wrapper, 0);

  expect(tooltip(wrapper).text()).toContain("1,200");
  expect(tooltip(wrapper).text()).not.toContain("500");
});

test("it should format values with formatValue", async () => {
  const wrapper = await mountTooltip({
    formatValue: (value: number) => `$${value}`,
  });

  await activate(wrapper, 2);

  expect(tooltip(wrapper).text()).toContain("$3000");
});

test("it should render the content slot", async () => {
  const wrapper = await mountTooltip(
    {},
    {
      content: ({ items, category }: ChartTooltipContentContext) =>
        h("span", `${category}: ${items.length}`),
    },
  );

  await activate(wrapper, 0);

  expect(tooltip(wrapper).text()).toBe("Jan: 2");
});

test("it should open for keyboard navigation", async () => {
  const wrapper = await mountTooltip();

  await wrapper.find("[role='img']").trigger("keydown", { key: "ArrowRight" });
  await flushPromises();

  expect(tooltip(wrapper).text()).toContain("Jan");
});
