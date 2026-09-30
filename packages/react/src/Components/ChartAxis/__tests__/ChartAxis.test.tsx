// ** External Imports
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, test } from "vitest";

// ** Local Imports
import { Chart } from "@/Components/Chart";
import { ChartAxis } from "@/Components/ChartAxis";
import { ChartSeries } from "@/Components/ChartSeries";

const categories = ["Jan", "Feb", "Mar"];

afterEach(() => {
  cleanup();
});

test("it should render nothing of its own", () => {
  const { container } = render(
    <Chart categories={categories}>
      <ChartSeries name="A" data={[1, 2, 3]} />
      <ChartAxis grid position="x" label="Month" />
      <ChartAxis hidden position="y" grid={false} />
    </Chart>,
  );

  expect(container.querySelector("[data-chart-mock]")).toBeNull();
  expect(screen.getByRole("columnheader", { name: "A" })).toBeTruthy();
  expect(screen.getByRole("figure")).toBeTruthy();
});
