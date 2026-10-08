// ** External Imports
import { flushPromises, mount, type VueWrapper } from "@vue/test-utils";
import { getInstanceByDom } from "echarts/core";
import { afterEach, expect, test, vi } from "vitest";
import { h } from "vue";

// ** Local Imports
import { ChartLegend } from "@/Components/ChartLegend";
import { ChartPie } from "@/Components/ChartPie";
import { ChartTooltip } from "@/Components/ChartTooltip";
import {
  getEchartsHost,
  pressChartKey,
  stubPlotSize,
} from "@/Utils/Chart/__tests__/chartTestUtils";

const data = [
  { value: 3450, label: "Housing" },
  { value: 1310, label: "Kids" },
  { value: 1240, label: "Groceries" },
  { value: 0, label: "Fun" },
];

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

async function mountChart(
  props: Record<string, unknown> = {},
  slots: Record<string, () => unknown> = {},
) {
  const wrapper = mount(ChartPie, {
    props: { data, ...props },
    slots: {
      default: () => [
        h(ChartLegend, {
          showValue: true,
          showPercent: true,
          position: "right",
        }),
        h(ChartTooltip, { "data-testid": "tooltip" }),
      ],
      ...slots,
    },
  });

  await flushPromises();

  return wrapper;
}

function legendText(wrapper: VueWrapper, name: string) {
  const button = wrapper
    .findAll("button")
    .find((item) => item.text().startsWith(name));

  return button?.text().replace(/\s+/g, "") ?? "";
}

test("it should summarize slices with percents that sum to 100", async () => {
  const wrapper = await mountChart();

  expect(wrapper.find("[role='img']").attributes("aria-label")).toBe(
    "Pie chart with 3 slices: Housing 57%, Kids 22%, Groceries 21%.",
  );
  expect(wrapper.findAll("td").map((cell) => cell.text())).toEqual([
    "3,450",
    "57%",
    "1,310",
    "22%",
    "1,240",
    "21%",
  ]);
});

test("it should show values and percents in a side legend", async () => {
  const wrapper = await mountChart();

  expect(legendText(wrapper, "Kids")).toBe("Kids1,31022%");
  expect(wrapper.find("[role='figure']").classes()).toContain("flex-row");
});

test("it should recompute percents when a slice is hidden", async () => {
  const wrapper = await mountChart();

  await wrapper.findAll("button")[0].trigger("click");
  await flushPromises();

  expect(legendText(wrapper, "Kids")).toBe("Kids1,31051%");
  expect(legendText(wrapper, "Housing")).toBe("Housing3,450—");
});

test("it should announce the active slice with its share", async () => {
  const wrapper = await mountChart();

  await pressChartKey(wrapper, "ArrowRight");

  expect(wrapper.find("[role='status']").text()).toBe("Housing 3,450 (57%)");
  expect(wrapper.find("[data-testid='tooltip']").text()).toContain("57%");
});

test("it should group small slices into Other", async () => {
  const wrapper = await mountChart({ maxSlices: 2 });

  expect(legendText(wrapper, "Other")).not.toBe("");
  expect(legendText(wrapper, "Kids")).toBe("");
});

test("it should render the center slot for donuts only", async () => {
  const donut = await mountChart(
    { variant: "donut" },
    { center: () => "R$ 6,9 mil" },
  );

  expect(donut.text()).toContain("R$ 6,9 mil");

  const pie = await mountChart({}, { center: () => "R$ 6,9 mil" });

  expect(pie.text()).not.toContain("R$ 6,9 mil");
});

test("it should mount a donut ring with plot labels", async () => {
  stubPlotSize({ width: 320, height: 240 });

  const wrapper = await mountChart({
    animation: false,
    variant: "donut",
    labels: "outside",
  });

  const option = getInstanceByDom(getEchartsHost(wrapper))?.getOption() as {
    series: Array<{ label: { show: boolean }; radius: string[] }>;
  };

  expect(option.series[0].radius).toEqual(["49%", "70%"]);
  expect(option.series[0].label.show).toBe(true);

  wrapper.unmount();
});
