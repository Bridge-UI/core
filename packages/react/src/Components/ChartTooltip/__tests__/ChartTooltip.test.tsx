// ** External Imports
import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react";
import { afterEach, expect, test } from "vitest";

// ** Local Imports
import { Chart } from "@/Components/Chart";
import { ChartLegend } from "@/Components/ChartLegend";
import { ChartSeries } from "@/Components/ChartSeries";
import { ChartTooltip } from "@/Components/ChartTooltip";

const categories = ["Jan", "Feb", "Mar"];

afterEach(() => {
  cleanup();
});

function renderTooltip(props: Parameters<typeof ChartTooltip>[0] = {}) {
  return render(
    <Chart categories={categories}>
      <ChartSeries name="Revenue" data={[1200, 2000, 3000]} />
      <ChartSeries name="Costs" data={[500, null, 800]} />
      <ChartLegend />
      <ChartTooltip data-testid="tooltip" {...props} />
    </Chart>,
  );
}

function activate(index: number) {
  const plot = screen.getByRole("img");

  for (let step = 0; step <= index; step += 1) {
    fireEvent.keyDown(plot, { key: "ArrowRight" });
  }
}

function getTooltip() {
  return within(screen.getByTestId("tooltip"));
}

test("it should stay closed until a category is active", () => {
  renderTooltip();

  expect(screen.queryByTestId("tooltip")).toBeNull();
});

test("it should show the category and series values on hover", () => {
  renderTooltip();

  activate(0);

  expect(screen.getByTestId("tooltip").getAttribute("aria-hidden")).toBe(
    "true",
  );
  expect(getTooltip().getByText("Jan")).toBeTruthy();
  expect(getTooltip().getByText("1,200")).toBeTruthy();
  expect(getTooltip().getByText("500")).toBeTruthy();
});

test("it should skip null values and close on leave", () => {
  renderTooltip();

  activate(1);

  expect(getTooltip().getByText("Feb")).toBeTruthy();
  expect(getTooltip().queryByText("Costs")).toBeNull();

  fireEvent.keyDown(screen.getByRole("img"), { key: "Escape" });

  expect(screen.queryByTestId("tooltip")).toBeNull();
});

test("it should exclude hidden series", () => {
  renderTooltip();

  fireEvent.click(screen.getByRole("button", { name: "Costs" }));
  activate(0);

  expect(getTooltip().getByText("1,200")).toBeTruthy();
  expect(getTooltip().queryByText("500")).toBeNull();
});

test("it should format values with formatValue", () => {
  renderTooltip({
    formatValue: (value) => `$${value}`,
  });

  activate(2);

  expect(getTooltip().getByText("$3000")).toBeTruthy();
});

test("it should render the content slot", () => {
  renderTooltip({
    slots: {
      content: ({ items, category }) => (
        <span>{`${category}: ${items.length}`}</span>
      ),
    },
  });

  activate(0);

  expect(getTooltip().getByText("Jan: 2")).toBeTruthy();
});

test("it should open for keyboard navigation", () => {
  renderTooltip();

  fireEvent.keyDown(screen.getByRole("img"), { key: "ArrowRight" });

  expect(getTooltip().getByText("Jan")).toBeTruthy();
});
