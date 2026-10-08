// ** External Imports
import { cleanup, renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, expect, test } from "vitest";

// ** Local Imports
import { useChartLegend } from "@/Components/ChartLegend";
import { ChartLine } from "@/Components/ChartLine";
import { ChartLineSeries } from "@/Components/ChartLineSeries";

afterEach(() => {
  cleanup();
});

function Wrapper({ children }: { children: ReactNode }) {
  return (
    <ChartLine categories={["Jan", "Feb"]}>
      <ChartLineSeries data={[1, 2]} name="Revenue" />
      {children}
    </ChartLine>
  );
}

const libDefaults = {
  align: "center",
  interactive: true,
  position: "bottom",
} as const;

test("it should merge default align, position, and interactive", () => {
  const { result } = renderHook(() => useChartLegend({}, libDefaults), {
    wrapper: Wrapper,
  });

  expect(result.current.interactive).toBe(true);
  expect(result.current.merged.align).toBe("center");
  expect(result.current.merged.position).toBe("bottom");
});

test("it should expose chart series as items", () => {
  const { result } = renderHook(() => useChartLegend({}, libDefaults), {
    wrapper: Wrapper,
  });

  expect(result.current.items.map((item) => item.name)).toEqual(["Revenue"]);
});

test("it should build pressed button binds for interactive items", () => {
  const { result } = renderHook(() => useChartLegend({}, libDefaults), {
    wrapper: Wrapper,
  });

  const item = result.current.items[0];
  const bind = item ? result.current.getItemBind(item) : {};

  expect(bind.type).toBe("button");
  expect(bind["aria-pressed"]).toBe(true);
});

test("it should omit button semantics when not interactive", () => {
  const { result } = renderHook(
    () => useChartLegend({ interactive: false }, libDefaults),
    { wrapper: Wrapper },
  );

  const item = result.current.items[0];
  const bind = item ? result.current.getItemBind(item) : {};

  expect(bind.type).toBeUndefined();
  expect(bind["aria-pressed"]).toBeUndefined();
});
