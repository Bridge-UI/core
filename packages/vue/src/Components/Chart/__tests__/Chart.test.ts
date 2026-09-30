// ** External Imports
import { flushPromises, mount, type VueWrapper } from "@vue/test-utils";
import { getInstanceByDom } from "echarts/core";
import { afterEach, expect, test, vi } from "vitest";
import { h } from "vue";

// ** Local Imports
import { Chart } from "@/Components/Chart";
import { ChartSeries } from "@/Components/ChartSeries";

const categories = ["Jan", "Feb", "Mar"];

type PlotSize = { height: number; width: number };

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

/**
 * happy-dom has no layout: stub the plot size and drive `ResizeObserver` by hand.
 */
function stubPlotSize(initial: PlotSize) {
  let size = initial;
  const callbacks = new Set<ResizeObserverCallback>();

  vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockImplementation(
    () => size.width,
  );
  vi.spyOn(HTMLElement.prototype, "clientHeight", "get").mockImplementation(
    () => size.height,
  );

  vi.stubGlobal(
    "ResizeObserver",
    class {
      callback: ResizeObserverCallback;

      constructor(callback: ResizeObserverCallback) {
        this.callback = callback;
      }

      observe() {
        callbacks.add(this.callback);
      }

      unobserve() {}

      disconnect() {
        callbacks.delete(this.callback);
      }
    },
  );

  return async (next: PlotSize) => {
    size = next;

    callbacks.forEach((callback) => {
      callback([], {} as ResizeObserver);
    });

    await flushPromises();
  };
}

function getEchartsHost(wrapper: VueWrapper) {
  return wrapper.get<HTMLElement>("[role='img'] [aria-hidden='true'] > div")
    .element;
}

async function mountChart(
  props: Record<string, unknown> = {},
  slots: Record<string, () => unknown> = {},
) {
  const wrapper = mount(Chart, {
    attachTo: document.body,
    props: { categories, ...props },
    slots: {
      default: () => [
        h(ChartSeries, { name: "Revenue", data: [10, 20, 30] }),
        h(ChartSeries, { type: "bar", name: "Costs", data: [5, null, 15] }),
      ],
      ...slots,
    },
  });

  await flushPromises();

  return wrapper;
}

test("it should render a figure with an accessible plot summary", async () => {
  const wrapper = await mountChart();

  expect(wrapper.find("[role='figure']").exists()).toBe(true);

  const plot = wrapper.find("[role='img']");
  const label = plot.attributes("aria-label") ?? "";

  expect(label).toContain("Jan");
  expect(label).toContain("Mar");
  expect(label).toContain("Costs");
  expect(label).toContain("Revenue");
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

test("it should show the empty message when there is no series", async () => {
  const wrapper = mount(Chart, { props: { categories } });

  await flushPromises();

  expect(wrapper.text()).toContain("No data");
  expect(wrapper.find("[role='img']").attributes("aria-label")).toBe("No data");
});

test("it should render the empty slot", async () => {
  const wrapper = mount(Chart, {
    props: { categories },
    slots: { empty: () => h("span", "Nothing yet") },
  });

  await flushPromises();

  expect(wrapper.text()).toContain("Nothing yet");
});

test("it should render the loading slot while loading", async () => {
  const wrapper = await mountChart(
    { loading: true },
    { loading: () => h("span", "Loading…") },
  );

  expect(wrapper.text()).toContain("Loading…");
  expect(wrapper.text()).not.toContain("No data");

  wrapper.unmount();
});

test("it should navigate categories with the keyboard and announce values", async () => {
  const wrapper = await mountChart();

  const plot = wrapper.find("[role='img']");
  const status = wrapper.find("[role='status']");

  await plot.trigger("keydown", { key: "ArrowRight" });
  await flushPromises();

  expect(status.text()).toContain("Jan");
  expect(status.text()).toContain("Revenue");

  await plot.trigger("keydown", { key: "ArrowRight" });
  await plot.trigger("keydown", { key: "ArrowRight" });
  expect(status.text()).toContain("Mar");

  await plot.trigger("keydown", { key: "Home" });
  expect(status.text()).toContain("Jan");

  await plot.trigger("keydown", { key: "Escape" });
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

test("it should wait for a plot size before mounting ECharts and follow resizes", async () => {
  const resize = stubPlotSize({ width: 0, height: 0 });
  const wrapper = await mountChart({ animation: false });
  const host = getEchartsHost(wrapper);

  expect(getInstanceByDom(host)).toBeUndefined();

  await resize({ width: 320, height: 180 });

  const chart = getInstanceByDom(host);

  expect(chart?.getWidth()).toBe(320);
  expect(chart?.getHeight()).toBe(180);
  expect(host.querySelector("svg")).toBeTruthy();

  await resize({ width: 480, height: 200 });

  expect(chart?.getWidth()).toBe(480);
  expect(chart?.getHeight()).toBe(200);
  expect(getInstanceByDom(host)).toBe(chart);

  wrapper.unmount();
});

test("it should dispose ECharts and remove its host on unmount", async () => {
  stubPlotSize({ width: 320, height: 180 });

  const wrapper = await mountChart({ animation: false });
  const host = getEchartsHost(wrapper);
  const chart = getInstanceByDom(host);

  expect(chart).toBeDefined();

  wrapper.unmount();

  expect(host.isConnected).toBe(false);
  expect(chart?.isDisposed()).toBe(true);
  expect(getInstanceByDom(host)).toBeUndefined();
});
