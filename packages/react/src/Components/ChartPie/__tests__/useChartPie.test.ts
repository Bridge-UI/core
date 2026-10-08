// ** External Imports
import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, expect, test } from "vitest";

// ** Local Imports
import { useChartPie, type ChartPieProps } from "@/Components/ChartPie";

const libDefaults = {
  size: "md",
  height: 280,
  minAngle: 2,
  labels: false,
  thickness: 0.3,
  variant: "pie",
  animation: true,
} as const;

afterEach(() => {
  cleanup();
});

function renderUseChartPie(props: Partial<ChartPieProps> = {}) {
  return renderHook(() =>
    useChartPie(
      {
        data: [
          { value: 3, label: "A" },
          { value: 1, label: "B" },
        ],
        ...props,
      },
      libDefaults,
    ),
  );
}

test("it should merge the pie defaults", () => {
  const { result } = renderUseChartPie();

  expect(result.current.variant).toBe("pie");
  expect(result.current.merged.thickness).toBe(0.3);
  expect(result.current.context.family).toBe("pie");
});

test("it should expose slices as legend items with percents", () => {
  const { result } = renderUseChartPie();

  expect(result.current.context.legendItems).toMatchObject([
    { value: 3, name: "A", percent: 75 },
    { value: 1, name: "B", percent: 25 },
  ]);
});

test("it should drop the percent of a hidden slice", () => {
  const { result } = renderUseChartPie();

  act(() => {
    result.current.context.toggleItem("slice-0");
  });

  expect(result.current.context.legendItems).toMatchObject([
    { name: "A", hidden: true, percent: undefined },
    { name: "B", percent: 100, hidden: false },
  ]);
});

test("it should expose the center slot", () => {
  const { result } = renderUseChartPie({
    variant: "donut",
    slots: { center: "Total" },
  });

  expect(result.current.variant).toBe("donut");
  expect(result.current.center).toBe("Total");
});
