// ** External Imports
import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, expect, test } from "vitest";

// ** Local Imports
import { useChartBar, type ChartBarProps } from "@/Components/ChartBar";

const libDefaults = {
  radius: 4,
  size: "md",
  height: 280,
  animation: true,
  orientation: "vertical",
} as const;

afterEach(() => {
  cleanup();
});

function renderUseChartBar(props: Partial<ChartBarProps> = {}) {
  return renderHook(() =>
    useChartBar(
      { categories: ["Q1", "Q2"], ...props } as ChartBarProps,
      libDefaults,
    ),
  );
}

test("it should merge the bar defaults", () => {
  const { result } = renderUseChartBar();

  expect(result.current.merged.radius).toBe(4);
  expect(result.current.context.family).toBe("bar");
  expect(result.current.merged.orientation).toBe("vertical");
});

test("it should let props override the defaults", () => {
  const { result } = renderUseChartBar({
    radius: 0,
    orientation: "horizontal",
  });

  expect(result.current.merged.radius).toBe(0);
  expect(result.current.merged.orientation).toBe("horizontal");
});

test("it should build tooltip content for the active category", () => {
  const { result } = renderUseChartBar();

  act(() => {
    result.current.context.upsertSeries?.({
      id: "a",
      name: "A",
      kind: "bar",
      data: [1, 2],
    });
  });

  expect(result.current.context.tooltip).toBeNull();
  expect(result.current.frame.table.headers).toEqual(["Category", "A"]);
});
