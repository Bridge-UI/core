// ** External Imports
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";

// ** Local Imports
import { ChartLine } from "@/Components/ChartLine";
import { ChartLineSeries } from "@/Components/ChartLineSeries";
import { ChartScatter } from "@/Components/ChartScatter";
import { ChartScatterSeries } from "@/Components/ChartScatterSeries";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

test("it should register its points in the data table", () => {
  render(
    <ChartScatter>
      <ChartScatterSeries
        name="A"
        data={[
          [1, 2],
          [3, 4],
        ]}
      />
    </ChartScatter>,
  );

  expect(screen.getAllByRole("rowheader", { name: "A" })).toHaveLength(2);
});

test("it should name both roots when a line series is misplaced", () => {
  vi.spyOn(console, "error").mockImplementation(() => {});

  expect(() =>
    render(
      <ChartScatter>
        <ChartLineSeries name="Trend" data={[1, 2]} />
      </ChartScatter>,
    ),
  ).toThrow("ChartLineSeries must be used within ChartLine or ChartBar");
});

test("it should throw inside a line chart", () => {
  vi.spyOn(console, "error").mockImplementation(() => {});

  expect(() =>
    render(
      <ChartLine categories={["Jan"]}>
        <ChartScatterSeries name="A" data={[[1, 2]]} />
      </ChartLine>,
    ),
  ).toThrow("ChartScatterSeries must be used within ChartScatter");
});
