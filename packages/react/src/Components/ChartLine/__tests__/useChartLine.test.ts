// ** External Imports
import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, expect, test } from "vitest";

// ** Local Imports
import { useChartLine, type ChartLineProps } from "@/Components/ChartLine";

const libDefaults = {
  size: "md",
  height: 280,
  animation: true,
} as const;

afterEach(() => {
  cleanup();
});

function renderUseChartLine(props: Partial<ChartLineProps> = {}) {
  return renderHook(() =>
    useChartLine(
      { categories: ["Jan", "Feb"], ...props } as ChartLineProps,
      libDefaults,
    ),
  );
}

test("it should merge default size, height, and animation", () => {
  const { result } = renderUseChartLine();

  expect(result.current.merged.size).toBe("md");
  expect(result.current.merged.height).toBe(280);
  expect(result.current.merged.animation).toBe(true);
});

test("it should be empty until a series registers", () => {
  const { result } = renderUseChartLine();

  expect(result.current.frame.isEmpty).toBe(true);
  expect(result.current.context.family).toBe("line");

  act(() => {
    result.current.context.upsertSeries?.({
      id: "a",
      name: "A",
      kind: "line",
      data: [1, 2],
    });
  });

  expect(result.current.frame.isEmpty).toBe(false);
  expect(result.current.context.legendItems).toHaveLength(1);
  expect(result.current.frame.table.rows).toEqual([
    { key: "0-Jan", cells: ["Jan", "1"] },
    { key: "1-Feb", cells: ["Feb", "2"] },
  ]);
});

test("it should ignore an equal series", () => {
  const { result } = renderUseChartLine();
  const entry = { id: "a", name: "A", data: [1, 2], kind: "line" as const };

  act(() => {
    result.current.context.upsertSeries?.(entry);
  });

  const items = result.current.context.legendItems;

  act(() => {
    result.current.context.upsertSeries?.({ ...entry, data: [1, 2] });
  });

  expect(result.current.context.legendItems).toBe(items);
});

test("it should hide and show a series", () => {
  const { result } = renderUseChartLine();

  act(() => {
    result.current.context.upsertSeries?.({
      id: "a",
      name: "A",
      kind: "line",
      data: [1, 2],
    });
  });

  act(() => {
    result.current.context.toggleItem("a");
  });

  expect(result.current.context.legendItems[0].hidden).toBe(true);

  act(() => {
    result.current.context.toggleItem("a");
  });

  expect(result.current.context.legendItems[0].hidden).toBe(false);
});

test("it should expose axis registration for ChartAxis", () => {
  const { result } = renderUseChartLine();

  expect(result.current.context.setAxis).toBeTypeOf("function");
  expect(result.current.context.removeAxis).toBeTypeOf("function");
});
