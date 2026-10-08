// ** External Imports
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, test } from "vitest";

// ** Local Imports
import { ChartAxis } from "@/Components/ChartAxis";
import { ChartLine } from "@/Components/ChartLine";
import { ChartLineSeries } from "@/Components/ChartLineSeries";

const categories = ["Jan", "Feb", "Mar"];

afterEach(() => {
  cleanup();
});

test("it should render nothing of its own", () => {
  const { container } = render(
    <ChartLine categories={categories}>
      <ChartLineSeries name="A" data={[1, 2, 3]} />
      <ChartAxis grid position="x" label="Month" />
      <ChartAxis hidden position="y" grid={false} />
    </ChartLine>,
  );

  expect(screen.getByRole("figure")).toBeTruthy();
  expect(container.querySelector("[data-chart-mock]")).toBeNull();
  expect(screen.getByRole("columnheader", { name: "A" })).toBeTruthy();
});
