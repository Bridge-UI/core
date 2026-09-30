// ** External Imports
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, test } from "vitest";

// ** Local Imports
import { Chart } from "@/Components/Chart";
import { ChartSeries } from "@/Components/ChartSeries";

const categories = ["Jan", "Feb", "Mar"];

afterEach(() => {
  cleanup();
});

function renderChart(props: Partial<Parameters<typeof Chart>[0]> = {}) {
  return render(
    <Chart categories={categories} {...props}>
      <ChartSeries name="Revenue" data={[10, 20, 30]} />
      <ChartSeries type="bar" name="Costs" data={[5, null, 15]} />
    </Chart>,
  );
}

test("it should render a figure with an accessible plot summary", () => {
  renderChart();

  expect(screen.getByRole("figure")).toBeTruthy();

  const plot = screen.getByRole("img");
  const label = plot.getAttribute("aria-label") ?? "";

  expect(label).toContain("Revenue");
  expect(label).toContain("Costs");
  expect(label).toContain("Jan");
  expect(label).toContain("Mar");
  expect(plot.getAttribute("tabindex")).toBe("0");
});

test("it should use the summary prop as the plot label", () => {
  renderChart({ summary: "Revenue grows every month" });

  expect(screen.getByRole("img").getAttribute("aria-label")).toBe(
    "Revenue grows every month",
  );
});

test("it should render an sr-only data table with formatted values", () => {
  renderChart();

  const table = screen.getByRole("table", { hidden: true });

  expect(table.className).toContain("sr-only");
  expect(screen.getByRole("columnheader", { name: "Revenue" })).toBeTruthy();
  expect(screen.getByRole("rowheader", { name: "Feb" })).toBeTruthy();
  expect(screen.getAllByRole("cell").map((cell) => cell.textContent)).toEqual([
    "10",
    "5",
    "20",
    "—",
    "30",
    "15",
  ]);
});

test("it should show the empty message when there is no series", () => {
  render(<Chart categories={categories} />);

  expect(screen.getByText("No data")).toBeTruthy();
  expect(screen.getByRole("img").getAttribute("aria-label")).toBe("No data");
});

test("it should render the empty slot", () => {
  render(
    <Chart
      categories={categories}
      slots={{ empty: <span>Nothing yet</span> }}
    />,
  );

  expect(screen.getByText("Nothing yet")).toBeTruthy();
});

test("it should render the loading slot while loading", () => {
  renderChart({ loading: true, slots: { loading: <span>Loading…</span> } });

  expect(screen.getByText("Loading…")).toBeTruthy();
  expect(screen.queryByText("No data")).toBeNull();
});

test("it should navigate categories with the keyboard and announce values", () => {
  renderChart();

  const plot = screen.getByRole("img");
  const status = screen.getByRole("status");

  fireEvent.keyDown(plot, { key: "ArrowRight" });

  expect(status.textContent).toContain("Jan");
  expect(status.textContent).toContain("Revenue");

  fireEvent.keyDown(plot, { key: "ArrowRight" });
  fireEvent.keyDown(plot, { key: "ArrowRight" });
  expect(status.textContent).toContain("Mar");

  fireEvent.keyDown(plot, { key: "Home" });
  expect(status.textContent).toContain("Jan");

  fireEvent.keyDown(plot, { key: "Escape" });
  expect(status.textContent).toBe("");
});

test("it should apply width, height, and className", () => {
  renderChart({ width: 480, height: 200, className: "custom-chart" });

  const root = screen.getByRole("figure");

  expect(root.className).toContain("custom-chart");
  expect(root.style.width).toBe("480px");
  expect(screen.getByRole("img").style.height).toBe("200px");
});
