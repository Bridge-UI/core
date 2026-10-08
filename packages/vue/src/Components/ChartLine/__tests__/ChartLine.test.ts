// ** External Imports
import { flushPromises, mount } from "@vue/test-utils";
import { getInstanceByDom } from "echarts/core";
import { afterEach, expect, test, vi } from "vitest";
import { h } from "vue";

// ** Local Imports
import { ChartBarSeries } from "@/Components/ChartBarSeries";
import { ChartLine } from "@/Components/ChartLine";
import { ChartLineSeries } from "@/Components/ChartLineSeries";
import { BridgeUIProvider } from "@/Provider";
import {
  getEchartsHost,
  pressChartKey,
  stubPlotSize,
} from "@/Utils/Charts/__tests__/chartTestUtils";

const categories = ["Jan", "Feb", "Mar"];

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

async function mountChart(
  props: Record<string, unknown> = {},
  slots: Record<string, () => unknown> = {},
) {
  const wrapper = mount(ChartLine, {
    attachTo: document.body,
    props: { categories, ...props },
    slots: {
      default: () => [
        h(ChartLineSeries, { name: "Revenue", data: [10, 20, 30] }),
        h(ChartLineSeries, { area: true, name: "Costs", data: [5, null, 15] }),
      ],
      ...slots,
    },
  });

  await flushPromises();

  return wrapper;
}

test("it should render a figure with an accessible plot summary", async () => {
  const wrapper = await mountChart();

  const plot = wrapper.find("[role='img']");
  const label = plot.attributes("aria-label") ?? "";

  expect(wrapper.find("[role='figure']").exists()).toBe(true);
  expect(label).toContain("Revenue");
  expect(label).toContain("Costs");
  expect(label).toContain("Jan");
  expect(label).toContain("Mar");
  expect(plot.attributes("tabindex")).toBe("0");

  wrapper.unmount();
});

test("it should use the summary prop as the plot label", async () => {
  const wrapper = await mountChart({ summary: "Revenue grows every month" });

  expect(wrapper.find("[role='img']").attributes("aria-label")).toBe(
    "Revenue grows every month",
  );

  wrapper.unmount();
});

test("it should render an sr-only data table with formatted values", async () => {
  const wrapper = await mountChart();

  const table = wrapper.find("table");

  expect(table.classes()).toContain("sr-only");
  expect(table.findAll("thead th").map((cell) => cell.text())).toEqual([
    "Category",
    "Revenue",
    "Costs",
  ]);
  expect(table.findAll("td").map((cell) => cell.text())).toEqual([
    "10",
    "5",
    "20",
    "—",
    "30",
    "15",
  ]);

  wrapper.unmount();
});

test("it should format date categories and label the table column Date", async () => {
  const wrapper = mount(ChartLine, {
    slots: {
      default: () => h(ChartLineSeries, { name: "Spent", data: [100, 140] }),
    },
    props: {
      formatDate: (date: Date) => `day ${date.getDate()}`,
      categories: [new Date(2026, 9, 1), new Date(2026, 9, 2)],
    },
  });

  await flushPromises();

  expect(wrapper.find("thead th").text()).toBe("Date");
  expect(wrapper.findAll("tbody th").map((cell) => cell.text())).toEqual([
    "day 1",
    "day 2",
  ]);
  expect(wrapper.find("[role='img']").attributes("aria-label")).toContain(
    "from day 1 to day 2",
  );
});

test("it should show the empty message and the empty slot", async () => {
  const wrapper = mount(ChartLine, { props: { categories } });

  await flushPromises();

  expect(wrapper.text()).toContain("No data");

  const custom = mount(ChartLine, {
    props: { categories },
    slots: { empty: () => "Nothing yet" },
  });

  await flushPromises();

  expect(custom.text()).toContain("Nothing yet");
});

test("it should render the loading slot while loading", async () => {
  const wrapper = await mountChart(
    { loading: true },
    { loading: () => "Loading…" },
  );

  expect(wrapper.text()).toContain("Loading…");
  expect(wrapper.find("[role='figure']").attributes("aria-busy")).toBe("true");

  wrapper.unmount();
});

test("it should navigate categories with the keyboard and announce values", async () => {
  const wrapper = await mountChart();
  const status = wrapper.find("[role='status']");

  await pressChartKey(wrapper, "ArrowRight");
  expect(status.text()).toBe("Jan: Revenue 10, Costs 5");

  await pressChartKey(wrapper, "End");
  expect(status.text()).toContain("Mar");

  await pressChartKey(wrapper, "Escape");
  expect(status.text()).toBe("");

  wrapper.unmount();
});

test("it should apply width, height, and class", async () => {
  const wrapper = await mountChart({
    width: 480,
    height: 200,
    class: "custom-chart",
  });

  const root = wrapper.find("[role='figure']");

  expect(root.classes()).toContain("custom-chart");
  expect(root.attributes("style")).toContain("width: 480px");
  expect(wrapper.find("[role='img']").attributes("style")).toContain(
    "height: 200px",
  );

  wrapper.unmount();
});

test("it should default sparklines to a 48px plot", async () => {
  const wrapper = await mountChart({ sparkline: true });

  expect(wrapper.find("[role='img']").attributes("style")).toContain(
    "height: 48px",
  );

  wrapper.unmount();
});

test("it should keep sparklines at 48px over a registry height", async () => {
  const series = () => h(ChartLineSeries, { name: "Trend", data: [1, 2, 3] });

  const wrapper = mount(BridgeUIProvider, {
    props: { components: { ChartLine: { defaultProps: { height: 320 } } } },
    slots: {
      default: () => [
        h(ChartLine, { categories, sparkline: true }, series),
        h(ChartLine, { categories }, series),
      ],
    },
  });

  await flushPromises();

  const [sparkline, chart] = wrapper.findAll("[role='img']");

  expect(chart.attributes("style")).toContain("height: 320px");
  expect(sparkline.attributes("style")).toContain("height: 48px");
});

test("it should follow the sparkline prop at runtime", async () => {
  const wrapper = await mountChart();

  await wrapper.setProps({ sparkline: true });

  expect(wrapper.find("[role='img']").attributes("style")).toContain(
    "height: 48px",
  );

  wrapper.unmount();
});

test("it should throw when a bar series is placed inside", () => {
  expect(() =>
    mount(ChartLine, {
      props: { categories },
      global: { config: { warnHandler: () => undefined } },
      slots: {
        default: () => h(ChartBarSeries, { name: "Orders", data: [1, 2, 3] }),
      },
    }),
  ).toThrow("ChartBarSeries must be used within ChartBar");
});

test("it should wait for a plot size before mounting ECharts and follow resizes", async () => {
  const resize = stubPlotSize({ width: 0, height: 0 });

  const wrapper = await mountChart({ animation: false });
  const host = getEchartsHost(wrapper);

  expect(getInstanceByDom(host)).toBeUndefined();

  await resize({ width: 320, height: 180 });

  const chart = getInstanceByDom(host);

  expect(chart?.getWidth()).toBe(320);
  expect(chart?.getHeight()).toBe(180);

  await resize({ width: 480, height: 200 });

  expect(chart?.getWidth()).toBe(480);
  expect(getInstanceByDom(host)).toBe(chart);

  wrapper.unmount();

  expect(chart?.isDisposed()).toBe(true);
  expect(host.isConnected).toBe(false);
});
