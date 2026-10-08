// ** External Imports
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";

// ** Local Imports
import { ChartLine } from "@/Components/ChartLine";
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
