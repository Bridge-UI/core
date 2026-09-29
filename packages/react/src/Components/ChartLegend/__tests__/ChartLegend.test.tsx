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

const categories = ["Jan", "Feb", "Mar"];

afterEach(() => {
  cleanup();
});

function renderLegend(props: Parameters<typeof ChartLegend>[0] = {}) {
  return render(
    <Chart categories={categories}>
      <ChartSeries name="Revenue" data={[1, 2, 3]} />
      <ChartSeries name="Costs" data={[3, 2, 1]} />
      <ChartLegend {...props} />
    </Chart>,
  );
}

test("it should render a labelled list with one button per series", () => {
  renderLegend();

  expect(screen.getByRole("list", { name: "Legend" })).toBeTruthy();
  expect(screen.getByRole("button", { name: "Revenue" })).toBeTruthy();
  expect(screen.getByRole("button", { name: "Costs" })).toBeTruthy();
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
