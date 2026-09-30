// ** External Imports
import { flushPromises, mount } from "@vue/test-utils";
import { expect, test } from "vitest";
import { h } from "vue";

// ** Local Imports
import { Chart } from "@/Components/Chart";
import { ChartSeries } from "@/Components/ChartSeries";

const categories = ["Jan", "Feb", "Mar"];

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
