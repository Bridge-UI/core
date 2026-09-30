// ** External Imports
import { cleanup, renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, expect, test } from "vitest";

// ** Local Imports
import { Chart } from "@/Components/Chart";
import { useChartContext } from "@/Components/Chart/ChartContext";
import { useChartSeries } from "@/Components/ChartSeries";
import { BridgeUIProvider } from "@/Provider";

afterEach(() => {
  cleanup();
});

function Wrapper({ children }: { children: ReactNode }) {
  return <Chart categories={["Jan", "Feb"]}>{children}</Chart>;
}

const libDefaults = { type: "line", curve: "linear" } as const;

test("it should build the entry from props and defaults", () => {
  const { result } = renderHook(
    () => useChartSeries({ name: "A", data: [1, 2] }, libDefaults),
    { wrapper: Wrapper },
  );

  expect(result.current.entry).toMatchObject({
    name: "A",
    type: "line",
    data: [1, 2],
    curve: "linear",
  });
});

test("it should register the entry in the chart context", () => {
  const { result } = renderHook(
    () => {
      const series = useChartSeries(
        { name: "A", type: "bar", data: [1, 2], curve: "smooth" },
        libDefaults,
      );

      return { series, chart: useChartContext() };
    },
    { wrapper: Wrapper },
  );

  expect(result.current.chart.series).toHaveLength(1);
  expect(result.current.chart.series[0]?.type).toBe("bar");
  expect(result.current.chart.series[0]?.curve).toBe("smooth");
  expect(result.current.chart.series[0]?.id).toBe(
    result.current.series.entry.id,
  );
});

test("it should apply the registry default type", () => {
  function ProviderWrapper({ children }: { children: ReactNode }) {
    return (
      <BridgeUIProvider
        components={{ ChartSeries: { defaultProps: { type: "bar" } } }}
      >
        <Chart categories={["Jan", "Feb"]}>{children}</Chart>
      </BridgeUIProvider>
    );
  }

  const { result } = renderHook(
    () => useChartSeries({ name: "A", data: [1, 2] }, libDefaults),
    { wrapper: ProviderWrapper },
  );

  expect(result.current.entry.type).toBe("bar");
});

test("it should throw outside a Chart", () => {
  expect(() =>
    renderHook(() => useChartSeries({ name: "A", data: [1] }, libDefaults)),
  ).toThrow("Chart components must be used within a Chart");
});
