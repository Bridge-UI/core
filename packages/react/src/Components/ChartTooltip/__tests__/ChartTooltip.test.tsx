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
import { ChartLegend } from "@/Components/ChartLegend";
import { ChartLine } from "@/Components/ChartLine";
import { ChartLineSeries } from "@/Components/ChartLineSeries";
import { ChartPie } from "@/Components/ChartPie";
import { ChartTooltip } from "@/Components/ChartTooltip";

const categories = ["Jan", "Feb", "Mar"];

afterEach(() => {
  cleanup();
});

function renderTooltip(props: Parameters<typeof ChartTooltip>[0] = {}) {
  return render(
    <ChartLine categories={categories}>
      <ChartLineSeries name="Revenue" data={[1200, 2000, 3000]} />
      <ChartLineSeries name="Costs" data={[500, null, 800]} />
      <ChartLegend />
      <ChartTooltip data-testid="tooltip" {...props} />
    </ChartLine>,
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

test("it should stay closed until an item is active", () => {
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
  expect(getTooltip().getByText("500")).toBeTruthy();
  expect(getTooltip().getByText("1,200")).toBeTruthy();
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

  expect(getTooltip().queryByText("500")).toBeNull();
  expect(getTooltip().getByText("1,200")).toBeTruthy();
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
      content: ({ items, title }) => <span>{`${title}: ${items.length}`}</span>,
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

test("it should show a slice with its percent and no title", () => {
  render(
    <ChartPie
      data={[
        { value: 3, label: "Housing" },
        { value: 1, label: "Kids" },
      ]}
    >
      <ChartTooltip
        data-testid="tooltip"
        formatPercent={(percent) => `${percent} pct`}
      />
    </ChartPie>,
  );

  fireEvent.keyDown(screen.getByRole("img"), { key: "ArrowRight" });

  expect(getTooltip().getByText("75 pct")).toBeTruthy();
  expect(getTooltip().getByText("Housing")).toBeTruthy();
});
