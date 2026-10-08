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

const categories = ["Jan", "Feb", "Mar"];

afterEach(() => {
  cleanup();
});

function renderLegend(props: Parameters<typeof ChartLegend>[0] = {}) {
  return render(
    <ChartLine categories={categories}>
      <ChartLineSeries name="Revenue" data={[1, 2, 3]} />
      <ChartLineSeries name="Costs" data={[3, 2, 1]} />
      <ChartLegend {...props} />
    </ChartLine>,
  );
}

test("it should render a labelled list with one button per series", () => {
  renderLegend();

  expect(screen.getByRole("list", { name: "Legend" })).toBeTruthy();
  expect(screen.getByRole("button", { name: "Costs" })).toBeTruthy();
  expect(screen.getByRole("button", { name: "Revenue" })).toBeTruthy();
});

test("it should toggle series visibility on click", () => {
  renderLegend();

  const button = screen.getByRole("button", { name: "Revenue" });

  expect(button.getAttribute("aria-pressed")).toBe("true");

  fireEvent.click(button);

  expect(button.getAttribute("aria-pressed")).toBe("false");

  fireEvent.click(button);

  expect(button.getAttribute("aria-pressed")).toBe("true");
});

test("it should render static items when not interactive", () => {
  renderLegend({ interactive: false });

  const list = screen.getByRole("list", { name: "Legend" });

  expect(screen.queryByRole("button")).toBeNull();
  expect(within(list).getByText("Revenue")).toBeTruthy();
});

test("it should move to the top and align items", () => {
  renderLegend({ align: "end", position: "top" });

  const list = screen.getByRole("list", { name: "Legend" });

  expect(list.className).toContain("order-first");
  expect(list.className).toContain("justify-end");
});

test("it should stack entries beside the plot on the left", () => {
  renderLegend({ position: "left" });

  const legend = screen.getByRole("list", { name: "Legend" });

  expect(legend.className).toContain("flex-col");
  expect(legend.className).toContain("order-first");
  expect(screen.getByRole("figure").className).toContain("flex-row");
});

test("it should show formatted values and percents for slices", () => {
  render(
    <ChartPie
      data={[
        { value: 3000, label: "Housing" },
        { value: 1000, label: "Kids" },
      ]}
    >
      <ChartLegend showValue showPercent formatValue={(value) => `$${value}`} />
    </ChartPie>,
  );

  expect(screen.getByRole("button", { name: /Housing/ }).textContent).toBe(
    "Housing$300075%",
  );
});

test("it should not show value columns for series", () => {
  renderLegend({ showValue: true, showPercent: true });

  expect(screen.getByRole("button", { name: "Revenue" }).textContent).toBe(
    "Revenue",
  );
});
